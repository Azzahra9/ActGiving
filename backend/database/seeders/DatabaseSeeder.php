<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Akun Administrator
        $admin = User::firstOrCreate(
            ['email' => 'admin@actgiving.com'],
            [
                'name' => 'Administrator ActGiving',
                'password' => Hash::make('password123'),
                'phone_whatsapp' => '081234567890',
                'city_domicile' => 'Jakarta',
                'role' => 'admin',
                'is_verified' => true,
            ]
        );

        // 2. Akun Inisiator (Dual-role user)
        $inisiator = User::firstOrCreate(
            ['email' => 'inisiator@actgiving.com'],
            [
                'name' => 'Yayasan Peduli Bersama',
                'password' => Hash::make('password123'),
                'phone_whatsapp' => '081298765432',
                'city_domicile' => 'Bandung',
                'role' => 'user',
                'is_verified' => true,
            ]
        );

        // 3. Akun Relawan
        $relawan = User::firstOrCreate(
            ['email' => 'relawan@actgiving.com'],
            [
                'name' => 'Ahmad Relawan',
                'password' => Hash::make('password123'),
                'phone_whatsapp' => '081311223344',
                'city_domicile' => 'Yogyakarta',
                'role' => 'user',
                'is_verified' => false,
            ]
        );

        // 4. Kategori Utama
        $categories = [
            'Bencana Alam',
            'Pendidikan',
            'Kesehatan',
            'Lingkungan Hidup',
            'Sosial Kemanusiaan',
        ];

        $categoryModels = [];
        foreach ($categories as $catName) {
            $categoryModels[] = Category::firstOrCreate(['category_name' => $catName]);
        }

        // 5. Sampel Kampanye Aktif
        Campaign::firstOrCreate(
            ['title' => 'Tanggap Darurat Erupsi Gunung Semeru'],
            [
                'user_id' => $inisiator->id,
                'category_id' => $categoryModels[0]->id,
                'description' => 'Penyaluran logistik darurat, masker, makanan siap saji, dan posko medis untuk warga terdampak erupsi Semeru.',
                'target_amount' => 50000000,
                'current_amount' => 15000000,
                'target_volunteers' => 10,
                'current_volunteers' => 4,
                'location' => 'Lumajang, Jawa Timur',
                'activity_date' => now()->addDays(14)->toDateString(),
                'status' => 'active',
                'campaign_mode' => 'both',
            ]
        );
    }
}
