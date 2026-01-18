<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'room_id',
        'value',
        'unit',
        'status',
        'last_reading_at',
    ];

    protected $casts = [
        'value' => 'float',
        'last_reading_at' => 'datetime',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function readings()
    {
        return $this->hasMany(SensorReading::class);
    }
}