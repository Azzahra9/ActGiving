<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\CampaignReport;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Laporan Aduan
 *
 * Pelaporan kampanye fiktif oleh publik (REP-01 / FR-13).
 */
class CampaignReportController extends Controller
{
    protected FileUploadService $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Kirim Laporan Aduan Kampanye (REP-01)
     *
     * Publik / User: Mengirimkan form aduan kampanye fiktif/penipuan beserta bukti opsional.
     *
     * @unauthenticated
     */
    public function store(Request $request, $id): JsonResponse
    {
        $campaign = Campaign::findOrFail($id);

        $validated = $request->validate([
            'reporter_name' => 'required|string|max:255',
            'reporter_email' => 'required|email|max:255',
            'category' => 'required|string|max:100',
            'description' => 'required|string|max:5000',
            'evidence' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp,pdf|max:2048',
        ], [
            'reporter_name.required' => 'Nama lengkap pelapor wajib diisi.',
            'reporter_email.required' => 'Email pelapor wajib diisi.',
            'reporter_email.email' => 'Format alamat email tidak valid.',
            'category.required' => 'Kategori aduan wajib dipilih.',
            'description.required' => 'Deskripsi atau kronologi kejanggalan wajib diisi.',
            'evidence.file' => 'Bukti aduan harus berupa berkas yang valid.',
            'evidence.mimes' => 'File bukti harus berupa gambar (JPG, JPEG, PNG, GIF, WEBP) atau PDF.',
            'evidence.max' => 'Ukuran file bukti maksimal 2MB.',
        ]);

        $evidencePath = null;
        if ($request->hasFile('evidence')) {
            $uploadResult = $this->fileUploadService->upload($request->file('evidence'), 'reports');
            $evidencePath = $uploadResult['path'];
        }

        // Ambil user_id secara opsional jika pelapor mengirimkan token Sanctum valid
        $user = $request->user('sanctum');

        $report = CampaignReport::create([
            'campaign_id' => $campaign->id,
            'user_id' => $user?->id,
            'reporter_name' => trim($validated['reporter_name']),
            'reporter_email' => trim($validated['reporter_email']),
            'category' => trim($validated['category']),
            'reason_category' => trim($validated['category']),
            'description' => trim($validated['description']),
            'evidence_path' => $evidencePath,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Terima kasih. Laporan aduan Anda berhasil dikirim dan akan segera diinvestigasi oleh Tim Audit ActGiving.',
            'data' => $report,
        ], 201);
    }

    /**
     * Daftar Laporan Aduan (Admin)
     *
     * Admin: Melihat daftar laporan/aduan kampanye masuk (REP-01 / FR-13).
     */
    public function indexAdmin(Request $request): JsonResponse
    {
        $query = CampaignReport::with([
            'campaign:id,title,user_id,status',
            'user:id,name,email',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $reports = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $reports,
        ]);
    }
}
