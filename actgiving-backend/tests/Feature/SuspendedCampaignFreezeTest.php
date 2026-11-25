<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\Disbursement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * UC-04 A2: kampanye yang dibekukan (suspended) tidak menerima donasi
 * dan dananya tidak bisa dicairkan.
 *   php artisan test --filter=SuspendedCampaignFreezeTest
 */
class SuspendedCampaignFreezeTest extends TestCase
{
    use RefreshDatabase;

    private function user(string $role = 'user'): User
    {
        return User::factory()->create(['role' => $role, 'password' => Hash::make('password123')]);
    }

    private function campaign(User $owner, string $status): Campaign
    {
        $cat = Category::firstOrCreate(['category_name' => 'Kemanusiaan']);

        return Campaign::create([
            'user_id' => $owner->id,
            'category_id' => $cat->id,
            'title' => 'Kampanye Uji',
            'description' => 'Deskripsi',
            'target_amount' => 5000000,
            'current_amount' => 1000000,
            'location' => 'Makassar',
            'status' => $status,
            'campaign_mode' => 'both',
            'target_volunteers' => 5,
            'current_volunteers' => 0,
        ]);
    }

    public function test_donation_to_suspended_campaign_is_rejected(): void
    {
        $campaign = $this->campaign($this->user(), 'suspended');

        $this->postJson('/api/donations', [
            'campaign_id' => $campaign->id,
            'amount' => 50000,
        ])->assertStatus(422);
    }

    public function test_donation_to_unknown_campaign_returns_404(): void
    {
        $this->campaign($this->user(), 'active');

        $this->postJson('/api/donations', [
            'campaign_id' => 999999,
            'amount' => 50000,
        ])->assertStatus(404);
    }

    public function test_initiator_cannot_request_disbursement_on_suspended_campaign(): void
    {
        $owner = $this->user();
        $campaign = $this->campaign($owner, 'suspended');

        $this->actingAs($owner, 'sanctum')->postJson("/api/campaigns/{$campaign->id}/disbursements", [
            'amount' => 50000,
            'bank_name' => 'BCA',
            'account_number' => '1234567890',
            'account_name' => 'Uji',
        ])->assertStatus(422);
    }

    public function test_admin_cannot_approve_disbursement_of_suspended_campaign(): void
    {
        $owner = $this->user();
        $admin = $this->user('admin');
        $campaign = $this->campaign($owner, 'suspended');

        $disbursement = Disbursement::create([
            'campaign_id' => $campaign->id,
            'user_id' => $owner->id,
            'amount' => 50000,
            'bank_name' => 'BCA',
            'account_number' => '1234567890',
            'account_name' => 'Uji',
            'reason' => 'Uji',
            'status' => 'pending',
        ]);

        $this->actingAs($admin, 'sanctum')->patchJson("/api/admin/disbursements/{$disbursement->id}/status", [
            'status' => 'approved',
        ])->assertStatus(422);

        $this->assertEquals('pending', $disbursement->fresh()->status);
    }
}
