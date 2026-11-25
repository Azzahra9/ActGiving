<?php

use App\Models\Campaign;
use App\Models\LpjReport;
use App\Models\StoredFile;
use App\Services\FileUploadService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

return new class extends Migration
{
    /**
     * Bersihkan URL gambar dummy/stok atau path lokal ephemeral yang sudah hilang (404)
     * di tabel campaigns dan lpj_reports pada database PostgreSQL produksi.
     */
    public function up(): void
    {
        if (app()->environment('testing')) {
            return;
        }

        if (Schema::hasTable('campaigns')) {
            Campaign::query()->whereNotNull('image_url')->chunkById(100, function ($campaigns) {
                foreach ($campaigns as $campaign) {
                    if ($this->shouldClearImageUrl($campaign->image_url)) {
                        $campaign->image_url = null;
                        $campaign->save();
                    }
                }
            });
        }

        if (Schema::hasTable('lpj_reports')) {
            LpjReport::query()->chunkById(100, function ($reports) {
                foreach ($reports as $report) {
                    $dirty = false;

                    if (! empty($report->proof_image_url) && $this->shouldClearImageUrl($report->proof_image_url)) {
                        $report->proof_image_url = '';
                        $dirty = true;
                    }

                    $photos = $report->activity_photos;
                    if (is_string($photos)) {
                        $decoded = json_decode($photos, true);
                        $photos = is_array($decoded) ? $decoded : [$photos];
                    }

                    if (is_array($photos)) {
                        $cleanedPhotos = array_values(array_filter($photos, function ($url) {
                            return is_string($url) && trim($url) !== '' && ! $this->shouldClearImageUrl($url);
                        }));

                        if ($cleanedPhotos !== $photos) {
                            $report->activity_photos = $cleanedPhotos;
                            $dirty = true;
                        }
                    }

                    if ($dirty) {
                        $report->save();
                    }
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Pembersihan data dummy/404 tidak perlu dikembalikan
    }

    private function shouldClearImageUrl(?string $url): bool
    {
        if (empty($url) || trim($url) === '') {
            return true;
        }

        if (FileUploadService::isDummyImageUrl($url)) {
            return true;
        }

        // Hapus URL localhost/dev yang tersimpan di database produksi
        if (preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i', $url)) {
            return true;
        }

        // Jika menunjuk ke /storage/... lama (container disk ephemeral) dan berkas fisiknya tidak ada
        // serta tidak tersimpan di tabel stored_files, bersihkan agar tidak 404
        if (str_contains($url, '/storage/') && ! str_contains($url, '/storage/v1/object/')) {
            $parts = explode('/storage/', $url);
            $relativePath = ltrim((string) end($parts), '/');

            $existsOnDisk = $relativePath !== '' && Storage::disk('public')->exists($relativePath);
            $existsInDb = $relativePath !== '' && Schema::hasTable('stored_files')
                && StoredFile::where('path', $relativePath)->exists();

            if (! $existsOnDisk && ! $existsInDb) {
                return true;
            }
        }

        return false;
    }
};
