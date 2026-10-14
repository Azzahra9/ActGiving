<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_name',
    ];

    /**
     * Kampanye yang tergabung dalam kategori ini.
     */
    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class, 'category_id');
    }
}
