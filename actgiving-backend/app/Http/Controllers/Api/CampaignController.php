<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Category;
use App\Models\LpjReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Kampanye Publik
 *
 * Endpoint untuk menelusuri dan mengelola kampanye donasi & kerelawanan.
 */
class CampaignController extends Controller
{
    /**
     * Daftar Kampanye Aktif
     *
     * Menampilkan daftar kampanye publik (Hanya status 'active').
     * Mendukung filter: category_id, campaign_mode, search query.
     *
     * @unauthenticated
     */
    public function index(Request $request): JsonResponse
    {
        $query = Campaign::with([
            'category:id,category_name',
            'user:id,name,is_verified',
            'lpjReports' => function ($q) {
                $q->whereIn('status', ['verified', 'sah'])->latest();
            },
        ]);

        // Filter status kampanye: HANYA status 'active' dan 'closed' (disetujui) untuk endpoint publik.
        // Status 'pending' dan 'rejected' dilarang keras tampil pada katalog publik/donatur luar.
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $query->whereIn('status', ['active', 'closed']);
        }

        // Filter berdasarkan kategori
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter berdasarkan mode kampanye (fund_only, volunteer_only, both)
        if ($request->filled('campaign_mode')) {
            $query->where('campaign_mode', $request->campaign_mode);
        }

