<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminUserVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_admin_user_verification(): void
    {
        $targetUser = User::create([
            'name' => 'Calon Inisiator',
            'email' => 'calon@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_verified' => false,
        ]);

        $response = $this->patchJson("/api/admin/users/{$targetUser->id}/verify");

        $response->assertStatus(401);
    }

    public function test_regular_user_cannot_access_admin_user_verification(): void
    {
        $regularUser = User::create([
            'name' => 'User Biasa',
            'email' => 'user@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
        ]);

        $targetUser = User::create([
            'name' => 'Calon Inisiator',
            'email' => 'calon@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_verified' => false,
        ]);

        Sanctum::actingAs($regularUser);

        $response = $this->patchJson("/api/admin/users/{$targetUser->id}/verify");

        $response->assertStatus(403);
    }

    public function test_admin_can_list_users(): void
    {
        $admin = User::create([
            'name' => 'Admin System',
            'email' => 'admin@actgiving.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Inisiator A',
            'email' => 'inisiator.a@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_verified' => false,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/users');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_admin_can_verify_user_as_initiator(): void
    {
        $admin = User::create([
            'name' => 'Admin System',
            'email' => 'admin@actgiving.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        $targetUser = User::create([
            'name' => 'Calon Inisiator',
            'email' => 'calon@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_verified' => false,
        ]);

        Sanctum::actingAs($admin);

        // Call without body (defaulting to verify)
        $response = $this->patchJson("/api/admin/users/{$targetUser->id}/verify");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $targetUser->id,
                    'is_verified' => true,
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
            'is_verified' => true,
        ]);
    }

    public function test_admin_can_revoke_user_verification(): void
    {
        $admin = User::create([
            'name' => 'Admin System',
            'email' => 'admin@actgiving.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        $targetUser = User::create([
            'name' => 'Inisiator Aktif',
            'email' => 'aktif@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_verified' => true,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->patchJson("/api/admin/users/{$targetUser->id}/verify", [
            'is_verified' => false,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $targetUser->id,
                    'is_verified' => false,
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
            'is_verified' => false,
        ]);
    }
}
