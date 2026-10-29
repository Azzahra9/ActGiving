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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->string('title');
            $table->text('description');
            $table->decimal('target_amount', 15, 2)->default(0);
            $table->decimal('current_amount', 15, 2)->default(0);
            $table->unsignedInteger('target_volunteers')->default(0);
            $table->unsignedInteger('current_volunteers')->default(0);
            $table->string('location');
            $table->date('activity_date')->nullable();
            $table->enum('status', ['pending', 'active', 'rejected', 'closed', 'suspended'])->default('pending');
            $table->enum('campaign_mode', ['fund_only', 'volunteer_only', 'both']);
            $table->timestamps();

            $table->index('status');
            $table->index('campaign_mode');
            $table->index(['status', 'campaign_mode']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
