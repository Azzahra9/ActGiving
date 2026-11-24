<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CategoryAndCampaignInputTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_categories_is_public_and_returns_empty_when_no_seeder(): void
    {
        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [],
            ]);
    }

    public function test_post_categories_creates_category_without_seeder(): void
    {
        $response = $this->postJson('/api/categories', [
            'category_name' => 'Bencana Alam',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'category_name' => 'Bencana Alam',
                ],
            ]);

        $this->assertDatabaseHas('categories', [
            'category_name' => 'Bencana Alam',
        ]);
    }

    public function test_post_categories_is_idempotent_and_handles_case_insensitivity(): void
    {
        $cat1 = Category::create(['category_name' => 'Pendidikan']);

        $response = $this->postJson('/api/categories', [
            'category_name' => 'pendidikan',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $cat1->id,
                    'category_name' => 'Pendidikan',
                ],
            ]);

        $this->assertEquals(1, Category::whereRaw('LOWER(category_name) = ?', ['pendidikan'])->count());
    }

    public function test_create_campaign_with_category_name_auto_creates_category(): void
    {
        $user = User::create([
            'name' => 'Inisiator Test',
            'email' => 'inisiator.test@example.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
        ]);

        $payload = [
            'category_name' => 'Kesehatan Masyarakat',
            'title' => 'Pengobatan Gratis Lansia',
            'description' => 'Aksi pengobatan cuma-cuma untuk warga lansia pra-sejahtera.',
            'campaign_mode' => 'both',
            'target_amount' => 15000000,
            'target_volunteers' => 10,
            'location' => 'Bandung, Jawa Barat',
            'activity_date' => '2026-12-01',
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/campaigns', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'title' => 'Pengobatan Gratis Lansia',
                    'category' => [
                        'category_name' => 'Kesehatan Masyarakat',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('categories', [
            'category_name' => 'Kesehatan Masyarakat',
        ]);

        $this->assertDatabaseHas('campaigns', [
            'title' => 'Pengobatan Gratis Lansia',
            'status' => 'pending',
        ]);
    }

    public function test_create_campaign_with_category_id_and_image_file(): void
    {
        Storage::fake('public');

        $user = User::create([
            'name' => 'Inisiator File',
            'email' => 'inisiator.file@example.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
        ]);

        $category = Category::create(['category_name' => 'Lingkungan Hidup']);

        $image = UploadedFile::fake()->image('banner.jpg', 800, 600);

        $response = $this->actingAs($user, 'sanctum')->post('/api/campaigns', [
            'category_id' => $category->id,
            'title' => 'Tanam 1000 Pohon Mangrove',
            'description' => 'Aksi restorasi pesisir pantai.',
            'campaign_mode' => 'volunteer_only',
            'target_volunteers' => 25,
            'location' => 'Surabaya, Jawa Timur',
            'image' => $image,
        ], [
            'Accept' => 'application/json',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'title' => 'Tanam 1000 Pohon Mangrove',
                    'target_volunteers' => 25,
                ],
            ]);

        $this->assertDatabaseHas('campaigns', [
            'title' => 'Tanam 1000 Pohon Mangrove',
            'category_id' => $category->id,
        ]);
    }
}
