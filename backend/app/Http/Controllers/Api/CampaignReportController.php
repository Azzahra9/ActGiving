<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\CampaignReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Laporan Aduan
 *
 * Pelaporan kampanye fiktif oleh publik (FR-13).
 */
class CampaignReportController extends Controller
{
    /**
     * Kirim Laporan Aduan Kampanye
     *
     * Publik / User: Mengirimkan form aduan kampanye fiktif/penipuan (FR-13).
     *
     * @unauthenticated
     */
    public function store(Request $request, $id): JsonResponse
    {
        $campaign = Campaign::findOrFail($id);

        $validated = $request->validate([
            'reporter_email' => 'required|email|max:255',
            'reason_category' => 'required|string|max:100',
            'description' => 'required|string',
        ]);

        $report = CampaignReport::create([
            'campaign_id' => $campaign->id,
            'reporter_email' => $validated['reporter_email'],
            'reason_category' => $validated['reason_category'],
            'description' => $validated['description'],
            'status' => 'open',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Laporan aduan berhasil dikirim dan akan segera ditinjau oleh Administrator.',
            'data' => $report,
        ], 201);
    }

    /**
     * Daftar Laporan Aduan (Admin)
     *
     * Admin: Melihat daftar laporan/aduan kampanye masuk (FR-13).
     */
    public function indexAdmin(Request $request): JsonResponse
    {
        $query = CampaignReport::with(['campaign:id,title,user_id,status']);

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
