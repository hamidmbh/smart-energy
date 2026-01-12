<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Floor extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'name',
        'description',
    ];

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }
}

