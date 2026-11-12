<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\Disbursement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DisbursementTest extends TestCase
{
    use RefreshDatabase;

    private User $initiator;
    private User $otherUser;
    private Campaign $campaign;

    protected function setUp(): void
    {
        parent::setUp();

        $category = Category::create(['category_name' => 'Bencana Alam']);

        $this->initiator = User::create([
            'name' => 'Inisiator Kebaikan',
            'email' => 'inisiator@example.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
            'is_verified' => true,
        ]);

        $this->otherUser = User::create([
            'name' => 'User Lain',
            'email' => 'other@example.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
            'is_verified' => false,
        ]);

        $this->campaign = Campaign::create([
            'user_id' => $this->initiator->id,
            'category_id' => $category->id,
            'title' => 'Bantuan Korban Banjir',
            'description' => 'Bantuan pengadaan logistik dan air bersih.',
            'target_amount' => 10000000,
            'current_amount' => 5000000,
            'target_volunteers' => 10,
            'current_volunteers' => 2,
            'location' => 'Semarang',
            'activity_date' => now()->addDays(7)->toDateString(),
            'status' => 'active',
            'campaign_mode' => 'both',
        ]);
    }

    public function test_guest_cannot_request_disbursement(): void
    {
        $response = $this->postJson("/api/campaigns/{$this->campaign->id}/disbursements", [
            'amount' => 1000000,
            'bank_name' => 'BCA',
            'account_number' => '1234567890',
            'account_name' => 'Yayasan Kebaikan',
            'reason' => 'Operasional logistik',
        ]);

        $response->assertStatus(401);
    }

    public function test_other_user_cannot_request_disbursement_for_unowned_campaign(): void
    {
        $response = $this->actingAs($this->otherUser, 'sanctum')->postJson("/api/campaigns/{$this->campaign->id}/disbursements", [
            'amount' => 1000000,
            'bank_name' => 'BCA',
            'account_number' => '1234567890',
            'account_name' => 'Yayasan Kebaikan',
            'reason' => 'Operasional logistik',
        ]);

        $response->assertStatus(403);
    }

    public function test_initiator_can_request_disbursement_successfully(): void
    {
        $response = $this->actingAs($this->initiator, 'sanctum')->postJson("/api/campaigns/{$this->campaign->id}/disbursements", [
            'amount' => 2000000,
            'bank_name' => 'BCA',
            'account_number' => '8899001122',
            'account_name' => 'Inisiator Kebaikan',
            'reason' => 'Pengadaan sembako tahap pertama',
        ]);

        $response->assertStatus(201);
        $response->assertJson([
            'success' => true,
            'message' => 'Pengajuan pencairan dana berhasil diajukan dan menunggu persetujuan Administrator.',
            'data' => [
                'campaign_id' => $this->campaign->id,
                'amount' => '2000000.00',
                'bank_name' => 'BCA',
                'account_number' => '8899001122',
                'account_name' => 'Inisiator Kebaikan',
                'reason' => 'Pengadaan sembako tahap pertama',
                'status' => 'pending',
            ],
        ]);

        $this->assertDatabaseHas('disbursements', [
            'campaign_id' => $this->campaign->id,
            'user_id' => $this->initiator->id,
            'bank_name' => 'BCA',
            'account_number' => '8899001122',
            'status' => 'pending',
        ]);
    }

    public function test_disbursement_validation_fails_on_missing_fields(): void
    {
        $response = $this->actingAs($this->initiator, 'sanctum')->postJson("/api/campaigns/{$this->campaign->id}/disbursements", [
            'amount' => 5000, // min 10000
            'bank_name' => '',
        ]);

        $response->assertStatus(422);
    }

    public function test_disbursement_fails_if_amount_exceeds_available_balance(): void
    {
        $response = $this->actingAs($this->initiator, 'sanctum')->postJson("/api/campaigns/{$this->campaign->id}/disbursements", [
            'amount' => 10000000, // saldo hanya 5.000.000
            'bank_name' => 'Mandiri',
            'account_number' => '1370001234567',
            'account_name' => 'Inisiator Kebaikan',
            'reason' => 'Penarikan penuh',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
        ]);
    }

    public function test_initiator_can_get_disbursement_history(): void
    {
        Disbursement::create([
            'campaign_id' => $this->campaign->id,
            'user_id' => $this->initiator->id,
            'amount' => 500000,
            'bank_name' => 'BNI',
            'bank_account' => '0987654321',
            'account_number' => '0987654321',
            'account_name' => 'Inisiator Kebaikan',
            'reason' => 'Uang muka logistik',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->initiator, 'sanctum')->getJson("/api/campaigns/{$this->campaign->id}/disbursements");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'campaign_title',
                'current_amount',
                'disbursements',
            ],
        ]);
        $this->assertCount(1, $response->json('data.disbursements'));
    }

    public function test_guest_cannot_access_admin_disbursements(): void
    {
        $response = $this->getJson('/api/admin/disbursements');
        $response->assertStatus(401);
    }

    public function test_regular_user_cannot_access_admin_disbursements(): void
    {
        $response = $this->actingAs($this->initiator, 'sanctum')->getJson('/api/admin/disbursements');
        $response->assertStatus(403);
    }

    public function test_admin_can_list_disbursements(): void
    {
        $admin = User::create([
            'name' => 'Admin System',
            'email' => 'admin@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        Disbursement::create([
            'campaign_id' => $this->campaign->id,
            'user_id' => $this->initiator->id,
            'amount' => 1000000,
            'bank_name' => 'BCA',
            'bank_account' => '1234567890',
            'account_number' => '1234567890',
            'account_name' => 'Inisiator Kebaikan',
            'reason' => 'Pengadaan logistik awal',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/disbursements');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);
        $this->assertNotEmpty($response->json('data'));
        $this->assertEquals('Bantuan Korban Banjir', $response->json('data.0.campaign.title'));
        $this->assertEquals('Inisiator Kebaikan', $response->json('data.0.user.name'));
    }

    public function test_admin_can_approve_disbursement_and_deduct_campaign_balance(): void
    {
        $admin = User::create([
            'name' => 'Admin System',
            'email' => 'admin.approve@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        $disbursement = Disbursement::create([
            'campaign_id' => $this->campaign->id,
            'user_id' => $this->initiator->id,
            'amount' => 2000000,
            'bank_name' => 'Mandiri',
            'bank_account' => '1370001234567',
            'account_number' => '1370001234567',
            'account_name' => 'Inisiator Kebaikan',
            'reason' => 'Tahap 1 Logistik',
            'status' => 'pending',
        ]);

        $initialBalance = $this->campaign->current_amount; // 5,000,000

        $response = $this->actingAs($admin, 'sanctum')->patchJson("/api/admin/disbursements/{$disbursement->id}/status", [
            'status' => 'approved',
            'admin_notes' => 'Pencairan disetujui setelah verifikasi LPJ awal.',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Status pencairan berhasil diperbarui.',
            'data' => [
                'disbursement' => [
                    'id' => $disbursement->id,
                    'status' => 'approved',
                ],
            ],
        ]);

        $this->assertDatabaseHas('disbursements', [
            'id' => $disbursement->id,
            'status' => 'approved',
        ]);

        $this->assertEquals($initialBalance - 2000000, $this->campaign->fresh()->current_amount);
    }

    public function test_admin_can_reject_disbursement_without_deducting_balance(): void
    {
        $admin = User::create([
            'name' => 'Admin System',
            'email' => 'admin.reject@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        $disbursement = Disbursement::create([
            'campaign_id' => $this->campaign->id,
            'user_id' => $this->initiator->id,
            'amount' => 1500000,
            'bank_name' => 'BRI',
            'bank_account' => '020601001234500',
            'account_number' => '020601001234500',
            'account_name' => 'Inisiator Kebaikan',
            'reason' => 'Tahap 2 Operasional',
            'status' => 'pending',
        ]);

        $initialBalance = $this->campaign->current_amount; // 5,000,000

        $response = $this->actingAs($admin, 'sanctum')->patchJson("/api/admin/disbursements/{$disbursement->id}/status", [
            'status' => 'rejected',
            'admin_notes' => 'Nomor rekening tidak sesuai dokumen identitas.',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Status pencairan berhasil diperbarui.',
            'data' => [
                'disbursement' => [
                    'id' => $disbursement->id,
                    'status' => 'rejected',
                ],
            ],
        ]);

        $this->assertDatabaseHas('disbursements', [
            'id' => $disbursement->id,
            'status' => 'rejected',
        ]);

        $this->assertEquals($initialBalance, $this->campaign->fresh()->current_amount);
    }

    public function test_admin_disbursement_validation_fails_on_invalid_status(): void
    {
        $admin = User::create([
            'name' => 'Admin System',
            'email' => 'admin.invalid@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        $disbursement = Disbursement::create([
            'campaign_id' => $this->campaign->id,
            'user_id' => $this->initiator->id,
            'amount' => 500000,
            'bank_name' => 'BCA',
            'bank_account' => '1234567890',
            'account_number' => '1234567890',
            'account_name' => 'Inisiator Kebaikan',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin, 'sanctum')->patchJson("/api/admin/disbursements/{$disbursement->id}/status", [
            'status' => 'cancelled',
        ]);

        $response->assertStatus(422);
    }
}
