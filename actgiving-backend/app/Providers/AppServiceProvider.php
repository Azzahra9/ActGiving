<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 1. Rate Limiter khusus untuk Guest Checkout (Anti-Spam Donasi Fiktif: Maks 10 request/menit/IP)
        RateLimiter::for('guest-checkout-limit', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip())->response(function () {
                return response()->json([
                    'success' => false,
                    'message' => 'Terlalu banyak permintaan donasi tamu dari IP Anda. Silakan coba lagi dalam 1 menit.',
                ], 429);
            });
        });

        // 2. Rate Limiter khusus untuk Autentikasi (Register / Login / Forgot Password: Maks 10 request/menit/IP)
        RateLimiter::for('auth-limit', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip())->response(function () {
                return response()->json([
                    'success' => false,
                    'message' => 'Terlalu banyak percobaan autentikasi dari IP Anda. Silakan tunggu 1 menit.',
                ], 429);
            });
        });
    }
}
