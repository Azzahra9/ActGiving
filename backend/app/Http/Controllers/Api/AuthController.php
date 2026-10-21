<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * @group Authentication
 *
 * Endpoint untuk registrasi, login, logout, dan reset kata sandi.
 */
class AuthController extends Controller
{
    /**
     * Register User Baru
     *
     * Membuat akun baru. Akun dapat berfungsi sebagai Inisiator kampanye maupun Relawan.
     *
     * @unauthenticated
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone_whatsapp' => 'nullable|string|max:20',
            'city_domicile' => 'nullable|string|max:100',
            'identity_doc_url' => 'nullable|string|url',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone_whatsapp' => $validated['phone_whatsapp'] ?? null,
            'city_domicile' => $validated['city_domicile'] ?? null,
            'identity_doc_url' => $validated['identity_doc_url'] ?? null,
            'is_verified' => false,
            'role' => 'user',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ],
        ], 201);
    }

    /**
     * Login Pengguna & Penerbitan Token Sanctum.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial yang diberikan tidak cocok dengan data kami.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ],
        ]);
    }

    /**
     * Dapatkan Profil User yang Sedang Login.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ]);
    }

    /**
     * Logout & Revoke Token Sanctum.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil. Token telah dicabut.',
        ]);
    }

    /**
     * FR-05: Lupa Kata Sandi (Generate Token Reset Password - Kadaluwarsa 60 Menit).
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $token = Str::random(64);

        // Simpan / replace token pada tabel password_reset_tokens
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => Carbon::now(),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Token reset kata sandi berhasil dibuat (berlaku 60 menit).',
            'data' => [
                'email' => $request->email,
                'reset_token' => $token, // Disajikan untuk simulasi pengiriman email
                'expires_in_minutes' => 60,
            ],
        ]);
    }

    /**
     * FR-05: Reset Kata Sandi Menggunakan Token.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (! $record) {
            return response()->json([
                'success' => false,
                'message' => 'Permintaan reset kata sandi tidak ditemukan.',
            ], 404);
        }

        // Cek masa kadaluwarsa (60 menit)
        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            return response()->json([
                'success' => false,
                'message' => 'Token reset kata sandi telah kadaluwarsa. Silakan ajukan ulang.',
            ], 400);
        }

        // Verifikasi token
        if (! Hash::check($request->token, $record->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Token reset kata sandi tidak valid.',
            ], 400);
        }

        // Update password user dengan bcrypt (Hash::make)
        User::where('email', $request->email)->update([
            'password' => Hash::make($request->password),
        ]);

        // Hapus token yang telah digunakan
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kata sandi berhasil diperbarui. Silakan login kembali.',
        ]);
    }
}
