<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnergyReading extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'date',
        'consumption',
        'cost',
        'period',
    ];

    protected $casts = [
        'date' => 'date',
        'consumption' => 'float',
        'cost' => 'float',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
