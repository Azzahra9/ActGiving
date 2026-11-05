<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Disbursement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * @group Pencairan Dana (DIS-01)
 *
 * Pengajuan dan persetujuan pencairan dana kampanye (FR-11 / DIS-01).
 */
class DisbursementController extends Controller
{
    /**
     * Ajukan Pencairan Dana (Inisiator - DIS-01)
     *
     * Inisiator: Mengajukan Pencairan Dana (FR-11 / DIS-01).
     */
    public function store(Request $request, $id): JsonResponse
    {
        $campaignId = is_numeric($id) ? (int) $id : (int) preg_replace('/\D/', '', (string) $id);
        $campaign = Campaign::where('id', $campaignId ?: $id)->first();

        if (! $campaign) {
            return response()->json([
                'success' => false,
                'message' => 'Kampanye tidak ditemukan.',
            ], 404);
        }

        // Pastikan user adalah inisiator pembuat kampanye atau admin
        if ($campaign->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki otorisasi untuk mengajukan pencairan pada kampanye ini.',
            ], 403);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:10000',
            'bank_name' => 'required|string|max:100',
            'account_number' => 'nullable|string|max:50',
            'bank_account' => 'nullable|string|max:50',
            'account_name' => 'nullable|string|max:150',
            'reason' => 'nullable|string|max:1000',
        ]);

        $accountNumber = $request->input('account_number') ?? $request->input('bank_account');
        if (! $accountNumber) {
            return response()->json([
                'success' => false,
                'message' => 'Nomor rekening tujuan pencairan wajib diisi.',
                'errors' => ['account_number' => ['Nomor rekening wajib diisi.']],
            ], 422);
        }

        $accountName = $request->input('account_name') ?? $request->user()->name;
        $reason = $request->input('reason') ?? 'Pengajuan pencairan dana program kampanye.';

        // Cek total pencairan yang sedang pending
        $pendingAmount = Disbursement::where('campaign_id', $campaign->id)
            ->where('status', 'pending')
            ->sum('amount');

        $currentBal = (float) ($campaign->current_amount ?? 0);
        $paidDonations = (float) $campaign->donations()->where('status', 'paid')->sum('amount');
        $approvedDisbursed = (float) Disbursement::where('campaign_id', $campaign->id)->where('status', 'approved')->sum('amount');
        $calculatedBalance = max(0, $paidDonations - $approvedDisbursed);
        $effectiveBalance = max($currentBal, $calculatedBalance);

        $availableBalance = max(0, $effectiveBalance - $pendingAmount);

        // Jika kampanye memiliki saldo positif dan nominal melebihi sisa dana
        if ($effectiveBalance > 0 && $validated['amount'] > $availableBalance) {
            return response()->json([
                'success' => false,
                'message' => 'Nominal pencairan (Rp '.number_format($validated['amount'], 0, ',', '.').') melebihi sisa dana yang dapat ditarik (Rp '.number_format($availableBalance, 0, ',', '.').').',
            ], 422);
        }

        $disbursement = Disbursement::create([
            'campaign_id' => $campaign->id,
            'user_id' => $request->user()->id,
            'amount' => $validated['amount'],
            'bank_name' => $validated['bank_name'],
            'bank_account' => $accountNumber,
            'account_number' => $accountNumber,
            'account_name' => $accountName,
            'reason' => $reason,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan pencairan dana berhasil diajukan dan menunggu persetujuan Administrator.',
            'data' => $disbursement,
        ], 201);
    }

    /**
     * Riwayat Pencairan Kampanye (Inisiator)
     *
     * Inisiator: Melihat Riwayat Pencairan Dana Kampanye Miliknya.
     */
    public function indexByCampaign(Request $request, $id): JsonResponse
    {
        $campaignId = is_numeric($id) ? (int) $id : (int) preg_replace('/\D/', '', (string) $id);
        $campaign = Campaign::where('id', $campaignId ?: $id)->first();

        if (! $campaign) {
            return response()->json([
                'success' => false,
                'message' => 'Kampanye tidak ditemukan.',
            ], 404);
        }

        if ($campaign->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki hak akses untuk melihat riwayat pencairan kampanye ini.',
            ], 403);
        }

        $disbursements = Disbursement::where('campaign_id', $campaign->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'campaign_title' => $campaign->title,
                'current_amount' => $campaign->current_amount,
                'disbursements' => $disbursements,
            ],
        ]);
    }

    /**
     * Setujui / Tolak Pencairan Dana (Admin, ACID)
     *
     * Admin: Menyetujui atau Menolak Pencairan Dana (FR-11).
     * WAJIB ACID Transaction & lockForUpdate() untuk mencegah double-withdraw.
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request, $id) {
            // Lock baris pengajuan pencairan
            $disbursement = Disbursement::where('id', $id)
                ->lockForUpdate()
                ->first();

            if (! $disbursement) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data pengajuan pencairan dana tidak ditemukan.',
                ], 404);
            }

            if ($disbursement->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => "Pengajuan ini telah diproses sebelumnya dengan status: {$disbursement->status}.",
                ], 422);
            }

            // Lock baris kampanye
            $campaign = Campaign::where('id', $disbursement->campaign_id)
                ->lockForUpdate()
                ->first();

            $newStatus = $request->status;

            if ($newStatus === 'approved') {
                // Pastikan saldo mencukupi
                if ($campaign->current_amount < $disbursement->amount) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Saldo kampanye saat ini tidak mencukupi untuk dicairkan.',
                    ], 400);
                }

                // Kurangi current_amount kampanye secara atomik
                $campaign->current_amount -= $disbursement->amount;
                $campaign->save();
            }

            $disbursement->status = $newStatus;
            $disbursement->admin_notes = $request->admin_notes ?? null;
            $disbursement->save();

            return response()->json([
                'success' => true,
                'message' => "Pengajuan pencairan dana telah di-{$newStatus}.",
                'data' => [
                    'disbursement' => $disbursement,
                    'campaign_current_amount' => $campaign->current_amount,
                ],
            ]);
        });
    }
}
