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
        Schema::create('campaign_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('campaigns')->cascadeOnDelete();
            $table->date('event_date');
            $table->string('start_time', 20)->nullable();
            $table->string('end_time', 20)->nullable();
            $table->string('title');
            $table->text('description_tasks')->nullable();
            $table->timestamps();

            $table->index('campaign_id');
            $table->index(['campaign_id', 'event_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaign_schedules');
    }
};
