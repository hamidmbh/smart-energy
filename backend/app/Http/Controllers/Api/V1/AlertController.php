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
        $query = Alert::query()->latest();

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return AlertResource::collection($query->get());
    }

    public function acknowledge(Alert $alert): AlertResource
    {
        $alert->update(['status' => 'acknowledged']);

        return new AlertResource($alert);
    }

    public function resolve(Request $request, Alert $alert): AlertResource
    {
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
