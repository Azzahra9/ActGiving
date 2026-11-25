<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminRoleAndCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_artisan_make_admin_creates_new_admin_user(): void
    {
        $exitCode = Artisan::call('make:admin', [
            'email' => 'superadmin@actgiving.com',
            '--name' => 'Super Administrator',
            '--password' => 'secretAdmin123!',
        ]);

        $this->assertEquals(0, $exitCode);

        $this->assertDatabaseHas('users', [
            'email' => 'superadmin@actgiving.com',
            'name' => 'Super Administrator',
            'role' => 'admin',
            'is_verified' => true,
        ]);

        $created = User::where('email', 'superadmin@actgiving.com')->first();
        $this->assertTrue(Hash::check('secretAdmin123!', $created->password));
        $this->assertTrue($created->isAdmin());
        $this->assertFalse($created->isUser());
    }

    public function test_artisan_make_admin_promotes_existing_user(): void
    {
        $user = User::create([
            'name' => 'Calon Admin',
            'email' => 'calon.admin@example.com',
            'password' => Hash::make('oldPassword123'),
            'role' => 'user',
            'is_verified' => false,
        ]);

        $exitCode = Artisan::call('make:admin', [
            'email' => 'calon.admin@example.com',
            '--password' => 'newPasswordAdmin456!',
        ]);

        $this->assertEquals(0, $exitCode);

        $user->refresh();
        $this->assertEquals('admin', $user->role);
        $this->assertTrue($user->is_verified);
        $this->assertTrue(Hash::check('newPasswordAdmin456!', $user->password));
        $this->assertTrue($user->isAdmin());
    }

    public function test_artisan_make_admin_revoke_demotes_admin_to_user(): void
    {
        $admin = User::create([
            'name' => 'Mantan Admin',
            'email' => 'mantan.admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_verified' => true,
        ]);

        $exitCode = Artisan::call('make:admin', [
            'email' => 'mantan.admin@example.com',
            '--revoke' => true,
        ]);

        $this->assertEquals(0, $exitCode);

        $admin->refresh();
        $this->assertEquals('user', $admin->role);
        $this->assertFalse($admin->isAdmin());
        $this->assertTrue($admin->isUser());
    }

    public function test_artisan_admin_make_alias_works(): void
    {
        $exitCode = Artisan::call('admin:make', [
            'email' => 'alias.admin@actgiving.com',
            '--name' => 'Alias Admin',
            '--password' => 'aliasPassword123!',
        ]);

        $this->assertEquals(0, $exitCode);

        $this->assertDatabaseHas('users', [
            'email' => 'alias.admin@actgiving.com',
            'role' => 'admin',
        ]);
    }

    public function test_admin_can_login_via_api_and_receives_admin_role(): void
    {
        User::create([
            'name' => 'Admin API',
            'email' => 'admin.api@actgiving.com',
            'password' => Hash::make('adminApiPassword123'),
            'role' => 'admin',
            'is_verified' => true,
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin.api@actgiving.com',
            'password' => 'adminApiPassword123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'email' => 'admin.api@actgiving.com',
                        'role' => 'admin',
                    ],
                ],
            ]);

        $this->assertNotEmpty($response->json('data.token'));
    }

    public function test_admin_can_access_protected_admin_endpoints(): void
    {
        $admin = User::create([
            'name' => 'Admin Bertugas',
            'email' => 'bertugas@actgiving.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_verified' => true,
        ]);

        Sanctum::actingAs($admin);

        // 1. Admin Users list
        $resUsers = $this->getJson('/api/admin/users');
        $resUsers->assertStatus(200)->assertJson(['success' => true]);

        // 2. Admin Disbursements list
        $resDisbursements = $this->getJson('/api/admin/disbursements');
        $resDisbursements->assertStatus(200)->assertJson(['success' => true]);

        // 3. Admin Reports list
        $resReports = $this->getJson('/api/admin/reports');
        $resReports->assertStatus(200)->assertJson(['success' => true]);
    }

    public function test_regular_user_is_forbidden_from_admin_endpoints(): void
    {
        $regularUser = User::create([
            'name' => 'User Biasa',
            'email' => 'biasa@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
        ]);

        Sanctum::actingAs($regularUser);

        $this->getJson('/api/admin/users')->assertStatus(403);
        $this->getJson('/api/admin/disbursements')->assertStatus(403);
        $this->getJson('/api/admin/reports')->assertStatus(403);
    }

    public function test_guest_is_unauthorized_from_admin_endpoints(): void
    {
        $this->getJson('/api/admin/users')->assertStatus(401);
        $this->getJson('/api/admin/disbursements')->assertStatus(401);
        $this->getJson('/api/admin/reports')->assertStatus(401);
    }

    public function test_admin_can_update_user_role_via_api(): void
    {
        $admin = User::create([
            'name' => 'Admin Utama',
            'email' => 'utama@actgiving.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        $targetUser = User::create([
            'name' => 'Calon Admin Baru',
            'email' => 'baru@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
        ]);

        Sanctum::actingAs($admin);

        // Promosikan ke admin
        $promoteRes = $this->patchJson("/api/admin/users/{$targetUser->id}/role", [
            'role' => 'admin',
        ]);

        $promoteRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $targetUser->id,
                    'role' => 'admin',
                    'is_verified' => true,
                ],
            ]);

        $this->assertEquals('admin', $targetUser->fresh()->role);

        // Kembalikan ke user
        $demoteRes = $this->patchJson("/api/admin/users/{$targetUser->id}/role", [
            'role' => 'user',
        ]);

        $demoteRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $targetUser->id,
                    'role' => 'user',
                ],
            ]);

        $this->assertEquals('user', $targetUser->fresh()->role);
    }

    public function test_admin_cannot_demote_themselves_via_api(): void
    {
        $admin = User::create([
            'name' => 'Admin Mandiri',
            'email' => 'mandiri@actgiving.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->patchJson("/api/admin/users/{$admin->id}/role", [
            'role' => 'user',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);

        $this->assertEquals('admin', $admin->fresh()->role);
    }

    public function test_regular_user_cannot_update_user_roles(): void
    {
        $regularUser = User::create([
            'name' => 'Hacker Wannabe',
            'email' => 'hacker@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
        ]);

        $targetUser = User::create([
            'name' => 'Target User',
            'email' => 'target@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
        ]);

        Sanctum::actingAs($regularUser);

        $response = $this->patchJson("/api/admin/users/{$targetUser->id}/role", [
            'role' => 'admin',
        ]);

        $response->assertStatus(403);
        $this->assertEquals('user', $targetUser->fresh()->role);
    }
}
