<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kuitansi Donasi - ActGiving</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f7f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 25px; }
        .header h1 { color: #0284c7; margin: 0; font-size: 26px; }
        .badge { display: inline-block; padding: 4px 12px; background-color: #10b981; color: white; border-radius: 9999px; font-size: 13px; font-weight: bold; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
        .table td:first-child { color: #64748b; width: 40%; }
        .table td:last-child { font-weight: 600; }
        .total { font-size: 20px; color: #0f172a; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ActGiving</h1>
            <p>Platform Donasi & Kerelawanan</p>
            <span class="badge">PEMBAYARAN BERHASIL</span>
        </div>

        <p>Halo <strong>{{ $donation->donor_name }}</strong>,</p>
        <p>Terima kasih atas kebaikan Anda. Donasi Anda telah kami terima dan akan disalurkan sesuai peruntukannya.</p>

        <table class="table">
            <tr>
                <td>Kode Referensi:</td>
                <td>{{ $donation->reference_code }}</td>
            </tr>
            <tr>
                <td>Program Kampanye:</td>
                <td>{{ $campaign->title ?? 'Program Kampanye' }}</td>
            </tr>
            <tr>
                <td>Kanal Pembayaran:</td>
                <td>{{ strtoupper($donation->payment_channel) }}</td>
            </tr>
            <tr>
                <td>Waktu Pembayaran:</td>
                <td>{{ $donation->updated_at->format('d M Y, H:i') }} WIB</td>
            </tr>
            <tr>
                <td>Jumlah Donasi:</td>
                <td class="total">Rp {{ number_format($donation->amount, 0, ',', '.') }}</td>
            </tr>
        </table>

        <p>Semoga kebaikan Anda membawa keberkahan dan senyuman bagi mereka yang membutuhkan.</p>

        <div class="footer">
            <p>&copy; {{ date('Y') }} ActGiving Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
