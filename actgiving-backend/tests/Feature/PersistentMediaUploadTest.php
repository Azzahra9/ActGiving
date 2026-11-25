<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\StoredFile;
use App\Models\User;
use App\Services\FileUploadService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PersistentMediaUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_uploaded_campaign_image_persists_in_database_and_serves_when_disk_file_missing(): void
    {
        Storage::fake('public');

        $user = User::create([
            'name' => 'Inisiator Media',
            'email' => 'media_initiator@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
            'is_verified' => true,
        ]);

        $category = Category::create(['category_name' => 'Pendidikan']);

        $image = UploadedFile::fake()->image('campaign_banner.jpg', 800, 600);

        $response = $this->actingAs($user, 'sanctum')->post('/api/campaigns', [
            'category_id' => $category->id,
            'title' => 'Kampanye Gambar Persisten',
            'description' => 'Menguji persistensi gambar kampanye di database.',
            'campaign_mode' => 'both',
            'target_amount' => 10000000,
            'target_volunteers' => 5,
            'location' => 'Bandung',
            'image' => $image,
        ], [
            'Accept' => 'application/json',
        ]);

        $response->assertStatus(201);
        $imageUrl = $response->json('data.image_url');

        $this->assertNotNull($imageUrl);
        $this->assertStringContainsString('/api/media/campaigns/', $imageUrl);

        $storedFile = StoredFile::first();
        $this->assertNotNull($storedFile);
        $this->assertStringStartsWith('campaigns/', $storedFile->path);

        // Simulasikan container redeploy: hapus file fisik dari disk 'public'
        Storage::disk('public')->delete($storedFile->path);
        Storage::disk('public')->assertMissing($storedFile->path);

        // File masih harus dapat diakses melalui endpoint /api/media/{path}
        $mediaRes = $this->get('/api/media/'.$storedFile->path);
        $mediaRes->assertStatus(200);
        $this->assertStringStartsWith('image/', (string) $mediaRes->headers->get('Content-Type'));
    }

    public function test_dummy_image_url_is_rejected_and_stored_as_null(): void
    {
        $user = User::create([
            'name' => 'Inisiator Anti Dummy',
            'email' => 'antidummy@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
        ]);

        $category = Category::create(['category_name' => 'Kesehatan']);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/campaigns', [
            'category_id' => $category->id,
            'title' => 'Kampanye Tanpa Dummy',
            'description' => 'Tidak boleh menyimpan gambar dummy.',
            'campaign_mode' => 'fund_only',
            'target_amount' => 5000000,
            'location' => 'Jakarta',
            'image_url' => 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
        ]);

        $response->assertStatus(201);
        $this->assertNull($response->json('data.image_url'));
        $this->assertDatabaseHas('campaigns', [
            'title' => 'Kampanye Tanpa Dummy',
            'image_url' => null,
        ]);
    }

    public function test_update_campaign_can_remove_existing_image(): void
    {
        Storage::fake('public');

        $user = User::create([
            'name' => 'Inisiator Edit',
            'email' => 'edit_img@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
        ]);

        $category = Category::create(['category_name' => 'Lingkungan Hidup']);
        $image = UploadedFile::fake()->image('initial.png', 400, 400);

        $createRes = $this->actingAs($user, 'sanctum')->post('/api/campaigns', [
            'category_id' => $category->id,
            'title' => 'Kampanye Hapus Foto',
            'description' => 'Deskripsi awal',
            'campaign_mode' => 'fund_only',
            'target_amount' => 1000000,
            'location' => 'Surabaya',
            'image' => $image,
        ], ['Accept' => 'application/json']);

        $createRes->assertStatus(201);
        $campaignId = $createRes->json('data.id');
        $this->assertEquals(1, StoredFile::count());

        $updateRes = $this->actingAs($user, 'sanctum')->post("/api/campaigns/{$campaignId}", [
            '_method' => 'PUT',
            'remove_image' => '1',
        ], ['Accept' => 'application/json']);

        $updateRes->assertStatus(200);
        $this->assertNull($updateRes->json('data.image_url'));
        $this->assertEquals(0, StoredFile::count());
        $this->assertNull(Campaign::find($campaignId)->image_url);
    }

    public function test_is_dummy_image_url_helper_detects_stock_domains(): void
    {
        $this->assertTrue(FileUploadService::isDummyImageUrl('https://images.unsplash.com/photo-123?w=800'));
        $this->assertTrue(FileUploadService::isDummyImageUrl('https://picsum.photos/800/600'));
        $this->assertTrue(FileUploadService::isDummyImageUrl('https://via.placeholder.com/400'));
        $this->assertFalse(FileUploadService::isDummyImageUrl('https://actgiving-production.up.railway.app/api/media/campaigns/abc.jpg'));
        $this->assertFalse(FileUploadService::isDummyImageUrl(null));
    }
}
