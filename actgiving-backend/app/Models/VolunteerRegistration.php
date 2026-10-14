<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VolunteerRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'user_id',
        'skills',
        'status',
    ];

    /**
     * Kampanye kerelawanan tujuan pendaftaran.
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }

    /**
     * Relawan terdaftar yang melamar.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
