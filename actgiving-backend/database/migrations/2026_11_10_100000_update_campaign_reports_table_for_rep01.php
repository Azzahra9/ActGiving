<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('campaign_reports', function (Blueprint $table) {
            if (!Schema::hasColumn('campaign_reports', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('campaign_id')->constrained('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('campaign_reports', 'reporter_name')) {
                $table->string('reporter_name')->default('')->after('user_id');
            }
            if (!Schema::hasColumn('campaign_reports', 'category')) {
                $table->string('category')->default('fiktif')->after('reporter_email');
            }
            if (!Schema::hasColumn('campaign_reports', 'evidence_path')) {
                $table->string('evidence_path')->nullable()->after('description');
            }
            if (Schema::hasColumn('campaign_reports', 'reason_category')) {
                $table->string('reason_category')->nullable()->change();
            }
        });

        // Sinkronkan data lama jika ada sebelum update status check constraint
        if (Schema::hasColumn('campaign_reports', 'reason_category') && Schema::hasColumn('campaign_reports', 'category')) {
            DB::table('campaign_reports')
                ->where(function ($q) {
                    $q->whereNull('category')->orWhere('category', '');
                })
                ->whereNotNull('reason_category')
                ->update(['category' => DB::raw('reason_category')]);
        }

        DB::table('campaign_reports')->where('status', 'open')->update(['status' => 'pending']);
        DB::table('campaign_reports')->where('status', 'reviewed')->update(['status' => 'investigating']);

        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE campaign_reports DROP CONSTRAINT IF EXISTS campaign_reports_status_check;');
            DB::statement("ALTER TABLE campaign_reports ADD CONSTRAINT campaign_reports_status_check CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed'));");
            DB::statement("ALTER TABLE campaign_reports ALTER COLUMN status SET DEFAULT 'pending';");
        } else {
            Schema::table('campaign_reports', function (Blueprint $table) {
                $table->enum('status', ['pending', 'investigating', 'resolved', 'dismissed'])
                    ->default('pending')
                    ->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('campaign_reports')->where('status', 'pending')->update(['status' => 'open']);
        DB::table('campaign_reports')->where('status', 'investigating')->update(['status' => 'reviewed']);
        DB::table('campaign_reports')->where('status', 'dismissed')->update(['status' => 'resolved']);

        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE campaign_reports DROP CONSTRAINT IF EXISTS campaign_reports_status_check;');
            DB::statement("ALTER TABLE campaign_reports ADD CONSTRAINT campaign_reports_status_check CHECK (status IN ('open', 'reviewed', 'resolved'));");
            DB::statement("ALTER TABLE campaign_reports ALTER COLUMN status SET DEFAULT 'open';");
        } else {
            Schema::table('campaign_reports', function (Blueprint $table) {
                $table->enum('status', ['open', 'reviewed', 'resolved'])
                    ->default('open')
                    ->change();
            });
        }

        Schema::table('campaign_reports', function (Blueprint $table) {
            if (Schema::hasColumn('campaign_reports', 'evidence_path')) {
                $table->dropColumn('evidence_path');
            }
            if (Schema::hasColumn('campaign_reports', 'category')) {
                $table->dropColumn('category');
            }
            if (Schema::hasColumn('campaign_reports', 'reporter_name')) {
                $table->dropColumn('reporter_name');
            }
            if (Schema::hasColumn('campaign_reports', 'user_id')) {
                $table->dropConstrainedForeignId('user_id');
            }
        });
    }
};
