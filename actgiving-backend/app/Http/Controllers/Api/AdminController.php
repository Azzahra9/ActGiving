<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\CampaignReport;
use App\Models\Disbursement;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * @group Administrator
 *
 * Endpoint moderasi kampanye dan verifikasi pengguna khusus Admin.
 */
class AdminController extends Controller
{
    /**
     * Semua Kampanye (Moderasi Admin)
     *
     * Admin: Melihat daftar semua kampanye untuk moderasi.
     */
    public function indexCampaigns(Request $request): JsonResponse
    {
        $query = Campaign::with(['category', 'user:id,name,email,is_verified', 'lpjReports']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $campaigns = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $campaigns,
        ]);
    }

    /**
     * Ubah Status Kampanye (Admin)
     *
     * Admin: Moderasi status kampanye (active / rejected / closed / suspended).
     */
    public function updateCampaignStatus(Request $request, $id): JsonResponse
    {
        $campaign = Campaign::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:active,rejected,closed,suspended',
        ]);

        $campaign->status = $validated['status'];
        $campaign->save();

        return response()->json([
            'success' => true,
            'message' => "Status kampanye berhasil diubah menjadi: {$campaign->status}.",
            'data' => $campaign,
        ]);
    }

    /**
     * Hentikan / Suspend Kampanye (Admin)
     *
     * Admin: Menghentikan/menangguhkan kampanye secara paksa jika ada pelanggaran.
     */
    public function suspendCampaign(Request $request, $id): JsonResponse
    {
        $campaign = Campaign::findOrFail($id);

        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $campaign->status = 'suspended';
        $campaign->save();

        return response()->json([
            'success' => true,
            'message' => "Kampanye '{$campaign->title}' berhasil dihentikan/ditangguhkan oleh Admin.",
            'data' => $campaign,
            'reason' => $validated['reason'] ?? null,
        ]);
    }

    /**
     * Daftar Pengguna (Admin)
     *
     * Admin: Melihat daftar pengguna sistem.
     */
    public function indexUsers(Request $request): JsonResponse
    {
        $query = User::select('id', 'name', 'email', 'phone_whatsapp', 'city_domicile', 'identity_doc_url', 'is_verified', 'role', 'created_at');

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('is_verified')) {
            $query->where('is_verified', $request->boolean('is_verified'));
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('city_domicile', 'like', "%{$search}%");
            });
        }

        $perPage = (int) $request->input('per_page', 50);
        $users = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Verifikasi Pengguna / Inisiator (Admin - AUTH-04)
     *
     * Admin: Verifikasi akun/dokumen identitas pengguna menjadi inisiator terverifikasi.
     */
    public function verifyUser(Request $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $request->validate([
            'is_verified' => 'nullable|boolean',
        ]);

        // Default ke true jika tidak disertakan dalam body (misal PATCH tanpa payload)
        $isVerified = $request->has('is_verified')
            ? $request->boolean('is_verified')
            : true;

        $user->is_verified = $isVerified;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => $user->is_verified
                ? "Pengguna {$user->name} berhasil diverifikasi sebagai Inisiator Terpercaya."
                : "Status verifikasi pengguna {$user->name} berhasil dicabut.",
            'data' => $user,
        ]);
    }

    /**
     * Antrean Pencairan Dana (Admin - DIS-02)
     *
     * Admin: Mengambil semua data pencairan beserta relasi campaign dan user.
     * Urutkan dari yang berstatus pending terlebih dahulu, kemudian terbaru.
     */
    public function indexDisbursements(Request $request): JsonResponse
    {
        $query = Disbursement::with([
            'campaign' => function ($q) {
                $q->select('id', 'user_id', 'category_id', 'title', 'target_amount', 'current_amount', 'status');
            },
            'campaign.user:id,name,email',
            'user:id,name,email,phone_whatsapp,city_domicile',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('bank_name', 'like', "%{$search}%")
                  ->orWhere('account_number', 'like', "%{$search}%")
                  ->orWhere('account_name', 'like', "%{$search}%")
                  ->orWhere('reason', 'like', "%{$search}%")
                  ->orWhereHas('campaign', function ($cq) use ($search) {
                      $cq->where('title', 'like', "%{$search}%");
                  })
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $disbursements = $query
            ->orderByRaw("CASE WHEN status = 'pending' THEN 0 ELSE 1 END")
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar pengajuan pencairan dana berhasil dimuat.',
            'data' => $disbursements,
        ]);
    }

    /**
     * Validasi Status Pencairan Dana (Admin - DIS-02)
     *
     * Admin: Memvalidasi payload (status hanya boleh approved atau rejected).
     * Ubah status pencairan tersebut di database secara ACID.
     */
    public function updateDisbursementStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_notes' => 'nullable|string|max:1000',
            'reason' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:1000',
        ]);

        return DB::transaction(function () use ($request, $id) {
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

            $campaign = Campaign::where('id', $disbursement->campaign_id)
                ->lockForUpdate()
                ->first();

            $newStatus = $request->status;

            if ($newStatus === 'approved' && $campaign) {
                if ($campaign->current_amount < $disbursement->amount) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Saldo kampanye saat ini tidak mencukupi untuk dicairkan.',
                    ], 400);
                }

                $campaign->current_amount -= $disbursement->amount;
                $campaign->save();
            }

            $adminNotes = $request->input('admin_notes')
                ?? $request->input('reason')
                ?? $request->input('notes')
                ?? ($newStatus === 'approved' ? 'Disetujui oleh Administrator' : 'Ditolak oleh Administrator');

            $disbursement->status = $newStatus;
            $disbursement->admin_notes = $adminNotes;
            $disbursement->save();

            $disbursement->load(['campaign.user:id,name,email', 'user:id,name,email']);

            return response()->json([
                'success' => true,
                'message' => 'Status pencairan berhasil diperbarui.',
                'data' => [
                    'disbursement' => $disbursement,
                    'campaign_current_amount' => $campaign?->current_amount,
                ],
            ]);
        });
    }

    /**
     * Daftar Laporan Aduan Kampanye (Admin - REP-02)
     *
     * Admin: Mengambil seluruh data laporan aduan beserta relasi campaign dan user,
     * diurutkan dari status 'pending' terlebih dahulu.
     */
    public function indexReports(Request $request): JsonResponse
    {
        $query = CampaignReport::with([
            'campaign:id,title,user_id,status,location,image_url',
            'campaign.user:id,name,email',
            'user:id,name,email',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reporter_name', 'like', "%{$search}%")
                  ->orWhere('reporter_email', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('campaign', function ($cq) use ($search) {
                      $cq->where('title', 'like', "%{$search}%");
                  });
            });
        }

        $perPage = (int) $request->input('per_page', 50);

        $reports = $query
            ->orderByRaw("CASE WHEN status = 'pending' THEN 0 WHEN status = 'investigating' THEN 1 WHEN status = 'resolved' THEN 2 ELSE 3 END")
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Daftar laporan aduan kampanye berhasil dimuat.',
            'data' => $reports,
        ]);
    }

    /**
     * Ubah Status Laporan Aduan (Admin - REP-02)
     *
     * Admin: Mengubah status aduan menjadi investigating, resolved, dismissed, atau pending.
     */
    public function updateReportStatus(Request $request, $id): JsonResponse
    {
        $report = CampaignReport::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,investigating,resolved,dismissed',
        ], [
            'status.required' => 'Status laporan aduan wajib diisi.',
            'status.in' => 'Status laporan tidak valid. Pilihan: pending, investigating, resolved, dismissed.',
        ]);

        $report->status = $validated['status'];
        $report->save();

        $report->load([
            'campaign:id,title,user_id,status,location,image_url',
            'campaign.user:id,name,email',
            'user:id,name,email',
        ]);

        return response()->json([
            'success' => true,
            'message' => "Status laporan aduan berhasil diubah menjadi: {$report->status}.",
            'data' => $report,
        ]);
    }
}
