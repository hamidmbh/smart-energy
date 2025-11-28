<?php

namespace App\Http\Controllers;

use App\Models\Programme;
use Illuminate\Http\Request;

class ProgrammeController extends Controller
{
    // 1) Lister tous les programmes
    public function index()
    {
        return Programme::all();
    }

    // 2) Ajouter un programme
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required',
            'description' => 'nullable',
            'niveauEnergie' => 'required|integer',
        ]);

        return Programme::create($validated);
    }

    // 3) Afficher un programme par ID
    public function show($id)
    {
        return Programme::findOrFail($id);
    }

    // 4) Modifier un programme
    public function update(Request $request, $id)
    {
        $programme = Programme::findOrFail($id);

        $programme->update($request->all());

        return $programme;
    }

    // 5) Supprimer un programme
    public function destroy($id)
    {
        return Programme::destroy($id);
    }
}
