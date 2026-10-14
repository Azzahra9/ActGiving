<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone_whatsapp',
        'city_domicile',
        'identity_doc_url',
        'is_verified',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_verified' => 'boolean',
        ];
    }

    /**
     * Kampanye yang dibuat oleh user (sebagai Inisiator).
     */
    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class, 'user_id');
    }

    /**
     * Donasi yang dilakukan oleh user terdaftar.
     */
    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class, 'user_id');
    }

    /**
     * Pendaftaran kerelawanan yang dilakukan oleh user (sebagai Relawan).
     */
    public function volunteerRegistrations(): HasMany
    {
        return $this->hasMany(VolunteerRegistration::class, 'user_id');
    }

    /**
     * Pengajuan pencairan dana yang diajukan oleh user (sebagai Inisiator).
     */
    public function disbursements(): HasMany
    {
        return $this->hasMany(Disbursement::class, 'user_id');
    }
}
