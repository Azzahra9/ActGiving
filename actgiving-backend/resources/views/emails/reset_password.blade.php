<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Reset Kata Sandi - ActGiving</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f7f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 25px; }
        .header h1 { color: #2563EB; margin: 0; font-size: 26px; }
        .badge { display: inline-block; padding: 4px 12px; background-color: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; border-radius: 9999px; font-size: 13px; font-weight: bold; margin-top: 8px; }
        .button { display: inline-block; background-color: #2563EB; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; margin: 20px 0; font-size: 14px; }
        .token-box { background-color: #f1f5f9; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 14px; word-break: break-all; margin: 15px 0; border: 1px dashed #cbd5e1; }
        .footer { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ActGiving</h1>
            <p style="margin: 4px 0; color: #64748b; font-size: 13px;">Platform Donasi & Transparansi Lapangan Terbuka</p>
            <span class="badge">RESET KATA SANDI (FR-05)</span>
        </div>

        <p>Halo,</p>
        <p>Kami menerima permintaan untuk mereset kata sandi akun ActGiving Anda yang terdaftar dengan email: <strong>{{ $email }}</strong>.</p>
        
        <p>Silakan klik tombol di bawah ini untuk membuat kata sandi baru:</p>
        <div style="text-align: center;">
            <a href="{{ $resetUrl }}" class="button" target="_blank">Reset Kata Sandi Sekarang</a>
        </div>

        <p style="font-size: 13px; color: #64748b;">Atau salin tautan berikut ke peramban Anda jika tombol tidak dapat diklik:</p>
        <p style="font-size: 12px; word-break: break-all; color: #2563EB;"><a href="{{ $resetUrl }}" style="color: #2563EB;">{{ $resetUrl }}</a></p>

        <p style="font-size: 13px; color: #475569; margin-top: 20px;">Kode Token Verifikasi:</p>
        <div class="token-box">{{ $token }}</div>

        <p style="font-size: 12px; color: #ef4444;">*Tautan dan token verifikasi ini berlaku selama 60 menit. Jika Anda tidak mengajukan permintaan ini, silakan abaikan pesan ini.</p>

        <div class="footer">
            <p>&copy; {{ date('Y') }} ActGiving. Hak cipta dilindungi undang-undang.</p>
        </div>
    </div>
</body>
</html>
