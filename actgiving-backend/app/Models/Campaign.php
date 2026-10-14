<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'target_amount',
        'current_amount',
        'target_volunteers',
        'current_volunteers',
        'location',
        'activity_date',
        'status',
        'campaign_mode',
    ];

    protected function casts(): array
    {
        return [
            'target_amount' => 'decimal:2',
            'current_amount' => 'decimal:2',
            'target_volunteers' => 'integer',
            'current_volunteers' => 'integer',
            'activity_date' => 'date',
        ];
    }

    /**
     * Inisiator pembuat kampanye.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Kategori kampanye.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Daftar donasi untuk kampanye ini.
     */
    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class, 'campaign_id');
    }

    /**
     * Daftar pendaftaran relawan untuk kampanye ini.
     */
    public function volunteerRegistrations(): HasMany
    {
        return $this->hasMany(VolunteerRegistration::class, 'campaign_id');
    }

    /**
     * Laporan Pertanggungjawaban (LPJ) untuk kampanye ini.
     */
    public function lpjReports(): HasMany
    {
        return $this->hasMany(LpjReport::class, 'campaign_id');
    }

    /**
     * Riwayat pencairan dana (disbursements) kampanye ini.
     */
    public function disbursements(): HasMany
    {
        return $this->hasMany(Disbursement::class, 'campaign_id');
    }

    /**
     * Laporan aduan kampanye fiktif/penipuan dari publik.
     */
    public function reports(): HasMany
    {
        return $this->hasMany(CampaignReport::class, 'campaign_id');
    }
}
