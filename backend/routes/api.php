<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\CampaignReportController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DisbursementController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\LPJController;
use App\Http\Controllers\Api\VolunteerRegistrationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| RESTful API Routes - ActGiving Platform
|--------------------------------------------------------------------------
*/

// 1. PUBLIC AUTHENTICATION ROUTES (Including FR-05 Forgot & Reset Password)
Route::prefix('auth')->middleware('throttle:auth-limit')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// 2. PUBLIC CAMPAIGNS, CATEGORIES, & REPORTING (FR-13)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/campaigns', [CampaignController::class, 'index']);
Route::get('/campaigns/{id}', [CampaignController::class, 'show']);
Route::get('/campaigns/{id}/lpj', [LPJController::class, 'index']); // Public list LPJ
Route::post('/campaigns/{id}/reports', [CampaignReportController::class, 'store']); // FR-13: Laporan Aduan Publik
Route::post('/campaigns/{id}/volunteer-register', [VolunteerRegistrationController::class, 'register']); // Registrasi akun relawan baru & lamaran misi
Route::get('/initiator/volunteers', [VolunteerRegistrationController::class, 'initiatorVolunteers']); // Daftar Pendaftar Relawan Inisiator
Route::get('/campaigns/{id}/registrations', [VolunteerRegistrationController::class, 'getCampaignRegistrations']); // Daftar pendaftar per kampanye
Route::patch('/volunteer-registrations/{id}/status', [VolunteerRegistrationController::class, 'updateStatus']); // Seleksi status pendaftar relawan (accept/reject)

// 3. PUBLIC DONATIONS & SIMULATION WEBHOOK
Route::post('/donations', [DonationController::class, 'store']); // Pencatatan Transaksi Donasi Nyata / QRIS
Route::get('/donations', [DonationController::class, 'indexAdmin']); // Daftar Transaksi Donasi
Route::get('/admin/donations', [DonationController::class, 'indexAdmin']); // Audit Transaksi Sandbox
Route::get('/admin/campaigns', [AdminController::class, 'indexCampaigns']); // Antrean Moderasi Kampanye
Route::patch('/admin/campaigns/{id}/status', [AdminController::class, 'updateCampaignStatus']);
Route::get('/admin/lpj', [LPJController::class, 'adminIndex']); // Antrean Audit LPJ
Route::patch('/admin/lpj/{id}/status', [LPJController::class, 'adminUpdateStatus']);
Route::patch('/admin/lpj/{id}/verify', [LPJController::class, 'adminVerify']);
Route::patch('/admin/lpj/{id}/unverify', [LPJController::class, 'adminUnverify']);

Route::prefix('donations')->group(function () {
    // Rate Limiting Khusus: Maksimal 10 request per menit per IP untuk mencegah spam donasi fiktif
    Route::post('/guest-checkout', [DonationController::class, 'guestCheckout'])->middleware('throttle:guest-checkout-limit');
    Route::get('/{reference_code}/status', [DonationController::class, 'checkStatus']);
    Route::post('/webhook-simulate', [DonationController::class, 'simulateWebhook']);
});

// 4. PROTECTED ROUTES (Requires Sanctum Token)
Route::middleware('auth:sanctum')->group(function () {

    // Auth Profile & Logout
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Donasi oleh User Terdaftar (Dual-Role)
    Route::post('/donations/user-checkout', [DonationController::class, 'userCheckout']);
    Route::get('/my-donations', [DonationController::class, 'myDonations']);

    // INISIATOR: Kampanye, Seleksi Relawan, Approval Donasi, & Pencairan Dana (Disbursement)
    Route::post('/campaigns', [CampaignController::class, 'store']);
    Route::get('/my-campaigns', [CampaignController::class, 'myCampaigns']);
    Route::put('/campaigns/{id}', [CampaignController::class, 'update']);
    Route::delete('/campaigns/{id}', [CampaignController::class, 'destroy']);
    Route::post('/campaigns/{id}/lpj', [LPJController::class, 'store']); // FR-12: Upload LPJ via FileUploadService
    Route::put('/campaigns/{campaign_id}/lpj/{id}', [LPJController::class, 'update']);
    Route::patch('/campaigns/{campaign_id}/lpj/{id}', [LPJController::class, 'update']);
    Route::delete('/campaigns/{campaign_id}/lpj/{id}', [LPJController::class, 'destroy']);

    // FR-11: Pencairan Dana oleh Inisiator
    Route::post('/campaigns/{id}/disbursements', [DisbursementController::class, 'store']);
    Route::get('/campaigns/{id}/disbursements', [DisbursementController::class, 'indexByCampaign']);

    // FR: Manajemen Izin Donasi oleh Inisiator (Approve/Reject)
    Route::patch('/donations/{id}/approval', [DonationController::class, 'updateApproval']);

    // RELAWAN: Riwayat Pendaftaran
    Route::get('/my-volunteer-registrations', [VolunteerRegistrationController::class, 'myRegistrations']);

    // ADMINISTRATOR: Verifikasi User, Kelola Kategori, Disbursement & Reports
    Route::prefix('admin')->middleware('admin')->group(function () {
        // FR-11: Validasi Persetujuan Pencairan Dana
        Route::patch('/disbursements/{id}/status', [DisbursementController::class, 'updateStatus']);

        // FR-13: Monitoring Aduan Kampanye Fiktif
        Route::get('/reports', [CampaignReportController::class, 'indexAdmin']);

        // Verifikasi Inisiator / User
        Route::get('/users', [AdminController::class, 'indexUsers']);
        Route::patch('/users/{id}/verify', [AdminController::class, 'verifyUser']);

        // Manajemen Kategori
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    });
});
