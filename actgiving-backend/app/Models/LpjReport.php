<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LpjReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'status',
        'is_final',
        'report_type',
        'title',
        'description',
        'amount_spent',
        'budget_items',
        'beneficiaries_count',
        'volunteers_involved',
        'field_location',
        'proof_image_url',
        'activity_photos',
        'verified_at',
    ];

    protected $casts = [
        'is_final' => 'boolean',
        'activity_photos' => 'array',
        'budget_items' => 'array',
        'amount_spent' => 'decimal:2',
        'beneficiaries_count' => 'integer',
        'volunteers_involved' => 'integer',
        'verified_at' => 'datetime',
    ];

    protected $appends = [
        'total_realisasi',
        'realized_amount',
    ];

    /**
     * Accessor untuk total_realisasi agar konsisten dengan payload frontend
     */
    public function getTotalRealisasiAttribute(): float
    {
        return (float) ($this->amount_spent ?? 0);
    }

    /**
     * Accessor untuk realized_amount
     */
    public function getRealizedAmountAttribute(): float
    {
        return (float) ($this->amount_spent ?? 0);
    }

    /**
     * Kampanye yang dilaporkan.
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }
}