        // Pencarian judul / lokasi
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('location', 'ilike', "%{$search}%");
            });
        }

        $campaigns = $query->latest()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $campaigns,
        ]);
    }

    /**
     * Detail Kampanye
     *
     * Menampilkan detail kampanye publik beserta inisiator, kategori, & LPJ.
     *
     * @unauthenticated
     */
    public function show($id): JsonResponse
    {
        $campaign = Campaign::with([
            'category:id,category_name',
            'user:id,name,city_domicile,is_verified',
            'schedules',
            'lpjReports' => function ($q) {
                $q->whereIn('status', ['verified', 'sah'])->latest();
            },
        ])
        ->withCount([
            'donations as total_donors' => function ($q) {
                $q->where('status', 'paid');
            },
            'volunteerRegistrations as approved_volunteers_count' => function ($q) {
                $q->where('status', 'accepted');
            },
        ])
        ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $campaign,
        ]);
    }

    /**
     * Buat Kampanye Baru (Inisiator)
     *
     * Inisiator: Membuat pengajuan kampanye baru (status awal: 'pending').
     */
    public function store(Request $request): JsonResponse
    {
        // Resolusi Kategori Otomatis: jika user mengetik nama kategori baru atau mengirim category_name
        if ($request->filled('category_name') && ! $request->filled('category_id')) {
            $categoryName = trim($request->category_name);
            $cat = Category::whereRaw('LOWER(category_name) = ?', [strtolower($categoryName)])->first()
                ?? Category::create(['category_name' => $categoryName]);
            $request->merge(['category_id' => $cat->id]);
        } elseif ($request->filled('category_id') && ! is_numeric($request->category_id)) {
            $categoryName = trim($request->category_id);
            $cat = Category::whereRaw('LOWER(category_name) = ?', [strtolower($categoryName)])->first()
                ?? Category::create(['category_name' => $categoryName]);
            $request->merge(['category_id' => $cat->id]);
        } elseif ($request->filled('category_id') && $request->filled('category_name')) {
            if (! Category::where('id', $request->category_id)->exists()) {
                $categoryName = trim($request->category_name);
                $cat = Category::whereRaw('LOWER(category_name) = ?', [strtolower($categoryName)])->first()
                    ?? Category::create(['category_name' => $categoryName]);
                $request->merge(['category_id' => $cat->id]);
            }
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'category_name' => 'nullable|string|max:100',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'campaign_mode' => 'required|in:fund_only,volunteer_only,both',
            'target_amount' => 'required_if:campaign_mode,fund_only,both|numeric|min:0',
            'target_volunteers' => 'required_if:campaign_mode,volunteer_only,both|integer|min:0',
            'location' => 'required|string|max:255',
            'activity_date' => 'nullable|date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'image_url' => 'nullable|string|max:500',
        ], [
            'category_id.required' => 'Kategori kampanye wajib dipilih atau diisi.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid atau belum terdaftar di database.',
            'title.required' => 'Judul kampanye aksi wajib diisi.',
            'description.required' => 'Deskripsi urgensi lapangan kampanye wajib diisi.',
            'campaign_mode.required' => 'Mode kampanye wajib dipilih.',
            'campaign_mode.in' => 'Mode kampanye harus salah satu dari: fund_only, volunteer_only, both.',
            'target_amount.required_if' => 'Target nominal donasi wajib diisi untuk mode donasi.',
            'target_volunteers.required_if' => 'Target kuota relawan wajib diisi untuk mode relawan.',
            'location.required' => 'Kota/lokasi kegiatan wajib diisi.',
            'activity_date.date' => 'Format tanggal kegiatan tidak valid.',
            'image.image' => 'Berkas banner harus berupa gambar.',
            'image.mimes' => 'Format gambar harus JPG, JPEG, PNG, atau WebP.',
            'image.max' => 'Ukuran gambar maksimal 5 MB.',
        ]);

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $uploader = app(\App\Services\FileUploadService::class);
            $uploadResult = $uploader->upload($request->file('image'), 'campaigns');
            $imageUrl = $uploadResult['url'];
        } elseif ($request->filled('image_url')) {
            $candidateUrl = trim((string) $request->image_url);
            $imageUrl = \App\Services\FileUploadService::isDummyImageUrl($candidateUrl) ? null : $candidateUrl;
        }

        $campaign = Campaign::create([
            'user_id' => $request->user()->id,
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'campaign_mode' => $validated['campaign_mode'],
            'target_amount' => $validated['target_amount'] ?? 0,
            'current_amount' => 0,
            'target_volunteers' => $validated['target_volunteers'] ?? 0,
            'current_volunteers' => 0,
            'location' => $validated['location'],
            'activity_date' => $validated['activity_date'] ?? null,
            'image_url' => $imageUrl,
            'status' => 'pending', // Menunggu moderasi admin
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan kampanye berhasil disimpan dan menunggu moderasi Admin.',
            'data' => $campaign->load('category'),
        ], 201);
    }

    /**
     * Kampanye Saya (Inisiator)
     *
     * Inisiator: Melihat daftar kampanye miliknya sendiri.
     */
    public function myCampaigns(Request $request): JsonResponse
    {
        $campaigns = Campaign::with(['category', 'lpjReports', 'schedules', 'disbursements'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $campaigns,
        ]);
    }

    /**
     * Update Data Kampanye (Inisiator)
     *
     * Inisiator: Memperbarui data kampanye miliknya sendiri.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $campaign = Campaign::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        // Resolusi Kategori Otomatis jika memperbarui kategori
        if ($request->filled('category_name') && ! $request->filled('category_id')) {
            $categoryName = trim($request->category_name);
            $cat = Category::whereRaw('LOWER(category_name) = ?', [strtolower($categoryName)])->first()
                ?? Category::create(['category_name' => $categoryName]);
            $request->merge(['category_id' => $cat->id]);
        } elseif ($request->filled('category_id') && ! is_numeric($request->category_id)) {
            $categoryName = trim($request->category_id);
            $cat = Category::whereRaw('LOWER(category_name) = ?', [strtolower($categoryName)])->first()
                ?? Category::create(['category_name' => $categoryName]);
            $request->merge(['category_id' => $cat->id]);
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'category_name' => 'nullable|string|max:100',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'campaign_mode' => 'sometimes|in:fund_only,volunteer_only,both',
            'location' => 'sometimes|string|max:255',
            'activity_date' => 'nullable|date',
            'target_amount' => 'sometimes|numeric|min:0',
            'target_volunteers' => 'sometimes|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'image_url' => 'nullable|string|max:500',
            'remove_image' => 'nullable|boolean',
        ], [
            'category_id.exists' => 'Kategori yang dipilih tidak valid atau belum terdaftar di database.',
            'campaign_mode.in' => 'Mode kampanye harus salah satu dari: fund_only, volunteer_only, both.',
            'activity_date.date' => 'Format tanggal kegiatan tidak valid.',
            'image.image' => 'Berkas banner harus berupa gambar.',
            'image.mimes' => 'Format gambar harus JPG, JPEG, PNG, atau WebP.',
            'image.max' => 'Ukuran gambar maksimal 5 MB.',
        ]);

        if ($request->hasFile('image')) {
            $uploader = app(\App\Services\FileUploadService::class);
            if ($campaign->image_url) {
                $uploader->delete($campaign->image_url);
            }
            $uploadResult = $uploader->upload($request->file('image'), 'campaigns');
            $validated['image_url'] = $uploadResult['url'];
        } elseif ($request->boolean('remove_image')) {
            if ($campaign->image_url) {
                app(\App\Services\FileUploadService::class)->delete($campaign->image_url);
            }
            $validated['image_url'] = null;
        } elseif ($request->filled('image_url')) {
            $candidateUrl = trim((string) $request->image_url);
            $validated['image_url'] = \App\Services\FileUploadService::isDummyImageUrl($candidateUrl) ? null : $candidateUrl;
        } elseif ($request->has('image_url')) {
            $validated['image_url'] = null;
        }

        $campaign->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data kampanye berhasil diperbarui',
            'data' => $campaign->load('category'),
        ]);
    }

    /**
     * Hapus Kampanye (Inisiator)
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $campaign = Campaign::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($campaign->image_url) {
            app(\App\Services\FileUploadService::class)->delete($campaign->image_url);
        }

        $campaign->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kampanye berhasil dihapus.',
        ]);
    }

    /**
     * Inisiator: Mengunggah Laporan Pertanggungjawaban (LPJ).
     */
    public function storeLpj(Request $request, $id): JsonResponse
    {
        $campaign = Campaign::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'description' => 'required|string',
            'proof_image_url' => 'required|string|url',
        ]);

        $lpj = LpjReport::create([
            'campaign_id' => $campaign->id,
            'description' => $validated['description'],
            'proof_image_url' => $validated['proof_image_url'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Laporan Pertanggungjawaban (LPJ) berhasil disimpan.',
            'data' => $lpj,
        ], 201);
    }
}
