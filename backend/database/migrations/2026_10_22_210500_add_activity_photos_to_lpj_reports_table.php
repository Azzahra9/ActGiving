<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('lpj_reports', function (Blueprint $table) {
            $table->json('activity_photos')->nullable()->after('proof_image_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lpj_reports', function (Blueprint $table) {
            $table->dropColumn('activity_photos');
        });
    }
};
