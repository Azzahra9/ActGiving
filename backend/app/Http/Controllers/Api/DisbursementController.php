<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Disbursement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * @group Pencairan Dana
 *
 * Pengajuan dan persetujuan pencairan dana kampanye (FR-11).
 */
class DisbursementController extends Controller
{
    /**
     * Ajukan Pencairan Dana (Inisiator)
     *
     * Inisiator: Mengajukan Pencairan Dana (FR-11).
     */
    public function store(Request $request, $id): JsonResponse
    {
        $campaign = Campaign::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'amount' => 'required|numeric|min:10000',
            'bank_name' => 'required|string|max:100',
            'bank_account' => 'required|string|max:50',
        ]);

        // Cek total pencairan yang sedang pending
        $pendingAmount = Disbursement::where('campaign_id', $campaign->id)
            ->where('status', 'pending')
            ->sum('amount');

        $availableBalance = max(0, $campaign->current_amount - $pendingAmount);

        if ($validated['amount'] > $availableBalance) {
            return response()->json([
                'success' => false,
                'message' => "Nominal pencairan (Rp {$validated['amount']}) melebihi sisa dana yang dapat ditarik (Rp {$availableBalance}).",
            ], 422);
        }

        $disbursement = Disbursement::create([
            'campaign_id' => $campaign->id,
            'user_id' => $request->user()->id,
            'amount' => $validated['amount'],
            'bank_name' => $validated['bank_name'],
            'bank_account' => $validated['bank_account'],
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
        $campaign = Campaign::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

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
