<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\CampaignSchedule;
use App\Models\Category;
use App\Models\User;
use App\Models\VolunteerRegistration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CampaignScheduleTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_fetch_campaign_schedules_publicly(): void
    {
        $user = User::factory()->create();
        $cat = Category::firstOrCreate(['category_name' => 'Kemanusiaan']);
        $camp = Campaign::create([
            'user_id' => $user->id,
            'category_id' => $cat->id,
            'title' => 'Kampanye Bantuan Gempa',
            'description' => 'Bantuan korban bencana',
            'location' => 'Cianjur',
            'status' => 'active',
            'campaign_mode' => 'both',
        ]);

        CampaignSchedule::create([
            'campaign_id' => $camp->id,
            'event_date' => '2026-11-01',
            'start_time' => '08:00',
            'end_time' => '12:00',
            'title' => 'Briefing & Penyaluran Logistik Hari ke-1',
            'description_tasks' => '1. Briefing SOP di posko utama; 2. Distribusi sembako zona A.',
        ]);

        $response = $this->getJson("/api/campaigns/{$camp->id}/schedules");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonFragment([
                'title' => 'Briefing & Penyaluran Logistik Hari ke-1',
                'start_time' => '08:00',
            ]);
    }

    public function test_initiator_can_create_schedule(): void
    {
        $initiator = User::factory()->create();
        Sanctum::actingAs($initiator);

        $cat = Category::firstOrCreate(['category_name' => 'Kemanusiaan']);
        $camp = Campaign::create([
            'user_id' => $initiator->id,
            'category_id' => $cat->id,
            'title' => 'Aksi Bersih Pantai',
            'description' => 'Aksi peduli lingkungan',
            'location' => 'Bali',
            'status' => 'active',
            'campaign_mode' => 'volunteer_only',
        ]);

        $payload = [
            'event_date' => '2026-11-10',
            'start_time' => '06:30',
            'end_time' => '10:30',
            'title' => 'Pembersihan Sampah Plastik Zona Barat',
            'description_tasks' => 'Pengumpulan sampah anorganik dan pencatatan timbangan.',
        ];

        $response = $this->postJson("/api/campaigns/{$camp->id}/schedules", $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'title' => 'Pembersihan Sampah Plastik Zona Barat',
                    'event_date' => '2026-11-10',
                ],
            ]);

        $this->assertDatabaseHas('campaign_schedules', [
            'campaign_id' => $camp->id,
            'title' => 'Pembersihan Sampah Plastik Zona Barat',
        ]);
    }

    public function test_initiator_can_update_schedule(): void
    {
        $initiator = User::factory()->create();
        Sanctum::actingAs($initiator);

        $cat = Category::firstOrCreate(['category_name' => 'Kemanusiaan']);
        $camp = Campaign::create([
            'user_id' => $initiator->id,
            'category_id' => $cat->id,
            'title' => 'Kampanye Medis',
            'description' => 'Pengobatan gratis',
            'location' => 'Surabaya',
            'status' => 'active',
            'campaign_mode' => 'both',
        ]);

        $schedule = CampaignSchedule::create([
            'campaign_id' => $camp->id,
            'event_date' => '2026-11-15',
            'start_time' => '09:00',
            'end_time' => '15:00',
            'title' => 'Pemeriksaan Kesehatan Awal',
            'description_tasks' => 'Registrasi pasien dan tensi darah.',
        ]);

        $response = $this->putJson("/api/campaigns/{$camp->id}/schedules/{$schedule->id}", [
            'title' => 'Pemeriksaan Kesehatan Massal Lansia',
            'start_time' => '08:00',
            'end_time' => '14:00',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'title' => 'Pemeriksaan Kesehatan Massal Lansia',
                    'start_time' => '08:00',
                ],
            ]);

        $this->assertEquals('Pemeriksaan Kesehatan Massal Lansia', $schedule->fresh()->title);
    }

    public function test_initiator_can_delete_schedule(): void
    {
        $initiator = User::factory()->create();
        Sanctum::actingAs($initiator);

        $cat = Category::firstOrCreate(['category_name' => 'Kemanusiaan']);
        $camp = Campaign::create([
            'user_id' => $initiator->id,
            'category_id' => $cat->id,
            'title' => 'Kampanye Pendidikan',
            'description' => 'Buku anak pedalaman',
            'location' => 'Lombok',
            'status' => 'active',
            'campaign_mode' => 'both',
        ]);

        $schedule = CampaignSchedule::create([
            'campaign_id' => $camp->id,
            'event_date' => '2026-11-20',
            'start_time' => '10:00',
            'end_time' => '12:00',
            'title' => 'Distribusi Buku',
            'description_tasks' => 'Serah terima paket buku.',
        ]);

        $response = $this->deleteJson("/api/campaigns/{$camp->id}/schedules/{$schedule->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseMissing('campaign_schedules', [
            'id' => $schedule->id,
        ]);
    }

    public function test_non_owner_cannot_modify_schedule(): void
    {
        $initiator = User::factory()->create();
        $stranger = User::factory()->create();
        Sanctum::actingAs($stranger);

        $cat = Category::firstOrCreate(['category_name' => 'Kemanusiaan']);
        $camp = Campaign::create([
            'user_id' => $initiator->id,
            'category_id' => $cat->id,
            'title' => 'Kampanye Orang Lain',
            'description' => 'Deskripsi',
            'location' => 'Bandung',
            'status' => 'active',
            'campaign_mode' => 'both',
        ]);

        $response = $this->postJson("/api/campaigns/{$camp->id}/schedules", [
            'event_date' => '2026-11-25',
            'title' => 'Misi Ilegal',
        ]);

        $response->assertStatus(403);
    }

    public function test_volunteer_can_fetch_approved_campaign_schedules(): void
    {
        $initiator = User::factory()->create();
        $volunteer = User::factory()->create();

        $cat = Category::firstOrCreate(['category_name' => 'Kemanusiaan']);
        $campApproved = Campaign::create([
            'user_id' => $initiator->id,
            'category_id' => $cat->id,
            'title' => 'Kampanye Relawan Diterima',
            'description' => 'Deskripsi',
            'location' => 'Semarang',
            'status' => 'active',
            'campaign_mode' => 'both',
        ]);

        $campPending = Campaign::create([
            'user_id' => $initiator->id,
            'category_id' => $cat->id,
            'title' => 'Kampanye Relawan Masih Pending',
            'description' => 'Deskripsi',
            'location' => 'Solo',
            'status' => 'active',
            'campaign_mode' => 'both',
        ]);

        // Pendaftaran: 1 accepted, 1 pending
        VolunteerRegistration::create([
            'campaign_id' => $campApproved->id,
            'user_id' => $volunteer->id,
            'skills' => 'Tenaga lapangan',
            'status' => 'accepted',
        ]);

        VolunteerRegistration::create([
            'campaign_id' => $campPending->id,
            'user_id' => $volunteer->id,
            'skills' => 'Tenaga lapangan',
            'status' => 'pending',
        ]);

        // Schedules
        $schedule1 = CampaignSchedule::create([
            'campaign_id' => $campApproved->id,
            'event_date' => '2026-11-28',
            'start_time' => '07:00',
            'end_time' => '13:00',
            'title' => 'Hari 1: Penanaman Mangrove',
            'description_tasks' => 'Tanam 500 bibit mangrove di pesisir.',
        ]);

        $schedule2 = CampaignSchedule::create([
            'campaign_id' => $campPending->id,
            'event_date' => '2026-11-29',
            'start_time' => '08:00',
            'end_time' => '12:00',
            'title' => 'Jadwal yang Belum Boleh Muncul',
            'description_tasks' => 'Karena status relawan belum accepted.',
        ]);

        Sanctum::actingAs($volunteer);

        $response = $this->getJson('/api/my-volunteer-schedules');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonFragment([
                'title' => 'Hari 1: Penanaman Mangrove',
            ])
            ->assertJsonMissing([
                'title' => 'Jadwal yang Belum Boleh Muncul',
            ]);
    }
}
