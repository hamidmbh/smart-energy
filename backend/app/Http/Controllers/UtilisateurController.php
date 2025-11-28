<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;

class UtilisateurController extends Controller
{
    // 1) LISTE DES UTILISATEURS
    public function index()
    {
        return Utilisateur::all();
    }

    // 2) AJOUTER UN UTILISATEUR
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required',
            'prenom' => 'required',
            'email' => 'required|email|unique:utilisateurs',
            'motDePasse' => 'required',
            'role' => 'required',
        ]);

        // hachage du mot de passe
        $validated['motDePasse'] = bcrypt($validated['motDePasse']);

        return Utilisateur::create($validated);
    }

    // 3) VOIR UN UTILISATEUR PAR ID
    public function show($id)
    {
        return Utilisateur::findOrFail($id);
    }

    // 4) MODIFIER UN UTILISATEUR
    public function update(Request $request, $id)
    {
        $user = Utilisateur::findOrFail($id);

        $user->update($request->all());

        return $user;
    }

    // 5) SUPPRIMER UN UTILISATEUR
    public function destroy($id)
    {
        return Utilisateur::destroy($id);
    }
}
