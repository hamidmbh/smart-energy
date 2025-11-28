<?php

namespace App\Http\Controllers;

use App\Models\Chambre;
use Illuminate\Http\Request;

class ChambreController extends Controller
{
    // 1) Lister toutes les chambres
    public function index()
    {
        return Chambre::all();
    }

    // 2) Ajouter une nouvelle chambre
    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero' => 'required|integer',
            'etage' => 'required|integer',
            'statut' => 'required',
            'modeActuel' => 'required',
        ]);

        return Chambre::create($validated);
    }

    // 3) Afficher une chambre par ID
    public function show($id)
    {
        return Chambre::findOrFail($id);
    }

    // 4) Modifier une chambre
    public function update(Request $request, $id)
    {
        $chambre = Chambre::findOrFail($id);

        $chambre->update($request->all());

        return $chambre;
    }

    // 5) Supprimer une chambre
    public function destroy($id)
    {
        return Chambre::destroy($id);
    }
}
