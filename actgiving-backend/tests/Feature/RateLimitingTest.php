<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RateLimitingTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_checkout_rate_limiter_blocks_excessive_requests(): void
    {
        $user = User::create([
            'name' => 'Owner Campaign',
            'email' => 'owner@example.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
        ]);

        $category = Category::create(['category_name' => 'Kesehatan']);

        $campaign = Campaign::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Bantuan Operasi Jantung',
            'description' => 'Membantu pengobatan pasien',
            'target_amount' => 10000000,
            'current_amount' => 0,
            'location' => 'Surabaya',
            'status' => 'active',
            'campaign_mode' => 'fund_only',
        ]);

        $payload = [
            'campaign_id' => $campaign->id,
            'amount' => 50000,
            'donor_name' => 'Spammer Test',
            'donor_email' => 'spammer@example.com',
            'payment_channel' => 'qris',
        ];

        // 10 request pertama diizinkan
        for ($i = 0; $i < 10; $i++) {
            $response = $this->postJson('/api/donations/guest-checkout', $payload);
            $response->assertStatus(201);
        }

        // Request ke-11 harus diblokir oleh Rate Limiter (HTTP 429 Too Many Requests)
        $blockedResponse = $this->postJson('/api/donations/guest-checkout', $payload);
        $blockedResponse->assertStatus(429);
        $blockedResponse->assertJson([
            'success' => false,
            'message' => 'Terlalu banyak permintaan donasi tamu dari IP Anda. Silakan coba lagi dalam 1 menit.',
        ]);
    }
}
