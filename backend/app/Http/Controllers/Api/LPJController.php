<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\LpjReport;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Laporan Pertanggungjawaban (LPJ)
 *
 * Endpoint pengelolaan LPJ digital, verifikasi audit admin, dan kontrol status.
 */
class LPJController extends Controller
{
    protected FileUploadService $fileUploadService;

    /**
     * Dependency Injection untuk FileUploadService terpusat.
     */
    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Daftar LPJ Publik Suatu Kampanye
     *
     * HANYA menampilkan LPJ yang berstatus 'verified' atau 'sah' untuk konsumsi publik.
     * Inisiator pemilik kampanye atau Admin dapat melihat seluruh status bila diminta.
     *
     * @unauthenticated
     */
    public function index(Request $request, $campaign_id): JsonResponse
    {
        $campaign = Campaign::findOrFail($campaign_id);

        $query = $campaign->lpjReports();

        // Cek apakah requester adalah pemilik atau admin yang meminta semua LPJ
        $user = $request->user('sanctum');
        $canSeeAll = $user && ($user->id === $campaign->user_id || $user->role === 'admin');

        if (!$canSeeAll || !$request->boolean('all')) {
            $query->whereIn('status', ['verified', 'sah']);
        }

        $lpjReports = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => [
                'campaign_id' => $campaign->id,
                'campaign_title' => $campaign->title,
                'lpj_reports' => $lpjReports,
            ],
        ]);
    }

    /**
     * Upload LPJ Baru (Inisiator, FR-12)
     *
     * Status awal: 'pending' (Menunggu Review & Verifikasi Sah oleh Admin).
     */
    public function store(Request $request, $campaign_id): JsonResponse
    {
        // 1. Verifikasi kepemilikan kampanye
        $campaign = Campaign::where('id', $campaign_id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        // 2. Validasi input & berkas gambar
        $request->validate([
            'description' => 'required|string|min:10',
            'title' => 'nullable|string|max:255',
            'amount_spent' => 'nullable|numeric|min:0',
            'field_location' => 'nullable|string|max:255',
            'beneficiaries_count' => 'nullable|integer|min:0',
            'volunteers_involved' => 'nullable|integer|min:0',
            'budget_items' => 'nullable',
            'proof_image' => 'nullable|file|image|mimes:jpeg,png,jpg,webp|max:5120',
            'activity_photos' => 'nullable|array',
            'activity_photos.*' => 'nullable|file|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if (!$request->hasFile('proof_image') && !$request->hasFile('activity_photos')) {
            return response()->json([
                'success' => false,
                'message' => 'Harap unggah minimal satu bukti berkas gambar (proof_image atau activity_photos).',
            ], 422);
        }

        $proofUrl = null;
        $fileStoredPath = null;
        $activityPhotoUrls = [];

        // 3. Upload berkas proof_image jika ada
        if ($request->hasFile('proof_image')) {
            $uploadResult = $this->fileUploadService->upload(
                $request->file('proof_image'),
                'lpj_proofs'
            );
            $proofUrl = $uploadResult['url'];
            $fileStoredPath = $uploadResult['path'];
            $activityPhotoUrls[] = $proofUrl;
        }

        // 4. Upload berkas activity_photos jika ada
        if ($request->hasFile('activity_photos')) {
            foreach ($request->file('activity_photos') as $photoFile) {
                if ($photoFile) {
                    $uploaded = $this->fileUploadService->upload($photoFile, 'lpj_proofs');
                    $activityPhotoUrls[] = $uploaded['url'];
                    if (!$proofUrl) {
                        $proofUrl = $uploaded['url'];
                        $fileStoredPath = $uploaded['path'];
                    }
                }
            }
        }

        $activityPhotoUrls = array_values(array_unique($activityPhotoUrls));

        // Parse budget_items jika berbentuk JSON string
        $budgetItems = $request->input('budget_items');
        if (is_string($budgetItems)) {
            $budgetItems = json_decode($budgetItems, true);
        }

        // 5. Simpan record LPJ ke database dengan status 'pending_audit'
        $lpjReport = LpjReport::create([
            'campaign_id' => $campaign->id,
            'status' => 'pending_audit',
            'title' => $request->input('title', 'Penyaluran Bantuan Lapangan'),
            'description' => $request->description,
            'amount_spent' => $request->input('amount_spent', 0),
            'budget_items' => $budgetItems,
            'beneficiaries_count' => $request->input('beneficiaries_count', 0),
            'volunteers_involved' => $request->input('volunteers_involved', 0),
            'field_location' => $request->input('field_location', $campaign->location),
            'proof_image_url' => $proofUrl ?? '',
            'activity_photos' => $activityPhotoUrls,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Laporan Pertanggungjawaban (LPJ) berhasil diunggah. Menunggu verifikasi sah oleh Admin platform.',
            'data' => [
                'lpj_report' => $lpjReport,
                'file_stored_path' => $fileStoredPath,
                'public_url' => $proofUrl,
                'activity_photo_urls' => $activityPhotoUrls,
            ],
        ], 201);
    }

    /**
     * Update LPJ (Inisiator)
     *
     * ATURAN PENGUNCIAN: Jika LPJ sudah berstatus 'verified' atau 'sah',
     * Inisiator DILARANG mengubah data (Read-Only / 403 Forbidden).
     */
    public function update(Request $request, $campaign_id, $id): JsonResponse
    {
        $campaign = Campaign::where('id', $campaign_id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $lpj = LpjReport::where('campaign_id', $campaign->id)->findOrFail($id);

        // ATURAN PENGUNCIAN: Status verified / sah terkunci secara permanen bagi Inisiator
        if (in_array(strtolower($lpj->status), ['verified', 'sah'])) {
            return response()->json([
                'success' => false,
                'message' => 'Laporan Pertanggungjawaban (LPJ) ini telah diverifikasi Sah oleh Admin dan berstatus Terkunci (Read-Only). Perubahan tidak diizinkan demi integritas audit.',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|min:10',
            'amount_spent' => 'sometimes|numeric|min:0',
            'field_location' => 'nullable|string|max:255',
            'beneficiaries_count' => 'nullable|integer|min:0',
            'volunteers_involved' => 'nullable|integer|min:0',
            'budget_items' => 'nullable',
            'proof_image' => 'nullable|file|image|mimes:jpeg,png,jpg,webp|max:5120',
            'activity_photos' => 'nullable|array',
            'activity_photos.*' => 'nullable|file|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($request->hasFile('proof_image')) {
            $uploadResult = $this->fileUploadService->upload(
                $request->file('proof_image'),
                'lpj_proofs'
            );
            $validated['proof_image_url'] = $uploadResult['url'];
        }

        if ($request->hasFile('activity_photos')) {
            $currentPhotos = $lpj->activity_photos ?: [];
            foreach ($request->file('activity_photos') as $photoFile) {
                if ($photoFile) {
                    $uploaded = $this->fileUploadService->upload($photoFile, 'lpj_proofs');
                    $currentPhotos[] = $uploaded['url'];
                }
            }
            $validated['activity_photos'] = array_values(array_unique($currentPhotos));
        }

        if ($request->has('budget_items') && is_string($request->input('budget_items'))) {
            $validated['budget_items'] = json_decode($request->input('budget_items'), true);
        }

        $lpj->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Laporan Pertanggungjawaban (LPJ) berhasil diperbarui.',
            'data' => $lpj,
        ]);
    }

    /**
     * Hapus LPJ (Inisiator)
     *
     * ATURAN PENGUNCIAN: Jika LPJ sudah berstatus 'verified' atau 'sah',
     * Inisiator DILARANG menghapus data (403 Forbidden).
     */
    public function destroy(Request $request, $campaign_id, $id): JsonResponse
    {
        $campaign = Campaign::where('id', $campaign_id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $lpj = LpjReport::where('campaign_id', $campaign->id)->findOrFail($id);

        // ATURAN PENGUNCIAN
        if (in_array(strtolower($lpj->status), ['verified', 'sah'])) {
            return response()->json([
                'success' => false,
                'message' => 'Laporan Pertanggungjawaban (LPJ) ini telah diverifikasi Sah oleh Admin dan berstatus Terkunci. Penghapusan tidak diizinkan demi transparansi publik.',
            ], 403);
        }

        // Hapus file gambar jika ada
        if ($lpj->proof_image_url) {
            $this->fileUploadService->delete($lpj->proof_image_url);
        }

        $lpj->delete();

        return response()->json([
            'success' => true,
            'message' => 'Laporan Pertanggungjawaban (LPJ) berhasil dihapus.',
        ]);
    }

    /**
     * Daftar Seluruh LPJ untuk Audit Admin
     *
     * Admin: Melihat seluruh antrean LPJ beserta statusnya.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = LpjReport::with([
            'campaign:id,title,user_id,status,location',
            'campaign.user:id,name,email',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $reports = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $reports,
        ]);
    }

    /**
     * Ubah Status LPJ oleh Admin (Verifikasi Sah / Batal)
     *
     * Endpoint: PATCH/PUT /api/admin/lpj/{id}/status atau /api/admin/lpj/{id}
     */
    public function adminUpdateStatus(Request $request, $id): JsonResponse
    {
        $lpj = LpjReport::with('campaign')->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:verified,sah,pending,pending_audit,needs_review,rejected',
        ]);

        $status = strtolower($validated['status']);
        if ($status === 'sah') {
            $status = 'verified';
        } elseif (in_array($status, ['pending', 'needs_review'])) {
            $status = 'pending_audit';
        }

        $lpj->status = $status;
        $lpj->verified_at = ($status === 'verified') ? now() : null;
        $lpj->save();

        $message = $status === 'verified'
            ? 'Laporan Pertanggungjawaban (LPJ) berhasil diverifikasi SAH dan kini tampil di linimasa publik.'
            : 'Status LPJ berhasil diubah menjadi: ' . $status;

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $lpj,
        ]);
    }

    /**
     * Verifikasi Sah LPJ (Admin Shortcut)
     *
     * Endpoint: PATCH /api/admin/lpj/{id}/verify
     */
    public function adminVerify($id): JsonResponse
    {
        $lpj = LpjReport::with('campaign')->findOrFail($id);
        $lpj->status = 'verified';
        $lpj->verified_at = now();
        $lpj->save();

        return response()->json([
            'success' => true,
            'message' => 'Laporan Pertanggungjawaban (LPJ) berhasil dinyatakan SAH dan Terverifikasi.',
            'data' => $lpj,
        ]);
    }

    /**
     * Batalkan Verifikasi LPJ (Admin Shortcut)
     *
     * Endpoint: PATCH /api/admin/lpj/{id}/unverify
     */
    public function adminUnverify($id): JsonResponse
    {
        $lpj = LpjReport::with('campaign')->findOrFail($id);
        $lpj->status = 'pending_audit';
        $lpj->verified_at = null;
        $lpj->save();

        return response()->json([
            'success' => true,
            'message' => 'Status verifikasi LPJ dibatalkan untuk peninjauan ulang.',
            'data' => $lpj,
        ]);
    }
}
