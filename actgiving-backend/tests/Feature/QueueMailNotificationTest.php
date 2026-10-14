<?php

namespace Tests\Feature;

use App\Mail\DonationInvoiceMail;
use App\Mail\VolunteerStatusMail;
use App\Models\Campaign;
use App\Models\Category;
use App\Models\Donation;
use App\Models\User;
use App\Models\VolunteerRegistration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class QueueMailNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_donation_invoice_mail_is_queued_on_successful_webhook(): void
    {
        Mail::fake();

        $user = User::create([
            'name' => 'Inisiator Mail',
            'email' => 'initiator_mail@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
        ]);

        $category = Category::create(['category_name' => 'Sosial']);

        $campaign = Campaign::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Kampanye Uji Mail',
            'description' => 'Uji pengiriman invoice',
            'target_amount' => 5000000,
            'current_amount' => 0,
            'location' => 'Bandung',
            'status' => 'active',
            'campaign_mode' => 'fund_only',
        ]);

        $donation = Donation::create([
            'campaign_id' => $campaign->id,
            'amount' => 150000,
            'donor_name' => 'Dermawan Baik',
            'donor_email' => 'dermawan@example.com',
            'payment_channel' => 'qris',
            'reference_code' => 'INV-TEST-001',
            'status' => 'pending',
            'expires_at' => now()->addHours(24),
        ]);

        $response = $this->postJson('/api/donations/webhook-simulate', [
            'reference_code' => 'INV-TEST-001',
            'status' => 'paid',
        ]);

        $response->assertStatus(200);

        // Verifikasi email masuk antrean queue
        Mail::assertQueued(DonationInvoiceMail::class, function ($mail) {
            return $mail->hasTo('dermawan@example.com');
        });
    }

    public function test_volunteer_status_mail_is_queued_on_initiator_action(): void
    {
        Mail::fake();

        $initiator = User::create([
            'name' => 'Inisiator Aksi',
            'email' => 'inisiator_aksi@actgiving.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
        ]);

        $volunteer = User::create([
            'name' => 'Relawan Semangat',
            'email' => 'relawan_semangat@example.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
        ]);

        $category = Category::create(['category_name' => 'Kemanusiaan']);

        $campaign = Campaign::create([
            'user_id' => $initiator->id,
            'category_id' => $category->id,
            'title' => 'Aksi Lingkungan',
            'description' => 'Aksi penanaman pohon',
            'target_amount' => 0,
            'current_amount' => 0,
            'target_volunteers' => 5,
            'current_volunteers' => 0,
            'location' => 'Bogor',
            'status' => 'active',
            'campaign_mode' => 'volunteer_only',
        ]);

        $registration = VolunteerRegistration::create([
            'campaign_id' => $campaign->id,
            'user_id' => $volunteer->id,
            'skills' => 'Penanaman bibit pohon',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($initiator, 'sanctum')->patchJson("/api/volunteer-registrations/{$registration->id}/status", [
            'status' => 'accepted',
        ]);

        $response->assertStatus(200);

        // Verifikasi email notifikasi status relawan masuk queue
        Mail::assertQueued(VolunteerStatusMail::class, function ($mail) {
            return $mail->hasTo('relawan_semangat@example.com');
        });
    }
}
