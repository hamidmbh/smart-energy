<?php

namespace App\Http\Controllers;

use App\Models\Consommation;
use Illuminate\Http\Request;

class ConsommationController extends Controller
{
    // 1) Lister toutes les consommations
    public function index()
    {
        return Consommation::all();
    }

    // 2) Ajouter une consommation
    public function store(Request $request)
    {
        $validated = $request->validate([
            'dateConsommation' => 'required|date',
            'periode' => 'required',
            'niveau' => 'required|integer',
            'idChambre' => 'required|integer',
        ]);

        return Consommation::create($validated);
    }

    // 3) Afficher une consommation par ID
    public function show($id)
    {
        return Consommation::findOrFail($id);
    }

    // 4) Modifier une consommation
    public function update(Request $request, $id)
    {
        $conso = Consommation::findOrFail($id);

        $conso->update($request->all());

        return $conso;
    }

    // 5) Supprimer une consommation
    public function destroy($id)
    {
        return Consommation::destroy($id);
    }
}
