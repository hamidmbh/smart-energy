<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TechnicianFloor extends Model
{
    use HasFactory;

    protected $table = 'technician_floor';

    protected $fillable = [
        'technician_id',
        'floor',
    ];

    public function technician()
    {
        return $this->belongsTo(User::class, 'technician_id');
    }
}

