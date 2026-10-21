<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\VolunteerStatusMail;
use App\Models\Campaign;
use App\Models\VolunteerRegistration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

/**
 * @group Pendaftaran Relawan
 *
 * Pendaftaran dan seleksi relawan kegiatan kampanye.
 */
class VolunteerRegistrationController extends Controller
{
    /**
     * Daftar sebagai Relawan
     *
     * Relawan: Mendaftar ke suatu kampanye.
     */
    public function register(Request $request, $campaign_id): JsonResponse
    {
        $validated = $request->validate([
            'skills' => 'required|string|max:1000',
        ]);

        $user = $request->user();
        $campaign = Campaign::findOrFail($campaign_id);

        if ($campaign->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Kampanye belum aktif atau telah ditutup.',
            ], 422);
        }

        if ($campaign->campaign_mode === 'fund_only') {
            return response()->json([
                'success' => false,
                'message' => 'Kampanye ini hanya penggalangan dana, tidak membuka relawan.',
            ], 422);
        }

        if ($campaign->user_id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Inisiator tidak dapat mendaftar sebagai relawan pada kampanye sendiri.',
            ], 422);
        }

        // Cek apakah sudah pernah mendaftar
        $exists = VolunteerRegistration::where('campaign_id', $campaign->id)
            ->where('user_id', $user->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah terdaftar pada kegiatan kerelawanan ini.',
            ], 409);
        }

        $registration = VolunteerRegistration::create([
            'campaign_id' => $campaign->id,
            'user_id' => $user->id,
            'skills' => $validated['skills'],
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran relawan berhasil dikirim. Menunggu seleksi Inisiator.',
            'data' => $registration,
        ], 201);
    }

    /**
     * Riwayat Pendaftaran Relawan Saya
     *
     * Relawan: Melihat daftar kegiatan kerelawanan yang pernah didaftar.
     */
    public function myRegistrations(Request $request): JsonResponse
    {
        $registrations = VolunteerRegistration::with('campaign:id,title,location,activity_date,status')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $registrations,
        ]);
    }

    /**
     * Daftar Pelamar Relawan (Inisiator)
     *
     * Inisiator: Melihat daftar pelamar relawan pada kampanyenya.
     */
    public function getCampaignRegistrations(Request $request, $campaign_id): JsonResponse
    {
        $campaign = Campaign::where('id', $campaign_id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $registrations = VolunteerRegistration::with('user:id,name,email,phone_whatsapp,city_domicile')
            ->where('campaign_id', $campaign->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'campaign' => [
                    'id' => $campaign->id,
                    'title' => $campaign->title,
                    'current_volunteers' => $campaign->current_volunteers,
                    'target_volunteers' => $campaign->target_volunteers,
                ],
                'registrations' => $registrations,
            ],
        ]);
    }

    /**
     * Seleksi Relawan - Accept/Reject (Inisiator, ACID)
     *
     * Inisiator: Seleksi Status Relawan (accepted / rejected).
     * WAJIB ACID Transaction & lockForUpdate() untuk mencegah over-capacity.
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);

        return DB::transaction(function () use ($request, $id) {
            // Lock baris pendaftaran relawan
            $registration = VolunteerRegistration::where('id', $id)
                ->lockForUpdate()
                ->first();

            if (! $registration) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data pendaftaran relawan tidak ditemukan.',
                ], 404);
            }

            // Lock baris kampanye agar perhitungan current_volunteers terisolasi (ACID)
            $campaign = Campaign::where('id', $registration->campaign_id)
                ->lockForUpdate()
                ->first();

            // Verifikasi otorisasi inisiator
            if ($campaign->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak. Anda bukan inisiator kampanye ini.',
                ], 403);
            }

            $newStatus = $request->status;

            if ($newStatus === 'accepted') {
                // Jika status sebelumnya bukan accepted, periksa ketersediaan kuota
                if ($registration->status !== 'accepted') {
                    if ($campaign->current_volunteers >= $campaign->target_volunteers) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Kuota relawan untuk kampanye ini sudah penuh.',
                        ], 400);
                    }

                    $campaign->current_volunteers += 1;
                    $campaign->save();
                }
            } elseif ($newStatus === 'rejected') {
                // Jika sebelumnya pernah di-approve lalu diganti ke reject, pulihkan kuota
                if ($registration->status === 'accepted') {
                    $campaign->current_volunteers = max(0, $campaign->current_volunteers - 1);
                    $campaign->save();
                }
            }

            $registration->status = $newStatus;
            $registration->save();

            // FR-14: Kirim email notifikasi status relawan via Queue (Async) agar response < 2 detik (NFR-01)
            if ($registration->user && $registration->user->email) {
                Mail::to($registration->user->email)->queue(
                    (new VolunteerStatusMail($registration))->afterCommit()
                );
            }

            return response()->json([
                'success' => true,
                'message' => "Pendaftaran relawan berhasil diubah menjadi {$newStatus}.",
                'data' => [
                    'registration' => $registration,
                    'current_volunteers' => $campaign->current_volunteers,
                    'target_volunteers' => $campaign->target_volunteers,
                ],
            ]);
        });
    }
}
