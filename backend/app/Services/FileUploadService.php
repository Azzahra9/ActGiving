<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    /**
     * Disk default yang digunakan untuk berkas publik.
     */
    protected string $disk = 'public';

    /**
     * Unggah berkas ke disk publik dan kembalikan URL yang dapat diakses publik.
     *
     * @param  UploadedFile  $file Berkas yang diunggah
     * @param  string  $directory Sub-direktori penyimpanan (misal: 'lpj_proofs', 'identity_docs')
     * @return array{path: string, url: string}
     */
    public function upload(UploadedFile $file, string $directory = 'uploads'): array
    {
        // Generate nama berkas unik untuk mencegah tabrakan berkas & security risk
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid().'_'.time().'.'.$extension;

        // Simpan ke storage/app/public/{directory}
        $storedPath = $file->storeAs($directory, $filename, $this->disk);

        // Ambil URL publik yang bisa diakses via browser/frontend
        $publicUrl = asset('storage/'.$storedPath);

        return [
            'path' => $storedPath,
            'url' => $publicUrl,
        ];
    }

    /**
     * Hapus berkas dari disk jika berkas lama ingin diganti/dihapus.
     *
     * @param  string|null  $pathOrUrl Path relatif (misal: 'lpj_proofs/file.jpg') atau URL lengkap
     */
    public function delete(?string $pathOrUrl): bool
    {
        if (empty($pathOrUrl)) {
            return false;
        }

        // Jika input adalah URL lengkap, ekstrak relative path setelah 'storage/'
        if (str_contains($pathOrUrl, '/storage/')) {
            $parts = explode('/storage/', $pathOrUrl);
            $path = end($parts);
        } else {
            $path = $pathOrUrl;
        }

        if (Storage::disk($this->disk)->exists($path)) {
            return Storage::disk($this->disk)->delete($path);
        }

        return false;
    }
}
