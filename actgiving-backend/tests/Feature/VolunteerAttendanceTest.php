<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\User;
use App\Models\VolunteerAttendance;
use App\Models\VolunteerRegistration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Presensi kehadiran relawan.
 *   php artisan test --filter=VolunteerAttendanceTest
 */
class VolunteerAttendanceTest extends TestCase
{
    use RefreshDatabase;

    private function campaign(User $owner, string $status = 'active'): Campaign
    {
        $cat = Category::firstOrCreate(['category_name' => 'Kemanusiaan']);

        return Campaign::create([
            'user_id' => $owner->id,
            'category_id' => $cat->id,
            'title' => 'Aksi Bersih Pantai',
            'description' => 'Deskripsi',
            'location' => 'Makassar',
            'status' => $status,
            'campaign_mode' => 'both',
            'target_volunteers' => 10,
            'current_volunteers' => 0,
        ]);
    }

    private function register(Campaign $campaign, User $volunteer, string $status): void
    {
        VolunteerRegistration::create([
            'campaign_id' => $campaign->id,
            'user_id' => $volunteer->id,
            'skills' => 'Logistik',
            'status' => $status,
        ]);
    }

    public function test_guest_cannot_check_in(): void
    {
        $campaign = $this->campaign(User::factory()->create());

        $this->postJson("/api/campaigns/{$campaign->id}/attendance")->assertStatus(401);
    }

    public function test_accepted_volunteer_can_check_in_once(): void
    {
        $owner = User::factory()->create();
        $volunteer = User::factory()->create();
        $campaign = $this->campaign($owner);
        $this->register($campaign, $volunteer, 'accepted');

        $this->actingAs($volunteer, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/attendance")
            ->assertStatus(201);

        // Kirim ulang tidak membuat catatan ganda
        $this->actingAs($volunteer, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/attendance")
            ->assertStatus(200);

        $this->assertEquals(1, VolunteerAttendance::count());
    }

    public function test_pending_or_unregistered_user_cannot_check_in(): void
    {
        $owner = User::factory()->create();
        $pending = User::factory()->create();
        $stranger = User::factory()->create();
        $campaign = $this->campaign($owner);
        $this->register($campaign, $pending, 'pending');

        $this->actingAs($pending, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/attendance")
            ->assertStatus(403);
        $this->actingAs($stranger, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/attendance")
            ->assertStatus(403);

        $this->assertEquals(0, VolunteerAttendance::count());
    }

    public function test_cannot_check_in_on_suspended_campaign(): void
    {
        $owner = User::factory()->create();
        $volunteer = User::factory()->create();
        $campaign = $this->campaign($owner, 'suspended');
        $this->register($campaign, $volunteer, 'accepted');

        $this->actingAs($volunteer, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/attendance")
            ->assertStatus(422);
    }

    public function test_volunteer_can_list_own_attendances(): void
    {
        $owner = User::factory()->create();
        $volunteer = User::factory()->create();
        $campaign = $this->campaign($owner);
        $this->register($campaign, $volunteer, 'accepted');

        $this->actingAs($volunteer, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/attendance");

        $res = $this->actingAs($volunteer, 'sanctum')->getJson('/api/my-attendances')->assertOk();
        $this->assertEquals($campaign->id, $res->json('data.0.campaign_id'));
    }

    public function test_initiator_sees_attendance_flag_only_for_checked_in_volunteers(): void
    {
        $owner = User::factory()->create();
        $hadir = User::factory()->create();
        $absen = User::factory()->create();
        $campaign = $this->campaign($owner);
        $this->register($campaign, $hadir, 'accepted');
        $this->register($campaign, $absen, 'accepted');

        $this->actingAs($hadir, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/attendance")->assertStatus(201);

        $rows = collect(
            $this->actingAs($owner, 'sanctum')->getJson('/api/initiator/volunteers')->assertOk()->json('data')
        )->keyBy('user_id');

        $this->assertTrue($rows[$hadir->id]['attended']);
        $this->assertFalse($rows[$absen->id]['attended']);
    }

    public function test_other_initiator_cannot_see_attendance_of_foreign_campaign(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $volunteer = User::factory()->create();
        $campaign = $this->campaign($owner);
        $this->register($campaign, $volunteer, 'accepted');
        $this->actingAs($volunteer, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/attendance");

        $this->actingAs($other, 'sanctum')->getJson('/api/initiator/volunteers')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }
}
