<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Disbursement extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'user_id',
        'amount',
        'bank_name',
        'bank_account',
        'account_number',
        'account_name',
        'reason',
        'status',
        'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    /**
     * Accessor: account_number fallback ke bank_account jika belum terisi.
     */
    public function getAccountNumberAttribute($value)
    {
        return $value ?? $this->bank_account;
    }

    /**
     * Mutator: set account_number sekaligus bank_account untuk kompatibilitas.
     */
    public function setAccountNumberAttribute($value)
    {
        $this->attributes['account_number'] = $value;
        if (!isset($this->attributes['bank_account']) || empty($this->attributes['bank_account'])) {
            $this->attributes['bank_account'] = $value;
        }
    }

    /**
     * Kampanye sumber pencairan dana.
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }

    /**
     * Inisiator pemohon pencairan dana.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
