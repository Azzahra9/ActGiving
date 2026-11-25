<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StoredFile;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class MediaController extends Controller
{
    /**
     * Sajikan file media yang diunggah dari disk lokal atau fallback tabel stored_files (PostgreSQL).
     */
    public function show(string $path): BinaryFileResponse|Response
    {
        $cleanPath = ltrim(str_replace('\\', '/', $path), '/');

        if ($cleanPath === '' || str_contains($cleanPath, '..')) {
            abort(404);
        }

        if (Storage::disk('public')->exists($cleanPath)) {
            return response()->file(Storage::disk('public')->path($cleanPath), [
                'Cache-Control' => 'public, max-age=31536000',
            ]);
        }

        if (Schema::hasTable('stored_files')) {
            $storedFile = StoredFile::where('path', $cleanPath)->first();
            if ($storedFile) {
                $binary = base64_decode($storedFile->content, true);
                if ($binary !== false) {
                    return response($binary, 200, [
                        'Content-Type' => $storedFile->mime_type ?: 'application/octet-stream',
                        'Content-Length' => (string) strlen($binary),
                        'Cache-Control' => 'public, max-age=31536000',
                    ]);
                }
            }
        }

        abort(404);
    }
}
