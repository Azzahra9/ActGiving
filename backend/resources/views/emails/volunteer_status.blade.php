<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Status Pendaftaran Relawan - ActGiving</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f7f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 25px; }
        .header h1 { color: #0284c7; margin: 0; font-size: 26px; }
        .badge-accepted { display: inline-block; padding: 6px 14px; background-color: #10b981; color: white; border-radius: 9999px; font-size: 14px; font-weight: bold; }
        .badge-rejected { display: inline-block; padding: 6px 14px; background-color: #ef4444; color: white; border-radius: 9999px; font-size: 14px; font-weight: bold; }
        .details-box { background: #f8fafc; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0; }
        .footer { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ActGiving</h1>
            <p>Pemberitahuan Seleksi Relawan</p>
            @if($status === 'accepted')
                <span class="badge-accepted">SELAMAT! ANDA DITERIMA</span>
            @else
                <span class="badge-rejected">MOHON MAAF, BELUM LOLOS</span>
            @endif
        </div>

        <p>Halo <strong>{{ $volunteer->name ?? 'Relawan' }}</strong>,</p>

        @if($status === 'accepted')
            <p>Selamat! Lamaran Anda sebagai relawan untuk kegiatan berikut telah <strong>diterima</strong> oleh inisiator kegiatan:</p>
        @else
            <p>Terima kasih atas antusiasme Anda mendaftar. Namun mohon maaf, untuk kegiatan berikut kuota relawan telah terpenuhi atau belum sesuai dengan kriteria yang dibutuhkan saat ini:</p>
        @endif

        <div class="details-box">
            <p><strong>Nama Kegiatan:</strong> {{ $campaign->title ?? 'Kegiatan Kerelawanan' }}</p>
            <p><strong>Lokasi:</strong> {{ $campaign->location ?? '-' }}</p>
            @if(!empty($campaign->activity_date))
                <p><strong>Tanggal Pelaksanaan:</strong> {{ \Carbon\Carbon::parse($campaign->activity_date)->format('d M Y') }}</p>
            @endif
        </div>

        @if($status === 'accepted')
            <p>Inisiator kegiatan akan segera menghubungi Anda melalui nomor WhatsApp yang terdaftar untuk koordinasi teknis lebih lanjut.</p>
        @else
            <p>Jangan patah semangat! Masih banyak aksi kemanusiaan dan kepedulian lainnya di ActGiving yang menanti uluran tangan Anda.</p>
        @endif

        <div class="footer">
            <p>&copy; {{ date('Y') }} ActGiving Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
