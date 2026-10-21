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
 * Upload bukti laporan kegiatan kampanye (FR-12).
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
     * Daftar LPJ Kampanye
     *
     * Menampilkan riwayat LPJ suatu kampanye.
     *
     * @unauthenticated
     */
    public function index($campaign_id): JsonResponse
    {
        $campaign = Campaign::findOrFail($campaign_id);
        $lpjReports = $campaign->lpjReports()->latest()->get();

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
     * Upload LPJ & Bukti Gambar (Inisiator, FR-12)
     *
     * Inisiator: Mengunggah Laporan Pertanggungjawaban (LPJ) beserta bukti gambar fisik.
     * Menggunakan FileUploadService untuk menyimpan ke public storage disk.
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
            'proof_image' => 'required|file|image|mimes:jpeg,png,jpg,webp|max:5120', // Maks 5MB
        ]);

        // 3. Upload berkas menggunakan FileUploadService ke folder 'lpj_proofs'
        $uploadResult = $this->fileUploadService->upload(
            $request->file('proof_image'),
            'lpj_proofs'
        );

        // 4. Simpan record LPJ ke database
        $lpjReport = LpjReport::create([
            'campaign_id' => $campaign->id,
            'description' => $request->description,
            'proof_image_url' => $uploadResult['url'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Laporan Pertanggungjawaban (LPJ) beserta bukti berhasil diunggah.',
            'data' => [
                'lpj_report' => $lpjReport,
                'file_stored_path' => $uploadResult['path'],
                'public_url' => $uploadResult['url'],
            ],
        ], 201);
    }
}
