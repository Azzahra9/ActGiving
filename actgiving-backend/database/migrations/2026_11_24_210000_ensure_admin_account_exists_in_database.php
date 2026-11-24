<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Otomatis membuat atau memperbarui akun Administrator produksi saat php artisan migrate --force dijalankan.
     */
    public function up(): void
    {
        // Jangan jalankan seeder otomatis pada environment automated testing (PHPUnit)
        if (app()->environment('testing')) {
            return;
        }

        $admin = User::firstOrNew(['email' => 'admin@actgiving.com']);
        $admin->name = 'Admin ActGiving';
        $admin->password = Hash::make('adminactgiving');
        $admin->role = 'admin';
        $admin->is_verified = true;
        if (! $admin->email_verified_at) {
            $admin->email_verified_at = now();
        }
        $admin->save();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Pertahankan akun jika rollback
    }
};
