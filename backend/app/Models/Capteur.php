<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Capteur extends Model
{
    use HasFactory;

    protected $table = 'capteurs';
    protected $primaryKey = 'idCapteur';

    protected $fillable = [
        'type',          // température / humidité / mouvement / luminosité
        'valeur',        // valeur actuelle
        'categorie',     // CapteurActif or CapteurPassif
        'etat',          // actif / inactif
    ];
}
