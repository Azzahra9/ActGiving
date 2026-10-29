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
                'image_url' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
            ]
        );

        Campaign::firstOrCreate(
            ['title' => 'Buku & Seragam untuk Pelosok Flores'],
            [
                'user_id' => $inisiator->id,
                'category_id' => $categoryModels[1]->id,
                'description' => 'Mendukung pengadaan 500 paket buku pelajaran, tas sekolah, dan seragam bagi anak-anak di pedalaman Flores.',
                'target_amount' => 25000000,
                'current_amount' => 18500000,
                'target_volunteers' => 5,
                'current_volunteers' => 3,
                'location' => 'Manggarai Barat, NTT',
                'activity_date' => now()->addDays(20)->toDateString(),
                'status' => 'active',
                'campaign_mode' => 'both',
                'image_url' => 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
            ]
        );

        Campaign::firstOrCreate(
            ['title' => 'Pemeriksaan Kesehatan Lansia & Balita Gratis'],
            [
                'user_id' => $inisiator->id,
                'category_id' => $categoryModels[2]->id,
                'description' => 'Layanan cek kesehatan komprehensif, pembagian vitamin, dan makanan bergizi untuk warga prasejahtera.',
                'target_amount' => 30000000,
                'current_amount' => 12000000,
                'target_volunteers' => 8,
                'current_volunteers' => 5,
                'location' => 'Sleman, D.I. Yogyakarta',
                'activity_date' => now()->addDays(10)->toDateString(),
                'status' => 'active',
                'campaign_mode' => 'both',
                'image_url' => 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
            ]
        );

        Campaign::firstOrCreate(
            ['title' => 'Restorasi Mangrove Pesisir Utara Jawa'],
            [
                'user_id' => $inisiator->id,
                'category_id' => $categoryModels[3]->id,
                'description' => 'Aksi penanaman 2.000 bibit mangrove demi mencegah abrasi pantai dan memulihkan ekosistem pesisir.',
                'target_amount' => 15000000,
                'current_amount' => 8200000,
                'target_volunteers' => 15,
                'current_volunteers' => 9,
                'location' => 'Demak, Jawa Tengah',
                'activity_date' => now()->addDays(25)->toDateString(),
                'status' => 'active',
                'campaign_mode' => 'volunteer_only',
                'image_url' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
            ]
        );
    }
}
