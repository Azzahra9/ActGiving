<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCampaignSuspendTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_suspend_campaign_via_suspend_endpoint(): void
    {
        $user = User::factory()->create();
        $cat = Category::firstOrCreate(['category_name' => 'Kemanusiaan']);
        $camp = Campaign::create([
            'user_id' => $user->id,
            'category_id' => $cat->id,
            'title' => 'Kampanye Pelanggaran Indikasi Fiktif',
            'description' => 'Deskripsi kampanye',
            'location' => 'Jakarta',
            'status' => 'active',
            'campaign_mode' => 'both',
        ]);

        $response = $this->patchJson("/api/admin/campaigns/{$camp->id}/suspend", [
            'reason' => 'Ditemukan indikasi penipuan dan data fiktif',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertEquals('suspended', $camp->fresh()->status);
    }

    public function test_admin_can_set_status_to_suspended_via_status_endpoint(): void
    {
        $user = User::factory()->create();
        $cat = Category::firstOrCreate(['category_name' => 'Kemanusiaan']);
        $camp = Campaign::create([
            'user_id' => $user->id,
            'category_id' => $cat->id,
            'title' => 'Kampanye Melanggar',
            'description' => 'Deskripsi kampanye',
            'location' => 'Jakarta',
            'status' => 'active',
            'campaign_mode' => 'both',
        ]);

        $response = $this->patchJson("/api/admin/campaigns/{$camp->id}/status", [
            'status' => 'suspended',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertEquals('suspended', $camp->fresh()->status);
    }

    public function test_suspended_campaign_does_not_appear_on_public_campaigns(): void
    {
        $user = User::factory()->create();
        $cat = Category::firstOrCreate(['category_name' => 'Kemanusiaan']);
        $activeCamp = Campaign::create([
            'user_id' => $user->id,
            'category_id' => $cat->id,
            'title' => 'Kampanye Sah Aktif',
            'description' => 'Deskripsi kampanye',
            'location' => 'Jakarta',
            'status' => 'active',
            'campaign_mode' => 'both',
        ]);
        $suspendedCamp = Campaign::create([
            'user_id' => $user->id,
            'category_id' => $cat->id,
            'title' => 'Kampanye Yang Disuspend',
            'description' => 'Deskripsi kampanye',
            'location' => 'Jakarta',
            'status' => 'suspended',
            'campaign_mode' => 'both',
        ]);

        $response = $this->getJson('/api/campaigns');
        $response->assertStatus(200);

        $titles = collect($response->json('data.data') ?? $response->json('data'))->pluck('title')->toArray();
        $this->assertContains('Kampanye Sah Aktif', $titles);
        $this->assertNotContains('Kampanye Yang Disuspend', $titles);
    }
}
