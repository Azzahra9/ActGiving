<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\CampaignReport;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CampaignReportTest extends TestCase
{
    use RefreshDatabase;

    private User $initiator;
    private User $reporterUser;
    private User $admin;
    private Campaign $campaign;

    protected function setUp(): void
    {
        parent::setUp();

        $category = Category::create(['category_name' => 'Kemanusiaan']);

        $this->initiator = User::create([
            'name' => 'Inisiator Kampanye',
            'email' => 'initiator_rep@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
            'is_verified' => true,
        ]);

        $this->reporterUser = User::create([
            'name' => 'Donatur Terdaftar',
            'email' => 'donatur_rep@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
        ]);

        $this->admin = User::create([
            'name' => 'Admin Audit',
            'email' => 'admin_rep@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'is_verified' => true,
        ]);

        $this->campaign = Campaign::create([
            'user_id' => $this->initiator->id,
            'category_id' => $category->id,
            'title' => 'Kampanye Bantuan Sosial',
            'description' => 'Deskripsi kampanye untuk pengujian laporan aduan.',
            'target_amount' => 5000000,
            'current_amount' => 100000,
            'location' => 'Bandung',
            'status' => 'active',
            'campaign_mode' => 'fund_only',
        ]);
    }

    public function test_guest_can_submit_campaign_report_without_evidence(): void
    {
        $response = $this->postJson("/api/campaigns/{$this->campaign->id}/reports", [
            'reporter_name' => 'Budi Santoso',
            'reporter_email' => 'budi.santoso@example.com',
            'category' => 'fiktif',
            'description' => 'Alamat posko yang dicantumkan tidak ditemukan di lapangan.',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Terima kasih. Laporan aduan Anda berhasil dikirim dan akan segera diinvestigasi oleh Tim Audit ActGiving.',
                'data' => [
                    'campaign_id' => $this->campaign->id,
                    'user_id' => null,
                    'reporter_name' => 'Budi Santoso',
                    'reporter_email' => 'budi.santoso@example.com',
                    'category' => 'fiktif',
                    'evidence_path' => null,
                    'status' => 'pending',
                ],
            ]);

        $this->assertDatabaseHas('campaign_reports', [
            'campaign_id' => $this->campaign->id,
            'user_id' => null,
            'reporter_name' => 'Budi Santoso',
            'reporter_email' => 'budi.santoso@example.com',
            'category' => 'fiktif',
            'status' => 'pending',
        ]);
    }

    public function test_guest_can_submit_campaign_report_with_image_evidence(): void
    {
        Storage::fake('public');

        $evidence = UploadedFile::fake()->image('bukti_kejanggalan.png', 800, 600)->size(512);

        $response = $this->post("/api/campaigns/{$this->campaign->id}/reports", [
            'reporter_name' => 'Siti Aminah',
            'reporter_email' => 'siti@example.com',
            'category' => 'penipuan',
            'description' => 'Foto yang digunakan diambil dari berita lama tahun 2019.',
            'evidence' => $evidence,
        ], [
            'Accept' => 'application/json',
        ]);

        $response->assertStatus(201);

        $evidencePath = $response->json('data.evidence_path');
        $this->assertNotNull($evidencePath);
        $this->assertStringStartsWith('reports/', $evidencePath);
        Storage::disk('public')->assertExists($evidencePath);

        $this->assertDatabaseHas('campaign_reports', [
            'campaign_id' => $this->campaign->id,
            'reporter_name' => 'Siti Aminah',
            'category' => 'penipuan',
            'evidence_path' => $evidencePath,
            'status' => 'pending',
        ]);
    }

    public function test_guest_can_submit_campaign_report_with_pdf_evidence(): void
    {
        Storage::fake('public');

        $evidence = UploadedFile::fake()->create('kronologi_bukti.pdf', 1024, 'application/pdf');

        $response = $this->post("/api/campaigns/{$this->campaign->id}/reports", [
            'reporter_name' => 'Andi Wijaya',
            'reporter_email' => 'andi@example.com',
            'category' => 'spam',
            'description' => 'Terlampir bukti duplikasi kampanye.',
            'evidence' => $evidence,
        ], [
            'Accept' => 'application/json',
        ]);

        $response->assertStatus(201);
        $evidencePath = $response->json('data.evidence_path');
        $this->assertStringStartsWith('reports/', $evidencePath);
        Storage::disk('public')->assertExists($evidencePath);
    }

    public function test_authenticated_user_report_records_user_id(): void
    {
        $response = $this->actingAs($this->reporterUser, 'sanctum')
            ->postJson("/api/campaigns/{$this->campaign->id}/reports", [
                'reporter_name' => $this->reporterUser->name,
                'reporter_email' => $this->reporterUser->email,
                'category' => 'konten_tidak_pantas',
                'description' => 'Terdapat konten yang menyesatkan publik.',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.user_id', $this->reporterUser->id)
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('campaign_reports', [
            'campaign_id' => $this->campaign->id,
            'user_id' => $this->reporterUser->id,
            'category' => 'konten_tidak_pantas',
            'status' => 'pending',
        ]);
    }

    public function test_validation_fails_for_missing_required_fields_and_invalid_email(): void
    {
        $response = $this->postJson("/api/campaigns/{$this->campaign->id}/reports", [
            'reporter_name' => '',
            'reporter_email' => 'bukan-email-valid',
            'category' => '',
            'description' => '',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'reporter_name',
                'reporter_email',
                'category',
                'description',
            ]);
    }

    public function test_validation_fails_when_evidence_exceeds_2mb_or_invalid_type(): void
    {
        Storage::fake('public');

        $oversizedFile = UploadedFile::fake()->image('terlalu_besar.jpg')->size(2500);
        $oversizedRes = $this->post("/api/campaigns/{$this->campaign->id}/reports", [
            'reporter_name' => 'Tester',
            'reporter_email' => 'tester@example.com',
            'category' => 'fiktif',
            'description' => 'Ukuran file melebihi batas 2MB.',
            'evidence' => $oversizedFile,
        ], ['Accept' => 'application/json']);

        $oversizedRes->assertStatus(422)
            ->assertJsonValidationErrors(['evidence']);

        $invalidFile = UploadedFile::fake()->create('script.txt', 10, 'text/plain');
        $invalidRes = $this->post("/api/campaigns/{$this->campaign->id}/reports", [
            'reporter_name' => 'Tester',
            'reporter_email' => 'tester@example.com',
            'category' => 'fiktif',
            'description' => 'Format file tidak didukung.',
            'evidence' => $invalidFile,
        ], ['Accept' => 'application/json']);

        $invalidRes->assertStatus(422)
            ->assertJsonValidationErrors(['evidence']);
    }

    public function test_report_returns_404_when_campaign_does_not_exist(): void
    {
        $response = $this->postJson('/api/campaigns/999999/reports', [
            'reporter_name' => 'Tester',
            'reporter_email' => 'tester@example.com',
            'category' => 'fiktif',
            'description' => 'Kampanye tidak ada.',
        ]);

        $response->assertStatus(404);
    }

    public function test_admin_can_list_submitted_campaign_reports(): void
    {
        CampaignReport::create([
            'campaign_id' => $this->campaign->id,
            'user_id' => $this->reporterUser->id,
            'reporter_name' => $this->reporterUser->name,
            'reporter_email' => $this->reporterUser->email,
            'category' => 'penipuan',
            'description' => 'Indikasi penggalangan dana ilegal.',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/reports');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.data.0.category', 'penipuan')
            ->assertJsonPath('data.data.0.status', 'pending')
            ->assertJsonPath('data.data.0.campaign.title', 'Kampanye Bantuan Sosial')
            ->assertJsonPath('data.data.0.user.email', $this->reporterUser->email);
    }

    public function test_non_admin_and_guest_cannot_access_admin_reports_endpoints(): void
    {
        $report = CampaignReport::create([
            'campaign_id' => $this->campaign->id,
            'reporter_name' => 'Pelapor Umum',
            'reporter_email' => 'pelapor@example.com',
            'category' => 'spam',
            'description' => 'Kampanye duplikat.',
            'status' => 'pending',
        ]);

        // Guest -> 401
        $this->getJson('/api/admin/reports')->assertStatus(401);
        $this->patchJson("/api/admin/reports/{$report->id}/status", ['status' => 'investigating'])->assertStatus(401);

        // Regular user (non-admin) -> 403
        $this->actingAs($this->reporterUser, 'sanctum')->getJson('/api/admin/reports')->assertStatus(403);
        $this->actingAs($this->reporterUser, 'sanctum')
            ->patchJson("/api/admin/reports/{$report->id}/status", ['status' => 'investigating'])
            ->assertStatus(403);
    }

    public function test_admin_reports_are_ordered_with_pending_first(): void
    {
        $resolved = CampaignReport::create([
            'campaign_id' => $this->campaign->id,
            'reporter_name' => 'Pelapor Resolved',
            'reporter_email' => 'resolved@example.com',
            'category' => 'fiktif',
            'description' => 'Sudah diselesaikan.',
            'status' => 'resolved',
        ]);

        $investigating = CampaignReport::create([
            'campaign_id' => $this->campaign->id,
            'reporter_name' => 'Pelapor Investigating',
            'reporter_email' => 'inv@example.com',
            'category' => 'penipuan',
            'description' => 'Sedang diinvestigasi.',
            'status' => 'investigating',
        ]);

        $pending = CampaignReport::create([
            'campaign_id' => $this->campaign->id,
            'reporter_name' => 'Pelapor Pending',
            'reporter_email' => 'pending@example.com',
            'category' => 'spam',
            'description' => 'Baru masuk.',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/reports');
        $response->assertStatus(200);

        $ids = collect($response->json('data.data'))->pluck('id')->all();
        $this->assertEquals([$pending->id, $investigating->id, $resolved->id], $ids);
    }

    public function test_admin_can_update_report_status_to_investigating_dismissed_and_resolved(): void
    {
        $report = CampaignReport::create([
            'campaign_id' => $this->campaign->id,
            'reporter_name' => 'Pelapor UAT',
            'reporter_email' => 'uat@example.com',
            'category' => 'penipuan',
            'description' => 'Perlu pengecekan lebih lanjut.',
            'status' => 'pending',
        ]);

        // 1. investigating
        $invRes = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/admin/reports/{$report->id}/status", ['status' => 'investigating']);
        $invRes->assertStatus(200)
            ->assertJsonPath('data.status', 'investigating');
        $this->assertEquals('investigating', $report->fresh()->status);

        // 2. dismissed
        $disRes = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/admin/reports/{$report->id}/status", ['status' => 'dismissed']);
        $disRes->assertStatus(200)
            ->assertJsonPath('data.status', 'dismissed');
        $this->assertEquals('dismissed', $report->fresh()->status);

        // 3. resolved + suspend campaign hides campaign from public
        $suspendRes = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/admin/campaigns/{$this->campaign->id}/suspend", [
                'reason' => 'Terbukti fiktif berdasarkan aduan publik.',
            ]);
        $suspendRes->assertStatus(200);
        $this->assertEquals('suspended', $this->campaign->fresh()->status);

        $resolveRes = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/admin/reports/{$report->id}/status", ['status' => 'resolved']);
        $resolveRes->assertStatus(200)
            ->assertJsonPath('data.status', 'resolved');

        $publicTitles = collect($this->getJson('/api/campaigns')->json('data.data'))->pluck('title')->all();
        $this->assertNotContains($this->campaign->title, $publicTitles);
    }

    public function test_admin_update_report_status_validates_allowed_values(): void
    {
        $report = CampaignReport::create([
            'campaign_id' => $this->campaign->id,
            'reporter_name' => 'Pelapor Validasi',
            'reporter_email' => 'valid@example.com',
            'category' => 'fiktif',
            'description' => 'Uji validasi status.',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/admin/reports/{$report->id}/status", [
                'status' => 'status_tidak_sah',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }
}
