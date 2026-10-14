<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaignReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'reporter_email',
        'reason_category',
        'description',
        'status',
    ];

    /**
     * Kampanye yang diadukan/dilaporkan.
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }
}
