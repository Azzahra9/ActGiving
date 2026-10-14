<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'user_id',
        'amount',
        'donor_name',
        'donor_email',
        'is_anonymous',
        'payment_channel',
        'reference_code',
        'status',
        'is_approved_by_initiator',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'is_anonymous' => 'boolean',
            'is_approved_by_initiator' => 'boolean',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Kampanye tujuan donasi.
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }

    /**
     * User terdaftar yang berdonasi (nullable jika donatur tamu).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
