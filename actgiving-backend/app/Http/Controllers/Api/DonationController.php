<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\DonationInvoiceMail;
use App\Models\Campaign;
use App\Models\Donation;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

/**
 * @group Donasi
 *
 * Endpoint checkout donasi, status pembayaran, dan simulasi webhook.
 */
class DonationController extends Controller
{
    /**
     * Helper untuk membuat data dummy pembayaran (QRIS / Virtual Account).
     */
    private function generatePaymentPayload(string $channel, string $refCode, float $amount): array
    {
        $channel = strtolower($channel);

        if ($channel === 'qris') {
            return [
                'type' => 'qris',
                'qr_string' => "00020101021226600016ID.CO.ACTGIVING0118{$refCode}520458125303360540{$amount}5802ID5910ACTGIVING6007JAKARTA6304ABCD",
                'qr_image_url' => "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ACTGIVING-{$refCode}",
            ];
        }

        // Virtual Account (BCA, Mandiri, BNI, BRI)
        $bankPrefix = match ($channel) {
            'bca_va' => '88012',
            'mandiri_va' => '89012',
            'bni_va' => '88022',
            'bri_va' => '88032',
            default => '99012',
        };

        return [
            'type' => 'virtual_account',
            'bank' => strtoupper(str_replace('_va', '', $channel)),
            'va_number' => $bankPrefix.mt_rand(10000000, 99999999),
        ];
    }

