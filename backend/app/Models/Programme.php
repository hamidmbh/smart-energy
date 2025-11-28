<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Programme extends Model
{
    use HasFactory;

    protected $table = 'programmes';
    protected $primaryKey = 'idProgramme';

    protected $fillable = [
        'nom',
        'description',
        'niveauEnergie', // suivant ton diagramme UML
    ];
}
