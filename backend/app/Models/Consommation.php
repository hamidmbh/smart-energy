<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consommation extends Model
{
    use HasFactory;

    protected $table = 'consommations';
    protected $primaryKey = 'idConsommation';

    protected $fillable = [
        'dateConsommation', // date exacte
        'periode',          // matin / après-midi / soir
        'niveau',           // niveau de consommation
        'idChambre',        // FK → chambre
    ];
}
