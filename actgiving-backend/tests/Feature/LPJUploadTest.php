<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LPJUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_initiator_can_upload_lpj_with_proof_image(): void
    {
        Storage::fake('public');

        $user = User::create([
            'name' => 'Inisiator LPJ',
            'email' => 'lpj_initiator@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
            'is_verified' => true,
        ]);

        $category = Category::create(['category_name' => 'Kemanusiaan']);

        $campaign = Campaign::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Kampanye Uji LPJ',
            'description' => 'Uji upload LPJ',
            'target_amount' => 1000000,
            'current_amount' => 1000000,
            'location' => 'Jakarta',
            'status' => 'active',
            'campaign_mode' => 'fund_only',
        ]);

        // Buat fake image file
        $file = UploadedFile::fake()->image('bukti_kuitansi.jpg', 600, 600)->size(500);

        $response = $this->actingAs($user, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/lpj", [
            'description' => 'Laporan penyaluran sembako tahap 1 kepada 50 penerima manfaat.',
            'proof_image' => $file,
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'lpj_report' => [
                    'id',
                    'campaign_id',
                    'description',
                    'proof_image_url',
                ],
                'file_stored_path',
                'public_url',
            ],
        ]);

        $storedPath = $response->json('data.file_stored_path');
        Storage::disk('public')->assertExists($storedPath);
    }
}
