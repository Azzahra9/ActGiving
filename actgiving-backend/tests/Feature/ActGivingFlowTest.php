<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\Disbursement;
use App\Models\Donation;
use App\Models\User;
use App\Models\VolunteerRegistration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActGivingFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_full_acid_and_flow(): void
    {
        // 1. Buat User & Kategori
        $admin = User::create([
            'name' => 'Admin System',
            'email' => 'admin@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'is_verified' => true,
        ]);

        $initiator = User::create([
            'name' => 'Inisiator A',
            'email' => 'initiator@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
            'is_verified' => true,
        ]);

        $volunteer1 = User::create([
            'name' => 'Relawan 1',
            'email' => 'volunteer1@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
        ]);

        $volunteer2 = User::create([
            'name' => 'Relawan 2',
            'email' => 'volunteer2@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
        ]);

        $category = Category::create(['category_name' => 'Kemanusiaan']);

        // 2. Inisiator membuat kampanye
        $campaign = Campaign::create([
            'user_id' => $initiator->id,
            'category_id' => $category->id,
            'title' => 'Bantuan Korban Bencana',
            'description' => 'Aksi tanggap darurat bencana.',
            'target_amount' => 5000000,
            'current_amount' => 0,
            'target_volunteers' => 1, // Target hanya 1 relawan
            'current_volunteers' => 0,
            'location' => 'Padang',
            'status' => 'active',
            'campaign_mode' => 'both',
        ]);

        // 3. Guest Checkout Donasi
        $guestRes = $this->postJson('/api/donations/guest-checkout', [
            'campaign_id' => $campaign->id,
            'amount' => 100000,
            'donor_name' => 'Budi Baik',
            'donor_email' => 'budi@example.com',
            'payment_channel' => 'qris',
        ]);

        $guestRes->assertStatus(201);
        $refCode = $guestRes->json('data.donation.reference_code');

        // 4. Simulasi Webhook Pembayaran (ACID & LockForUpdate)
        $webhookRes = $this->postJson('/api/donations/webhook-simulate', [
            'reference_code' => $refCode,
            'status' => 'paid',
        ]);

        $webhookRes->assertStatus(200);
        $this->assertEquals(100000, $campaign->fresh()->current_amount);
        $this->assertEquals('paid', Donation::where('reference_code', $refCode)->first()->status);

        // 5. Inisiator Approval Donasi (ACID)
        $donationId = $guestRes->json('data.donation.id');
        $approvalRes = $this->actingAs($initiator, 'sanctum')->patchJson("/api/donations/{$donationId}/approval", [
            'approval' => true,
        ]);
        $approvalRes->assertStatus(200);
        $this->assertTrue(Donation::find($donationId)->is_approved_by_initiator);

        // 6. Relawan 1 & Relawan 2 mendaftar
        $reg1Res = $this->actingAs($volunteer1, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/volunteer-register", [
            'skills' => 'First Aid, Logistik',
        ]);
        $reg1Res->assertStatus(201);
        $reg1Id = $reg1Res->json('data.id');

        $reg2Res = $this->actingAs($volunteer2, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/volunteer-register", [
            'skills' => 'Dapur Umum',
        ]);
        $reg2Res->assertStatus(201);
        $reg2Id = $reg2Res->json('data.id');

        // 7. Inisiator Approve Relawan 1 (Kapasitas pas: 1/1)
        $approve1Res = $this->actingAs($initiator, 'sanctum')->patchJson("/api/volunteer-registrations/{$reg1Id}/status", [
            'status' => 'accepted',
        ]);
        $approve1Res->assertStatus(200);
        $this->assertEquals(1, $campaign->fresh()->current_volunteers);

        // 8. Inisiator Approve Relawan 2 (Kapasitas penuh -> WAJIB 400 Bad Request)
        $approve2Res = $this->actingAs($initiator, 'sanctum')->patchJson("/api/volunteer-registrations/{$reg2Id}/status", [
            'status' => 'accepted',
        ]);
        $approve2Res->assertStatus(400);
        $this->assertEquals(1, $campaign->fresh()->current_volunteers);

        // 9. Inisiator Mengajukan Pencairan Dana (Disbursement)
        $disburseRes = $this->actingAs($initiator, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/disbursements", [
            'amount' => 50000,
            'bank_name' => 'BCA',
            'bank_account' => '1234567890',
        ]);
        $disburseRes->assertStatus(201);
        $disburseId = $disburseRes->json('data.id');

        // 10. Admin Menyetujui Pencairan (ACID Transaction -> Saldo Berkurang)
        $adminApproveRes = $this->actingAs($admin, 'sanctum')->patchJson("/api/admin/disbursements/{$disburseId}/status", [
            'status' => 'approved',
            'admin_notes' => 'Disetujui untuk operasional logistik',
        ]);
        $adminApproveRes->assertStatus(200);
        $this->assertEquals(50000, $campaign->fresh()->current_amount);
        $this->assertEquals('approved', Disbursement::find($disburseId)->status);

        // 11. FR-13: Laporan Aduan Kampanye Fiktif
        $reportRes = $this->postJson("/api/campaigns/{$campaign->id}/reports", [
            'reporter_email' => 'citizen@example.com',
            'reason_category' => 'Indikasi Fiktif',
            'description' => 'Mohon diteliti bukti fisik kegiatannya.',
        ]);
        $reportRes->assertStatus(201);

        // 12. FR-05: Lupa & Reset Password
        $forgotRes = $this->postJson('/api/auth/forgot-password', [
            'email' => 'volunteer1@actgiving.com',
        ]);
        $forgotRes->assertStatus(200);
        $token = $forgotRes->json('data.reset_token');

        $resetRes = $this->postJson('/api/auth/reset-password', [
            'email' => 'volunteer1@actgiving.com',
            'token' => $token,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);
        $resetRes->assertStatus(200);
    }
}
