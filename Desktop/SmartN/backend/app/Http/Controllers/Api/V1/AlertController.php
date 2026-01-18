<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlertResource;
use App\Models\Alert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AlertController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        
        $query = Alert::query()->latest();

        // Si l'utilisateur est un technicien, filtrer par ses étages assignés
        if ($user->role === 'technician') {
            $assignedFloorNumbers = $user->technicianFloors()->pluck('floor')->toArray();
            
            if (empty($assignedFloorNumbers)) {
                // Si le technicien n'a aucun étage assigné, retourner un tableau vide
                return AlertResource::collection(collect([]));
            }
            
            // Filtrer les alertes dont les chambres appartiennent aux étages assignés
            // Récupérer les IDs des étages à partir des numéros
            $floorIds = \App\Models\Floor::whereIn('number', $assignedFloorNumbers)
                ->pluck('id')
                ->toArray();
            
            if (empty($floorIds)) {
                return AlertResource::collection(collect([]));
            }
            
            $query->whereHas('room', function ($q) use ($floorIds) {
                $q->whereIn('floor_id', $floorIds);
            })->with('room');
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return AlertResource::collection($query->get());
    }

    public function acknowledge(Request $request, Alert $alert): AlertResource
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        
        // Vérifier que le technicien peut modifier cette alerte
        if ($user->role === 'technician' && $alert->room_id) {
            $alert->load('room.floor');
            $assignedFloorNumbers = $user->technicianFloors()->pluck('floor')->toArray();
            $alertFloorNumber = $alert->room->floor->number ?? null;
            if (!in_array($alertFloorNumber, $assignedFloorNumbers)) {
                abort(403, 'Vous n\'êtes pas autorisé à modifier cette alerte');
            }
        }

        $alert->update(['status' => 'acknowledged']);

        return new AlertResource($alert);
    }

    public function resolve(Request $request, Alert $alert): AlertResource
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        
        // Vérifier que le technicien peut modifier cette alerte
        if ($user->role === 'technician' && $alert->room_id) {
            $alert->load('room.floor');
            $assignedFloorNumbers = $user->technicianFloors()->pluck('floor')->toArray();
            $alertFloorNumber = $alert->room->floor->number ?? null;
            if (!in_array($alertFloorNumber, $assignedFloorNumbers)) {
                abort(403, 'Vous n\'êtes pas autorisé à modifier cette alerte');
            }
        }

        $data = $request->validate([
            'notes' => ['nullable', 'string'],
        ]);

        $alert->update([
            'status' => 'resolved',
            'resolved_at' => now(),
            'notes' => $data['notes'] ?? $alert->notes,
        ]);

        return new AlertResource($alert);
    }
}
