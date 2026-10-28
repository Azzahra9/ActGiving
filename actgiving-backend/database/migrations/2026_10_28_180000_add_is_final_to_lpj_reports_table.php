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
            $table->boolean('is_final')->default(false)->after('status');
            $table->string('report_type')->default('progress')->after('is_final');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lpj_reports', function (Blueprint $table) {
            $table->dropColumn(['is_final', 'report_type']);
        });
    }
};
