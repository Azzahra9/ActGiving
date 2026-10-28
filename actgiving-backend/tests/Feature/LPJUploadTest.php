<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\LpjReport;
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
                    'status',
                    'description',
                    'proof_image_url',
                ],
                'file_stored_path',
                'public_url',
            ],
        ]);

        $this->assertEquals('pending', $response->json('data.lpj_report.status'));

        $storedPath = $response->json('data.file_stored_path');
        Storage::disk('public')->assertExists($storedPath);
    }

    public function test_initiator_can_upload_lpj_with_multiple_activity_photos(): void
    {
        Storage::fake('public');

        $user = User::create([
            'name' => 'Inisiator Multi LPJ',
            'email' => 'lpj_multi@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
            'is_verified' => true,
        ]);

        $category = Category::create(['category_name' => 'Bencana']);

        $campaign = Campaign::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Kampanye Multi Foto LPJ',
            'description' => 'Uji multi upload LPJ',
            'target_amount' => 2000000,
            'current_amount' => 2000000,
            'location' => 'Bandung',
            'status' => 'active',
            'campaign_mode' => 'both',
        ]);

        $file1 = UploadedFile::fake()->image('foto_aksi_1.jpg', 600, 600)->size(500);
        $file2 = UploadedFile::fake()->image('foto_aksi_2.jpg', 600, 600)->size(500);

        $response = $this->actingAs($user, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/lpj", [
            'description' => 'Dokumentasi penyerahan logistik dan perbaikan posko lapangan.',
            'activity_photos' => [$file1, $file2],
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'lpj_report' => [
                    'id',
                    'campaign_id',
                    'status',
                    'description',
                    'proof_image_url',
                    'activity_photos',
                ],
                'activity_photo_urls',
            ],
        ]);

        $this->assertEquals('pending', $response->json('data.lpj_report.status'));
        $this->assertCount(2, $response->json('data.activity_photo_urls'));
    }

    public function test_admin_can_verify_lpj_status(): void
    {
        $admin = User::create([
            'name' => 'Administrator',
            'email' => 'admin_audit@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'is_verified' => true,
        ]);

        $user = User::create([
            'name' => 'Inisiator 1',
            'email' => 'inisiator1@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
            'is_verified' => true,
        ]);

        $category = Category::create(['category_name' => 'Pendidikan']);

        $campaign = Campaign::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Kampanye Sekolah',
            'description' => 'Uji verifikasi LPJ',
            'target_amount' => 1000000,
            'current_amount' => 1000000,
            'location' => 'Yogyakarta',
            'status' => 'active',
            'campaign_mode' => 'fund_only',
        ]);

        $lpj = LpjReport::create([
            'campaign_id' => $campaign->id,
            'status' => 'pending',
            'description' => 'Pembelian buku dan perlengkapan kelas baru.',
            'proof_image_url' => 'https://example.com/receipt.jpg',
        ]);

        // Admin verifikasi sah via PATCH /api/admin/lpj/{id}/status
        $response = $this->actingAs($admin, 'sanctum')->patchJson("/api/admin/lpj/{$lpj->id}/status", [
            'status' => 'verified',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('verified', $response->json('data.status'));
        $this->assertNotNull($response->json('data.verified_at'));

        // Cek database
        $this->assertDatabaseHas('lpj_reports', [
            'id' => $lpj->id,
            'status' => 'verified',
        ]);
    }

    public function test_initiator_cannot_edit_or_delete_verified_lpj(): void
    {
        $user = User::create([
            'name' => 'Inisiator Kunci',
            'email' => 'kunci@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
            'is_verified' => true,
        ]);

        $category = Category::create(['category_name' => 'Sosial']);

        $campaign = Campaign::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Kampanye Kunci',
            'description' => 'Uji penguncian LPJ',
            'target_amount' => 1000000,
            'current_amount' => 1000000,
            'location' => 'Surabaya',
            'status' => 'active',
            'campaign_mode' => 'fund_only',
        ]);

        $lpj = LpjReport::create([
            'campaign_id' => $campaign->id,
            'status' => 'verified', // SUDAH SAH / VERIFIED
            'description' => 'Distribusi bantuan paket makanan lansia.',
            'proof_image_url' => 'https://example.com/proof.jpg',
        ]);

        // Inisiator mencoba UPDATE LPJ yang sudah diverifikasi sah -> HARUS 403 FORBIDDEN
        $updateResponse = $this->actingAs($user, 'sanctum')->putJson("/api/campaigns/{$campaign->id}/lpj/{$lpj->id}", [
            'description' => 'Mencoba mengubah data setelah lolos audit admin.',
        ]);
        $updateResponse->assertStatus(403);

        // Inisiator mencoba DELETE LPJ yang sudah diverifikasi sah -> HARUS 403 FORBIDDEN
        $deleteResponse = $this->actingAs($user, 'sanctum')->deleteJson("/api/campaigns/{$campaign->id}/lpj/{$lpj->id}");
        $deleteResponse->assertStatus(403);
    }

    public function test_public_only_receives_verified_lpj(): void
    {
        $user = User::create([
            'name' => 'Inisiator Publik',
            'email' => 'inisiator_pub@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
            'is_verified' => true,
        ]);

        $category = Category::create(['category_name' => 'Kesehatan']);

        $campaign = Campaign::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Kampanye Sehat',
            'description' => 'Uji linimasa publik',
            'target_amount' => 3000000,
            'current_amount' => 3000000,
            'location' => 'Medan',
            'status' => 'active',
            'campaign_mode' => 'fund_only',
        ]);

        // LPJ 1: Masih Pending (belum diapprove admin)
        LpjReport::create([
            'campaign_id' => $campaign->id,
            'status' => 'pending',
            'description' => 'LPJ Tahap 1 masih dalam antrean moderasi.',
            'proof_image_url' => 'https://example.com/pending.jpg',
        ]);

        // LPJ 2: Sudah Verified (Lolos audit admin)
        $lpjVerified = LpjReport::create([
            'campaign_id' => $campaign->id,
            'status' => 'verified',
            'description' => 'LPJ Tahap 2 sudah resmi lolos verifikasi sah admin.',
            'proof_image_url' => 'https://example.com/verified.jpg',
        ]);

        // Akses endpoint publik tanpa login
        $response = $this->getJson("/api/campaigns/{$campaign->id}/lpj");
        $response->assertStatus(200);

        $reports = $response->json('data.lpj_reports');
        $this->assertCount(1, $reports);
        $this->assertEquals($lpjVerified->id, $reports[0]['id']);
        $this->assertEquals('verified', $reports[0]['status']);
    }

    public function test_initiator_can_upload_final_lpj_and_admin_verification_closes_campaign(): void
    {
        Storage::fake('public');

        $admin = User::create([
            'name' => 'Admin Auditor',
            'email' => 'admin_final@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'is_verified' => true,
        ]);

        $initiator = User::create([
            'name' => 'Inisiator Final',
            'email' => 'inisiator_final@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
            'is_verified' => true,
        ]);

        $category = Category::create(['category_name' => 'Lingkungan']);

        $campaign = Campaign::create([
            'user_id' => $initiator->id,
            'category_id' => $category->id,
            'title' => 'Kampanye Reboisasi Mangrove',
            'description' => 'Penanaman 1000 bibit mangrove',
            'target_amount' => 5000000,
            'current_amount' => 5000000,
            'location' => 'Semarang',
            'status' => 'active',
            'campaign_mode' => 'fund_only',
        ]);

        $file = UploadedFile::fake()->image('bukti_akhir.jpg', 600, 600)->size(500);

        // 1. Inisiator upload LPJ Akhir (is_final = true)
        $uploadRes = $this->actingAs($initiator, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/lpj", [
            'title' => 'LPJ Akhir Reboisasi Mangrove Selesai 100%',
            'description' => 'Seluruh dana telah dibelanjakan untuk bibit dan penanaman telah tuntas.',
            'amount_spent' => 5000000,
            'is_final' => true,
            'report_type' => 'final',
            'proof_image' => $file,
        ]);

        $uploadRes->assertStatus(201);
        $lpjId = $uploadRes->json('data.lpj_report.id');
        $this->assertTrue($uploadRes->json('data.lpj_report.is_final'));
        $this->assertEquals('final', $uploadRes->json('data.lpj_report.report_type'));
        $this->assertEquals('pending', $uploadRes->json('data.lpj_report.status'));

        // Kampanye masih aktif sebelum admin verifikasi sah
        $this->assertEquals('active', $campaign->fresh()->status);

        // 2. Admin memverifikasi sah LPJ Akhir
        $verifyRes = $this->actingAs($admin, 'sanctum')->patchJson("/api/admin/lpj/{$lpjId}/verify");
        $verifyRes->assertStatus(200);
        $this->assertEquals('verified', $verifyRes->json('data.status'));

        // Status kampanye otomatis berubah menjadi closed
        $this->assertEquals('closed', $campaign->fresh()->status);

        // 3. Batalkan verifikasi -> kampanye kembali menjadi active
        $unverifyRes = $this->actingAs($admin, 'sanctum')->patchJson("/api/admin/lpj/{$lpjId}/unverify");
        $unverifyRes->assertStatus(200);
        $this->assertEquals('active', $campaign->fresh()->status);
    }

    public function test_progress_lpj_verification_does_not_close_campaign(): void
    {
        Storage::fake('public');

        $admin = User::create([
            'name' => 'Admin Auditor 2',
            'email' => 'admin_prog@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'is_verified' => true,
        ]);

        $initiator = User::create([
            'name' => 'Inisiator Progress',
            'email' => 'inisiator_prog@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
            'is_verified' => true,
        ]);

        $category = Category::create(['category_name' => 'Sosial Anak']);

        $campaign = Campaign::create([
            'user_id' => $initiator->id,
            'category_id' => $category->id,
            'title' => 'Kampanye Bantuan Yatim',
            'description' => 'Program berkelanjutan',
            'target_amount' => 10000000,
            'current_amount' => 5000000,
            'location' => 'Makassar',
            'status' => 'active',
            'campaign_mode' => 'fund_only',
        ]);

        $file = UploadedFile::fake()->image('bukti_tahap1.jpg', 600, 600)->size(500);

        // Upload LPJ Progress / Berkala (is_final = false)
        $uploadRes = $this->actingAs($initiator, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/lpj", [
            'title' => 'LPJ Tahap 1 Penyerahan Seragam',
            'description' => 'Penyaluran seragam sekolah tahap awal.',
            'amount_spent' => 2500000,
            'is_final' => false,
            'report_type' => 'progress',
            'proof_image' => $file,
        ]);

        $uploadRes->assertStatus(201);
        $lpjId = $uploadRes->json('data.lpj_report.id');
        $this->assertFalse($uploadRes->json('data.lpj_report.is_final'));
        $this->assertEquals('progress', $uploadRes->json('data.lpj_report.report_type'));

        // Admin verifikasi sah via status endpoint
        $verifyRes = $this->actingAs($admin, 'sanctum')->patchJson("/api/admin/lpj/{$lpjId}/status", [
            'status' => 'verified',
        ]);
        $verifyRes->assertStatus(200);

        // Kampanye TETAP 'active' karena bukan LPJ Akhir
        $this->assertEquals('active', $campaign->fresh()->status);
    }

    public function test_total_realisasi_is_stored_and_photos_are_not_duplicated(): void
    {
        Storage::fake('public');

        $initiator = User::create([
            'name' => 'Inisiator Realisasi',
            'email' => 'inisiator_realisasi@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
            'is_verified' => true,
        ]);

        $category = Category::create(['category_name' => 'Kemanusiaan']);

        $campaign = Campaign::create([
            'user_id' => $initiator->id,
            'category_id' => $category->id,
            'title' => 'Kampanye Uji Realisasi',
            'description' => 'Program bantuan logistik',
            'target_amount' => 5000000,
            'current_amount' => 5000000,
            'location' => 'Bandung',
            'status' => 'active',
            'campaign_mode' => 'fund_only',
        ]);

        $file1 = UploadedFile::fake()->image('foto_kegiatan_1.jpg', 600, 600)->size(500);

        // Kirim total_realisasi serta budget_items dan pastikan foto tidak dobel
        $response = $this->actingAs($initiator, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/lpj", [
            'title' => 'LPJ Pengadaan Logistik',
            'description' => 'Distribusi bantuan paket makanan dan obat.',
            'total_realisasi' => 4500000,
            'budget_items' => [
                ['name' => 'Paket Sembako', 'amount' => 3000000],
                ['name' => 'Armada Distribusi', 'amount' => 1500000],
            ],
            'proof_image' => $file1,
            'activity_photos' => [$file1],
        ]);

        $response->assertStatus(201);
        $lpjData = $response->json('data.lpj_report');
        $this->assertEquals(4500000, (float) $lpjData['amount_spent']);
        $this->assertEquals(4500000, (float) $lpjData['total_realisasi']);
        // Pastikan hanya 1 foto tersimpan (tidak terduplikasi karena proof_image dan activity_photos)
        $this->assertCount(1, $lpjData['activity_photos']);
    }
}
