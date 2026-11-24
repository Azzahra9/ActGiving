<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\User;
use App\Models\VolunteerRegistration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

/**
 * Pengujian hak akses: memastikan endpoint admin & seleksi relawan tidak bisa
 * diakses sembarang orang. Cocok dijalankan sebagai skrip demo:
 *   php artisan test --filter=AccessControlTest
 */
class AccessControlTest extends TestCase
{
    use RefreshDatabase;

    private function makeCampaign(User $owner, string $title = 'Kampanye Uji'): Campaign
    {
        $cat = Category::firstOrCreate(['category_name' => 'Kemanusiaan']);

        return Campaign::create([
            'user_id' => $owner->id,
            'category_id' => $cat->id,
            'title' => $title,
            'description' => 'Deskripsi',
            'location' => 'Makassar',
            'status' => 'active',
            'campaign_mode' => 'both',
            'target_volunteers' => 10,
            'current_volunteers' => 0,
        ]);
    }

    private function makeRegistration(Campaign $campaign, User $volunteer): VolunteerRegistration
    {
        return VolunteerRegistration::create([
            'campaign_id' => $campaign->id,
            'user_id' => $volunteer->id,
            'skills' => 'Logistik',
            'status' => 'pending',
        ]);
    }

    // ---------- Endpoint admin ----------

    public function test_admin_endpoints_reject_guests(): void
    {
        $this->getJson('/api/admin/campaigns')->assertStatus(401);
        $this->getJson('/api/admin/donations')->assertStatus(401);
        $this->getJson('/api/admin/lpj')->assertStatus(401);
        $this->patchJson('/api/admin/campaigns/1/status', ['status' => 'active'])->assertStatus(401);
        $this->patchJson('/api/admin/campaigns/1/suspend', ['reason' => 'x'])->assertStatus(401);
        $this->patchJson('/api/admin/lpj/1/verify')->assertStatus(401);
    }

    public function test_admin_endpoints_reject_regular_users(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $camp = $this->makeCampaign($user);

        $this->actingAs($user, 'sanctum')->getJson('/api/admin/campaigns')->assertStatus(403);
        $this->actingAs($user, 'sanctum')
            ->patchJson("/api/admin/campaigns/{$camp->id}/suspend", ['reason' => 'iseng'])
            ->assertStatus(403);

        $this->assertEquals('active', $camp->fresh()->status);
    }

    public function test_admin_can_open_moderation_queue(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin, 'sanctum')->getJson('/api/admin/campaigns')->assertStatus(200);
    }

    // ---------- Seleksi relawan ----------

    public function test_initiator_cannot_approve_volunteer_of_another_initiators_campaign(): void
    {
        $initiatorA = User::factory()->create();
        $initiatorB = User::factory()->create();
        $volunteer = User::factory()->create();

        $campaignOfB = $this->makeCampaign($initiatorB, 'Kampanye Milik B');
        $registration = $this->makeRegistration($campaignOfB, $volunteer);

        $this->actingAs($initiatorA, 'sanctum')
            ->patchJson("/api/volunteer-registrations/{$registration->id}/status", ['status' => 'accepted'])
            ->assertStatus(403);

        $this->assertEquals('pending', $registration->fresh()->status);
    }

    public function test_demo_name_does_not_grant_access_to_other_campaigns(): void
    {
        // Nama akun mengandung "Yayasan"/"Inisiator" tidak boleh jadi tiket masuk.
        $impostor = User::factory()->create(['name' => 'Yayasan Inisiator Palsu']);
        $owner = User::factory()->create();
        $volunteer = User::factory()->create();

        $camp = $this->makeCampaign($owner);
        $registration = $this->makeRegistration($camp, $volunteer);

        $this->actingAs($impostor, 'sanctum')
            ->patchJson("/api/volunteer-registrations/{$registration->id}/status", ['status' => 'accepted'])
            ->assertStatus(403);

        $this->actingAs($impostor, 'sanctum')
            ->postJson("/api/campaigns/{$camp->id}/schedules", ['event_date' => '2026-12-01', 'title' => 'Misi Ilegal'])
            ->assertStatus(403);
    }

    public function test_owner_can_approve_own_volunteer(): void
    {
        Mail::fake();

        $owner = User::factory()->create();
        $volunteer = User::factory()->create();
        $camp = $this->makeCampaign($owner);
        $registration = $this->makeRegistration($camp, $volunteer);

        $this->actingAs($owner, 'sanctum')
            ->patchJson("/api/volunteer-registrations/{$registration->id}/status", ['status' => 'accepted'])
            ->assertStatus(200);

        $this->assertEquals('accepted', $registration->fresh()->status);
        $this->assertEquals(1, $camp->fresh()->current_volunteers);
    }

    public function test_guest_cannot_update_volunteer_status(): void
    {
        $owner = User::factory()->create();
        $volunteer = User::factory()->create();
        $registration = $this->makeRegistration($this->makeCampaign($owner), $volunteer);

        $this->patchJson("/api/volunteer-registrations/{$registration->id}/status", ['status' => 'accepted'])
            ->assertStatus(401);
    }

    public function test_initiator_volunteer_list_only_shows_own_campaigns(): void
    {
        $initiatorA = User::factory()->create();
        $initiatorB = User::factory()->create();
        $volunteerA = User::factory()->create();
        $volunteerB = User::factory()->create();

        $regA = $this->makeRegistration($this->makeCampaign($initiatorA, 'Kampanye A'), $volunteerA);
        $this->makeRegistration($this->makeCampaign($initiatorB, 'Kampanye B'), $volunteerB);

        $response = $this->actingAs($initiatorA, 'sanctum')->getJson('/api/initiator/volunteers');
        $response->assertStatus(200);

        $ids = collect($response->json('data'))->pluck('id')->all();
        $this->assertEquals([$regA->id], $ids);
    }

    public function test_user_without_campaigns_gets_empty_volunteer_list(): void
    {
        $initiator = User::factory()->create();
        $other = User::factory()->create();
        $this->makeRegistration($this->makeCampaign($other), User::factory()->create());

        $response = $this->actingAs($initiator, 'sanctum')->getJson('/api/initiator/volunteers');

        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data'));
    }

    public function test_campaign_registrations_are_hidden_from_non_owner(): void
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $camp = $this->makeCampaign($owner);

        $this->getJson("/api/campaigns/{$camp->id}/registrations")->assertStatus(401);
        $this->actingAs($stranger, 'sanctum')->getJson("/api/campaigns/{$camp->id}/registrations")->assertStatus(403);
        $this->actingAs($owner, 'sanctum')->getJson("/api/campaigns/{$camp->id}/registrations")->assertStatus(200);
    }

    // ---------- Reset password ----------

    public function test_reset_token_is_not_exposed_in_production(): void
    {
        Mail::fake();
        User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@actgiving.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
        ]);

        $this->app['env'] = 'production';

        $response = $this->postJson('/api/auth/forgot-password', ['email' => 'budi@actgiving.com']);

        $response->assertStatus(200);
        $this->assertNull($response->json('data.reset_token'));
        $this->assertNull($response->json('data.reset_url'));
    }
}
