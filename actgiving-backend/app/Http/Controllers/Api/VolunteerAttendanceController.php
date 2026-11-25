<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\VolunteerAttendance;
use App\Models\VolunteerRegistration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VolunteerAttendanceController extends Controller
{
    /**
     * Relawan mencatat kehadirannya pada kegiatan kampanye.
     * Syarat: pendaftarannya sudah DITERIMA inisiator dan kampanye masih aktif.
     * Idempoten: mengirim ulang tidak membuat catatan ganda.
     */
    public function store(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $campaign = Campaign::findOrFail($id);

        if ($campaign->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Kehadiran hanya dapat dicatat pada kampanye yang sedang aktif.',
            ], 422);
        }

        $accepted = VolunteerRegistration::where('campaign_id', $campaign->id)
            ->where('user_id', $user->id)
            ->where('status', 'accepted')
            ->exists();

        if (! $accepted) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum diterima sebagai relawan pada kegiatan ini.',
            ], 403);
        }

        $attendance = VolunteerAttendance::firstOrCreate(
            ['campaign_id' => $campaign->id, 'user_id' => $user->id],
            ['checked_in_at' => now()]
        );

        return response()->json([
            'success' => true,
            'message' => $attendance->wasRecentlyCreated
                ? 'Kehadiran Anda berhasil dicatat.'
                : 'Kehadiran Anda sudah tercatat sebelumnya.',
            'data' => $attendance,
        ], $attendance->wasRecentlyCreated ? 201 : 200);
    }

    /**
     * Daftar ID kampanye yang sudah dicatat kehadirannya oleh relawan yang login.
     */
    public function mine(Request $request): JsonResponse
    {
        $items = VolunteerAttendance::where('user_id', $request->user()->id)
            ->get(['campaign_id', 'checked_in_at']);

        return response()->json([
            'success' => true,
            'data' => $items,
        ]);
    }
}
