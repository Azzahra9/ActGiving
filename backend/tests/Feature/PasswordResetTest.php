<?php

namespace Tests\Feature;

use App\Mail\ResetPasswordMail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_request_password_reset_link(): void
    {
        Mail::fake();

        $user = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@actgiving.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
        ]);

        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => 'budi@actgiving.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('password_reset_tokens', [
            'email' => 'budi@actgiving.com',
        ]);

        Mail::assertSent(ResetPasswordMail::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email) && !empty($mail->token);
        });
    }

    public function test_user_cannot_request_reset_with_unregistered_email(): void
    {
        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => 'unknown@actgiving.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_user_can_reset_password_with_valid_token(): void
    {
        Mail::fake();

        $user = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@actgiving.com',
            'password' => Hash::make('oldpassword123'),
            'role' => 'user',
        ]);

        $forgotResponse = $this->postJson('/api/auth/forgot-password', [
            'email' => 'budi@actgiving.com',
        ]);

        $token = $forgotResponse->json('data.reset_token');

        $resetResponse = $this->postJson('/api/auth/reset-password', [
            'email' => 'budi@actgiving.com',
            'token' => $token,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $resetResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        // Token should be consumed and deleted
        $this->assertDatabaseMissing('password_reset_tokens', [
            'email' => 'budi@actgiving.com',
        ]);

        // User should be able to login with new password
        $user->refresh();
        $this->assertTrue(Hash::check('newpassword123', $user->password));

        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => 'budi@actgiving.com',
            'password' => 'newpassword123',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_cannot_reset_with_invalid_token(): void
    {
        User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@actgiving.com',
            'password' => Hash::make('oldpassword123'),
            'role' => 'user',
        ]);

        $this->postJson('/api/auth/forgot-password', [
            'email' => 'budi@actgiving.com',
        ]);

        $response = $this->postJson('/api/auth/reset-password', [
            'email' => 'budi@actgiving.com',
            'token' => 'invalid-token-123',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Token reset kata sandi tidak valid.',
            ]);
    }
}
