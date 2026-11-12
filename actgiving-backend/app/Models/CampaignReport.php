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
        'user_id',
        'reporter_name',
        'reporter_email',
        'category',
        'reason_category',
        'description',
        'evidence_path',
        'status',
    ];

    protected $attributes = [
        'status' => 'pending',
    ];

    protected $appends = [
        'evidence_url',
    ];

    /**
     * URL publik untuk file bukti aduan (jika ada).
     */
    public function getEvidenceUrlAttribute(): ?string
    {
        if (empty($this->evidence_path)) {
            return null;
        }

        return asset('storage/' . ltrim($this->evidence_path, '/'));
    }

    /**
     * Kampanye yang diadukan/dilaporkan.
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }

    /**
     * Pelapor terdaftar (opsional jika pelapor login).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
