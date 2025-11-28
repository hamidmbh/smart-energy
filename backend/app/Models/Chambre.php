<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chambre extends Model
{
    use HasFactory;

    protected $table = 'chambres'; // nom de la table

    protected $primaryKey = 'idChambre';

    // Champs de la chambre (suivant ton diagramme UML)
    protected $fillable = [
        'numero',
        'etage',
        'statut',      // occupé / libre / maintenance
        'modeActuel',  // Eco / Confort / Nuit
    ];
}
