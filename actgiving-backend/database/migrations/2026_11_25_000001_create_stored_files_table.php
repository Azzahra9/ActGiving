<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel penyimpanan berkas persisten di PostgreSQL (fallback aman bila Supabase Storage / S3 tidak dikonfigurasi).
     */
    public function up(): void
    {
        Schema::create('stored_files', function (Blueprint $table) {
            $table->id();
            $table->string('path', 500)->unique();
            $table->string('mime_type', 150)->default('application/octet-stream');
            $table->unsignedBigInteger('size')->default(0);
            $table->longText('content');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stored_files');
    }
};
