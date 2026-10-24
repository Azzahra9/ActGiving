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
            $table->string('status')->default('pending')->after('campaign_id');
            $table->string('title')->nullable()->after('status');
            $table->decimal('amount_spent', 15, 2)->nullable()->after('description');
            $table->json('budget_items')->nullable()->after('amount_spent');
            $table->integer('beneficiaries_count')->nullable()->after('budget_items');
            $table->integer('volunteers_involved')->nullable()->after('beneficiaries_count');
            $table->string('field_location')->nullable()->after('volunteers_involved');
            $table->timestamp('verified_at')->nullable()->after('field_location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lpj_reports', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'title',
                'amount_spent',
                'budget_items',
                'beneficiaries_count',
                'volunteers_involved',
                'field_location',
                'verified_at',
            ]);
        });
    }
};
