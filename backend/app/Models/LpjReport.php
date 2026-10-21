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
        'description',
        'proof_image_url',
    ];

    /**
     * Kampanye yang dilaporkan.
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }
}
