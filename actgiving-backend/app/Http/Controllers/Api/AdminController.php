<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
}
