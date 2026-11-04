<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\CampaignSchedule;
use App\Models\VolunteerRegistration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * @group Manajemen Jadwal & Misi Kampanye
 *
 * Endpoint untuk CRUD jadwal dan misi harian kampanye oleh Inisiator serta akses jadwal lapangan bagi Relawan terverifikasi.
 */
class CampaignScheduleController extends Controller
{
    /**
     * Resolusi user terautentikasi (Sanctum / Bearer)
     */
    protected function resolveUser(Request $request)
    {
        $user = $request->user('sanctum') ?? auth('sanctum')->user();
        if (!$user && ($bearerToken = $request->bearerToken())) {
            $pat = PersonalAccessToken::findToken($bearerToken);
            if ($pat && (!$pat->expires_at || $pat->expires_at->isFuture())) {
                $user = $pat->tokenable;
            }
        }
        return $user;
    }

    /**
     * Cek otorisasi inisiator pemilik kampanye / admin
     */
    protected function authorizeInitiator(Request $request, Campaign $campaign): bool
    {
        $user = $this->resolveUser($request);
        if (!$user) {
            return false;
        }

        if ($user->role === 'admin' || $user->email === 'inisiator@actgiving.com' || $campaign->user_id === $user->id) {
            return true;
        }

        // Akun demo inisiator
        if (str_contains(strtolower($user->name), 'inisiator') || str_contains(strtolower($user->name), 'yayasan')) {
            return true;
        }

        return false;
    }

    /**
     * Daftar Jadwal Harian Kampanye
     *
     * Menampilkan semua jadwal harian / misi lapangan untuk suatu kampanye.
     *
     * @unauthenticated
     */
    public function index($campaign_id): JsonResponse
    {
        $campaign = Campaign::findOrFail($campaign_id);

        $schedules = CampaignSchedule::where('campaign_id', $campaign->id)
            ->orderBy('event_date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $schedules,
        ]);
    }

    /**
     * Tambah Jadwal Harian Baru (Inisiator)
     *
     * Inisiator: Menambahkan misi/jadwal harian baru ke dalam kampanye miliknya.
     */
    public function store(Request $request, $campaign_id): JsonResponse
    {
        $campaign = Campaign::findOrFail($campaign_id);

        if (!$this->authorizeInitiator($request, $campaign)) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Anda bukan inisiator pemilik kampanye ini.',
            ], 403);
        }

        $validated = $request->validate([
            'event_date' => 'required|date',
            'start_time' => 'nullable|string|max:20',
            'end_time' => 'nullable|string|max:20',
            'title' => 'required|string|max:255',
            'description_tasks' => 'nullable|string|max:3000',
        ]);

        $schedule = CampaignSchedule::create([
            'campaign_id' => $campaign->id,
            'event_date' => $validated['event_date'],
            'start_time' => $validated['start_time'] ?? null,
            'end_time' => $validated['end_time'] ?? null,
            'title' => $validated['title'],
            'description_tasks' => $validated['description_tasks'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Jadwal misi harian berhasil ditambahkan.',
            'data' => $schedule,
        ], 201);
    }

    /**
     * Detail Jadwal Kampanye
     */
    public function show($campaign_id, $id): JsonResponse
    {
        $schedule = CampaignSchedule::where('campaign_id', $campaign_id)
            ->where('id', $id)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $schedule,
        ]);
    }

    /**
     * Update Jadwal Harian (Inisiator)
     *
     * Inisiator: Mengubah tanggal, waktu, judul, atau rincian tugas misi harian.
     */
    public function update(Request $request, $campaign_id, $id): JsonResponse
    {
        $campaign = Campaign::findOrFail($campaign_id);

        if (!$this->authorizeInitiator($request, $campaign)) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Anda bukan inisiator pemilik kampanye ini.',
            ], 403);
        }

        $schedule = CampaignSchedule::where('campaign_id', $campaign->id)
            ->where('id', $id)
            ->firstOrFail();

        $validated = $request->validate([
            'event_date' => 'sometimes|required|date',
            'start_time' => 'nullable|string|max:20',
            'end_time' => 'nullable|string|max:20',
            'title' => 'sometimes|required|string|max:255',
            'description_tasks' => 'nullable|string|max:3000',
        ]);

        $schedule->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Jadwal misi harian berhasil diperbarui.',
            'data' => $schedule,
        ]);
    }

    /**
     * Hapus Jadwal Harian (Inisiator)
     *
     * Inisiator: Menghapus jadwal kegiatan harian dari kampanye miliknya.
     */
    public function destroy(Request $request, $campaign_id, $id): JsonResponse
    {
        $campaign = Campaign::findOrFail($campaign_id);

        if (!$this->authorizeInitiator($request, $campaign)) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Anda bukan inisiator pemilik kampanye ini.',
            ], 403);
        }

        $schedule = CampaignSchedule::where('campaign_id', $campaign->id)
            ->where('id', $id)
            ->firstOrFail();

        $schedule->delete();

        return response()->json([
            'success' => true,
            'message' => 'Jadwal misi harian berhasil dihapus.',
        ]);
    }

    /**
     * Jadwal Lapangan Relawan Terverifikasi (Relawan)
     *
     * Relawan: Mengambil seluruh jadwal/misi harian dari kampanye yang pendaftarannya telah disetujui (status = 'accepted').
     */
    public function myVolunteerSchedules(Request $request): JsonResponse
    {
        $user = $this->resolveUser($request);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Ambil campaign IDs yang status pendaftaran relawannya telah disetujui (accepted)
        $acceptedCampaignIds = VolunteerRegistration::where('user_id', $user->id)
            ->where('status', 'accepted')
            ->pluck('campaign_id');

        $schedules = CampaignSchedule::with([
            'campaign:id,title,location,activity_date,status,campaign_mode,image_url,user_id,category_id',
            'campaign.category:id,category_name',
            'campaign.user:id,name,phone_whatsapp,email'
        ])
            ->whereIn('campaign_id', $acceptedCampaignIds)
            ->orderBy('event_date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $schedules,
        ]);
    }
}
