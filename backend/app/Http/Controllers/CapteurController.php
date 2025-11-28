<?php

namespace App\Http\Controllers;

use App\Models\Capteur;
use Illuminate\Http\Request;

class CapteurController extends Controller
{
    // 1) Lister tous les capteurs
    public function index()
    {
        return Capteur::all();
    }

    // 2) Ajouter un capteur
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required',
            'valeur' => 'required',
            'categorie' => 'required',
            'etat' => 'required',
        ]);

        return Capteur::create($validated);
    }

    // 3) Afficher un capteur par ID
    public function show($id)
    {
        return Capteur::findOrFail($id);
    }

    // 4) Modifier un capteur
    public function update(Request $request, $id)
    {
        $capteur = Capteur::findOrFail($id);

        $capteur->update($request->all());

        return $capteur;
    }

    // 5) Supprimer un capteur
    public function destroy($id)
    {
        return Capteur::destroy($id);
    }
}
