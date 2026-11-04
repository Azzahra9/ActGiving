<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaignSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'event_date',
        'start_time',
        'end_time',
        'title',
        'description_tasks',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date:Y-m-d',
        ];
    }

    /**
     * Kampanye pemilik jadwal ini.
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }
}
