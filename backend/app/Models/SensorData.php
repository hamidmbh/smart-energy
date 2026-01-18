<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SensorData extends Model
{
    use HasFactory;

    protected $table = 'sensors_data';

    protected $fillable = [
        'temp_aht',
        'hum_aht',
        'received_at',
    ];

    protected $casts = [
        'temp_aht' => 'decimal:2',
        'hum_aht' => 'decimal:2',
        'received_at' => 'datetime',
    ];
}