    /**
     * Guest Checkout (Tanpa Login)
     *
     * 1. Guest Checkout (Donasi Tamu tanpa Login).
     * Return dummy QRIS / Virtual Account info.
     *
     * @unauthenticated
     */
    public function guestCheckout(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'campaign_id' => 'required|exists:campaigns,id',
            'amount' => 'required|numeric|min:10000',
            'donor_name' => 'required|string|max:255',
            'donor_email' => 'required|email|max:255',
            'is_anonymous' => 'boolean',
            'payment_channel' => 'required|string|in:qris,bca_va,mandiri_va,bni_va,bri_va',
        ]);

        $campaign = Campaign::findOrFail($validated['campaign_id']);

        // Validasi status kampanye
        if ($campaign->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Donasi tidak dapat diproses karena kampanye belum aktif atau telah ditutup.',
            ], 422);
        }

        if ($campaign->campaign_mode === 'volunteer_only') {
            return response()->json([
                'success' => false,
                'message' => 'Kampanye ini hanya menerima pendaftaran relawan, bukan penggalangan dana.',
            ], 422);
        }

        $refCode = 'INV-GST-'.date('Ymd').'-'.strtoupper(Str::random(6));
        $expiresAt = Carbon::now()->addHours(24);

        $donation = Donation::create([
            'campaign_id' => $campaign->id,
            'user_id' => null, // Guest checkout
            'amount' => $validated['amount'],
            'donor_name' => $validated['donor_name'],
            'donor_email' => $validated['donor_email'],
            'is_anonymous' => $validated['is_anonymous'] ?? false,
            'payment_channel' => $validated['payment_channel'],
            'reference_code' => $refCode,
            'status' => 'pending',
            'expires_at' => $expiresAt,
        ]);

        $paymentInfo = $this->generatePaymentPayload(
            $validated['payment_channel'],
            $refCode,
            (float) $validated['amount']
        );

        return response()->json([
            'success' => true,
            'message' => 'Pesanan donasi tamu berhasil dibuat. Silakan selesaikan pembayaran.',
            'data' => [
                'donation' => $donation,
                'payment_info' => $paymentInfo,
            ],
        ], 201);
    }

    /**
     * Donasi User Terdaftar
     *
     * Checkout Donasi oleh Pengguna Terdaftar (Dual-Role User).
     */
    public function userCheckout(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'campaign_id' => 'required|exists:campaigns,id',
            'amount' => 'required|numeric|min:10000',
            'is_anonymous' => 'boolean',
            'payment_channel' => 'required|string|in:qris,bca_va,mandiri_va,bni_va,bri_va',
        ]);

        $campaign = Campaign::findOrFail($validated['campaign_id']);

        if ($campaign->status !== 'active' || $campaign->campaign_mode === 'volunteer_only') {
            return response()->json([
                'success' => false,
                'message' => 'Kampanye tidak aktif atau tidak menerima donasi dana.',
            ], 422);
        }

        $refCode = 'INV-USR-'.date('Ymd').'-'.strtoupper(Str::random(6));
        $expiresAt = Carbon::now()->addHours(24);

        $donation = Donation::create([
            'campaign_id' => $campaign->id,
            'user_id' => $user->id,
            'amount' => $validated['amount'],
            'donor_name' => $user->name,
            'donor_email' => $user->email,
            'is_anonymous' => $validated['is_anonymous'] ?? false,
            'payment_channel' => $validated['payment_channel'],
            'reference_code' => $refCode,
            'status' => 'pending',
            'expires_at' => $expiresAt,
        ]);

        $paymentInfo = $this->generatePaymentPayload(
            $validated['payment_channel'],
            $refCode,
            (float) $validated['amount']
        );

        return response()->json([
            'success' => true,
            'message' => 'Pesanan donasi berhasil dibuat.',
            'data' => [
                'donation' => $donation,
                'payment_info' => $paymentInfo,
            ],
        ], 201);
    }

    /**
     * Cek Status Pembayaran
     *
     * Cek Status Donasi Berdasarkan Reference Code (Publik).
     *
     * @unauthenticated
     */
    public function checkStatus($reference_code): JsonResponse
    {
        $donation = Donation::with('campaign:id,title')
            ->where('reference_code', $reference_code)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $donation,
        ]);
    }

    /**
     * Riwayat Donasi Saya
     *
     * Riwayat Donasi Pengguna Terdaftar.
     */
    public function myDonations(Request $request): JsonResponse
    {
        $donations = Donation::with('campaign:id,title,location')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $donations,
        ]);
    }

    /**
     * Simulasi Webhook Pembayaran (ACID)
     *
     * Webhook Simulasi Bayar Payment Gateway.
     * WAJIB ACID Transaction & lockForUpdate() untuk Update current_amount secara aman.
     *
     * @unauthenticated
     */
    public function simulateWebhook(Request $request): JsonResponse
    {
        $request->validate([
            'reference_code' => 'required|string',
            'status' => 'required|in:paid,expired',
        ]);

        return DB::transaction(function () use ($request) {
            // Penguncian baris pada tabel donations
            $donation = Donation::where('reference_code', $request->reference_code)
                ->lockForUpdate()
                ->first();

            if (! $donation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data transaksi donasi tidak ditemukan.',
                ], 404);
            }

            // Pengecekan Idempotensi: Jika transaksi sudah pernah berstatus 'paid'
            if ($donation->status === 'paid') {
                return response()->json([
                    'success' => true,
                    'message' => 'Transaksi sudah dibayar sebelumnya (Idempotent).',
                    'data' => $donation,
                ]);
            }

            if ($request->status === 'paid') {
                // Update status donasi
                $donation->status = 'paid';
                $donation->save();

                // Penguncian baris pada tabel campaigns agar tidak terjadi race condition
                $campaign = Campaign::where('id', $donation->campaign_id)
                    ->lockForUpdate()
                    ->first();

                $campaign->current_amount += $donation->amount;
                $campaign->save();

                // FR-14: Kirim kuitansi donasi via Queue (Async) agar response tetap < 2 detik (NFR-01)
                Mail::to($donation->donor_email)->queue((new DonationInvoiceMail($donation))->afterCommit());

                return response()->json([
                    'success' => true,
                    'message' => 'Simulasi pembayaran sukses. Saldo kampanye berhasil ditambahkan secara aman.',
                    'data' => [
                        'donation' => $donation,
                        'campaign_current_amount' => $campaign->current_amount,
                    ],
                ]);
            } else {
                $donation->status = 'expired';
                $donation->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Transaksi donasi ditandai kadaluwarsa/batal.',
                    'data' => $donation,
                ]);
            }
        });
    }

    /**
     * Approval Donasi oleh Inisiator (ACID)
     *
     * Manajemen Izin Donasi oleh Inisiator (Approve / Reject).
     * WAJIB ACID Transaction & lockForUpdate().
     */
    public function updateApproval(Request $request, $id): JsonResponse
    {
        $request->validate([
            'approval' => 'required|boolean',
        ]);

        return DB::transaction(function () use ($request, $id) {
            // Lock baris donasi
            $donation = Donation::where('id', $id)
                ->lockForUpdate()
                ->first();

            if (! $donation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Donasi tidak ditemukan.',
                ], 404);
            }

            // Lock baris kampanye
            $campaign = Campaign::where('id', $donation->campaign_id)
                ->lockForUpdate()
                ->first();

            // Verifikasi bahwa user adalah pemilik kampanye ini (Inisiator)
            if ($campaign->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak. Anda bukan inisiator kampanye ini.',
                ], 403);
            }

            $isApproved = (bool) $request->boolean('approval');

            // Logika Penolakan (Reject): Jika dana sebelumnya sudah masuk ke current_amount, keluarkan
            if (! $isApproved && $donation->status === 'paid' && $donation->is_approved_by_initiator !== false) {
                $campaign->current_amount = max(0, $campaign->current_amount - $donation->amount);
                $campaign->save();
                $donation->status = 'expired'; // Donasi dibatalkan
            } elseif ($isApproved && $donation->status === 'expired' && $donation->is_approved_by_initiator === false) {
                // Jika sebelumnya di-reject lalu di-approve kembali
                $campaign->current_amount += $donation->amount;
                $campaign->save();
                $donation->status = 'paid';
            }

            $donation->is_approved_by_initiator = $isApproved;
            $donation->save();

            if ($isApproved && $donation->status === 'paid') {
                Mail::to($donation->donor_email)->queue((new DonationInvoiceMail($donation))->afterCommit());
            }

            return response()->json([
                'success' => true,
                'message' => $isApproved
                    ? 'Donasi berhasil disetujui oleh Inisiator.'
                    : 'Donasi berhasil ditolak oleh Inisiator dan dana disesuaikan.',
                'data' => [
                    'donation' => $donation,
                    'campaign_current_amount' => $campaign->current_amount,
                ],
            ]);
        });
    }
}
