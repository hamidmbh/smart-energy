<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Utilisateur extends Model
{
    use HasFactory;

    protected $table = 'utilisateurs'; // nom de la table

    // champs qu'on pourra remplir via create() / update()
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'motDePasse',
        'role', // Admin / Technicien / Client
    ];

    // pour l'instant on laisse simple, on fera les relations plus tard
}
