<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
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
        ])
        ->where('status', 'active');

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
            'lpjReports',
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
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'campaign_mode' => 'required|in:fund_only,volunteer_only,both',
            'target_amount' => 'required_if:campaign_mode,fund_only,both|numeric|min:0',
            'target_volunteers' => 'required_if:campaign_mode,volunteer_only,both|integer|min:0',
            'location' => 'required|string|max:255',
            'activity_date' => 'nullable|date|after_or_equal:today',
        ]);

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
        $campaigns = Campaign::with(['category'])
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

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string|max:255',
            'activity_date' => 'nullable|date',
            'target_amount' => 'sometimes|numeric|min:0',
            'target_volunteers' => 'sometimes|integer|min:0',
        ]);

        $campaign->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data kampanye berhasil diperbarui',
            'data' => $campaign,
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
