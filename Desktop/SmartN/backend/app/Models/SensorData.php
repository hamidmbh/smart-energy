<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Sensor; // Import l-Model Sensor hna

class SensorData extends Model
{
    use HasFactory;

    protected $table = 'sensors_data';

    protected $fillable = [
        'temp_aht',
        'hum_aht',
        'temp_bmp',
        'press_bmp',
        'received_at',
    ];

    protected $dates = ['received_at'];

    

}