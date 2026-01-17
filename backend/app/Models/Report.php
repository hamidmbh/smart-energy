<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'parameters',
        'status',
        'file_path',
        'generated_by',
    ];

    protected $casts = [
        'parameters' => 'array',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
