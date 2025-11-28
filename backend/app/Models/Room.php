<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'floor',
        'type',
        'status',
        'current_temperature',
        'target_temperature',
        'light_status',
        'climatization_status',
        'mode',
        'client_id',
    ];

    protected $casts = [
        'current_temperature' => 'float',
        'target_temperature' => 'float',
        'light_status' => 'boolean',
        'climatization_status' => 'boolean',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function sensors()
    {
        return $this->hasMany(Sensor::class);
    }

    public function alerts()
    {
        return $this->hasMany(Alert::class);
    }

    public function interventions()
    {
        return $this->hasMany(Intervention::class);
    }

    public function energyReadings()
    {
        return $this->hasMany(EnergyReading::class);
    }
}
