<?php

namespace App\Services;

use App\Models\StoredFile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    /**
     * Disk default yang digunakan untuk berkas publik.
     */
    protected string $disk = 'public';

    /**
     * Daftar domain gambar dummy/stok yang tidak boleh disimpan atau dijadikan fallback.
     */
    protected const DUMMY_IMAGE_HOSTS = [
        'images.unsplash.com',
        'unsplash.com',
        'picsum.photos',
        'via.placeholder.com',
        'placehold.co',
        'placeholder.com',
        'loremflickr.com',
        'dummyimage.com',
    ];

    /**
     * Periksa apakah URL mengarah ke gambar dummy/stok/placeholder.
     */
    public static function isDummyImageUrl(?string $url): bool
    {
        if (empty($url)) {
            return false;
        }

        $normalized = strtolower(trim($url));
        foreach (self::DUMMY_IMAGE_HOSTS as $host) {
            if (str_contains($normalized, $host)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Unggah berkas ke penyimpanan persisten (Supabase Storage / S3 / PostgreSQL stored_files + disk)
     * dan kembalikan URL yang dapat diakses publik.
     *
     * @param  UploadedFile  $file Berkas yang diunggah
     * @param  string  $directory Sub-direktori penyimpanan (misal: 'campaigns', 'lpj_proofs', 'reports')
     * @return array{path: string, url: string}
     */
    public function upload(UploadedFile $file, string $directory = 'uploads'): array
    {
        $extension = $file->getClientOriginalExtension() ?: ($file->guessExtension() ?: 'bin');
        $filename = Str::uuid().'_'.time().'.'.$extension;
        $directory = trim($directory, '/');
        $storedPath = $directory.'/'.$filename;
        $mimeType = $file->getMimeType() ?: 'application/octet-stream';
        $bytes = file_get_contents($file->getRealPath());

        // 1. Prioritaskan Supabase Storage bila kredensial dikonfigurasi dan bukan Storage::fake()
        $supabaseUrl = rtrim((string) config('filesystems.supabase.url'), '/');
        $supabaseKey = (string) config('filesystems.supabase.key');
        $supabaseBucket = (string) config('filesystems.supabase.bucket', 'actgiving-media');

        if ($supabaseUrl !== '' && $supabaseKey !== '' && ! $this->isDiskFaked() && $bytes !== false) {
            try {
                $uploadEndpoint = "{$supabaseUrl}/storage/v1/object/{$supabaseBucket}/{$storedPath}";
                $response = Http::withHeaders([
                    'Authorization' => "Bearer {$supabaseKey}",
                    'apikey' => $supabaseKey,
                    'x-upsert' => 'true',
                ])->withBody($bytes, $mimeType)->post($uploadEndpoint);

                if ($response->successful()) {
                    return [
                        'path' => $storedPath,
                        'url' => "{$supabaseUrl}/storage/v1/object/public/{$supabaseBucket}/{$storedPath}",
                    ];
                }

                Log::warning('Supabase Storage upload failed, falling back to persistent DB storage.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            } catch (\Throwable $e) {
                Log::warning('Supabase Storage upload exception, falling back to persistent DB storage.', [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // 2. Dukungan S3 bila FILESYSTEM_DISK=s3 dikonfigurasi
        if (config('filesystems.default') === 's3' && ! empty(config('filesystems.disks.s3.bucket')) && ! $this->isDiskFaked()) {
            $s3Path = $file->storeAs($directory, $filename, 's3');

            return [
                'path' => $s3Path,
                'url' => Storage::disk('s3')->url($s3Path),
            ];
        }

        // 3. Simpan ke disk 'public' (kompatibel dengan lokal & Storage::fake('public') di PHPUnit)
        $storedPath = $file->storeAs($directory, $filename, $this->disk);

        // 4. Simpan juga ke tabel PostgreSQL 'stored_files' agar file tetap persisten saat container Railway redeploy/restart
        if ($bytes !== false && Schema::hasTable('stored_files')) {
            StoredFile::updateOrCreate(
                ['path' => $storedPath],
                [
                    'mime_type' => $mimeType,
                    'size' => strlen($bytes),
                    'content' => base64_encode($bytes),
                ]
            );
        }

        $baseUrl = rtrim((string) config('app.url', ''), '/');
        $publicUrl = ($baseUrl !== '' ? $baseUrl : '').'/api/media/'.ltrim($storedPath, '/');

        return [
            'path' => $storedPath,
            'url' => $publicUrl,
        ];
    }

    /**
     * Hapus berkas dari penyimpanan (disk, database stored_files, maupun Supabase Storage).
     *
     * @param  string|null  $pathOrUrl Path relatif atau URL lengkap
     */
    public function delete(?string $pathOrUrl): bool
    {
        if (empty($pathOrUrl)) {
            return false;
        }

        $path = $this->extractRelativePath($pathOrUrl);
        $deleted = false;

        if ($path !== '' && Storage::disk($this->disk)->exists($path)) {
            $deleted = Storage::disk($this->disk)->delete($path) || $deleted;
        }

        if ($path !== '' && Schema::hasTable('stored_files')) {
            $deletedRows = StoredFile::where('path', $path)->delete();
            $deleted = $deleted || $deletedRows > 0;
        }

        $supabaseUrl = rtrim((string) config('filesystems.supabase.url'), '/');
        $supabaseKey = (string) config('filesystems.supabase.key');
        $supabaseBucket = (string) config('filesystems.supabase.bucket', 'actgiving-media');

        if ($path !== '' && $supabaseUrl !== '' && $supabaseKey !== '' && ! $this->isDiskFaked()) {
            try {
                Http::withHeaders([
                    'Authorization' => "Bearer {$supabaseKey}",
                    'apikey' => $supabaseKey,
                ])->delete("{$supabaseUrl}/storage/v1/object/{$supabaseBucket}/{$path}");
            } catch (\Throwable $e) {
                Log::warning('Supabase Storage delete exception', ['error' => $e->getMessage()]);
            }
        }

        return $deleted;
    }

    protected function extractRelativePath(string $pathOrUrl): string
    {
        if (str_contains($pathOrUrl, '/api/media/')) {
            $parts = explode('/api/media/', $pathOrUrl);

            return ltrim((string) end($parts), '/');
        }

        if (str_contains($pathOrUrl, '/storage/v1/object/public/')) {
            $parts = explode('/storage/v1/object/public/', $pathOrUrl);
            $afterBucket = ltrim((string) end($parts), '/');
            $segments = explode('/', $afterBucket, 2);

            return $segments[1] ?? $afterBucket;
        }

        if (str_contains($pathOrUrl, '/storage/')) {
            $parts = explode('/storage/', $pathOrUrl);

            return ltrim((string) end($parts), '/');
        }

        return ltrim($pathOrUrl, '/');
    }

    protected function isDiskFaked(): bool
    {
        try {
            $root = Storage::disk($this->disk)->path('');

            return str_contains($root, 'framework'.DIRECTORY_SEPARATOR.'testing');
        } catch (\Throwable) {
            return false;
        }
    }
}
