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
        Schema::table('disbursements', function (Blueprint $table) {
            if (!Schema::hasColumn('disbursements', 'account_number')) {
                $table->string('account_number')->nullable()->after('bank_name');
            }
            if (!Schema::hasColumn('disbursements', 'account_name')) {
                $table->string('account_name')->nullable()->after('account_number');
            }
            if (!Schema::hasColumn('disbursements', 'reason')) {
                $table->text('reason')->nullable()->after('account_name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('disbursements', function (Blueprint $table) {
            if (Schema::hasColumn('disbursements', 'reason')) {
                $table->dropColumn('reason');
            }
            if (Schema::hasColumn('disbursements', 'account_name')) {
                $table->dropColumn('account_name');
            }
            if (Schema::hasColumn('disbursements', 'account_number')) {
                $table->dropColumn('account_number');
            }
        });
    }
};
