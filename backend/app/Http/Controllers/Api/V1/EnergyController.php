<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\EnergyReadingResource;
use App\Models\EnergyReading;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnergyController extends Controller
{
    public function consumption(Request $request)
    {
        $this->mergeRoomId($request);
        $validated = $request->validate([
            'period' => ['required', 'in:hourly,daily,weekly,monthly'],
            'room_id' => ['nullable', 'exists:rooms,id'],
        ]);

        $roomId = $request->query('roomId', $validated['room_id'] ?? null);

        $query = EnergyReading::where('period', $validated['period'])->orderByDesc('date');

        if ($roomId) {
            $query->where('room_id', $roomId);
        }

        $readings = $query->take(100)->get();

        return EnergyReadingResource::collection($readings);
    }

    public function statistics(Request $request): JsonResponse
    {
        $this->mergeRoomId($request);
        $validated = $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'room_id' => ['nullable', 'exists:rooms,id'],
        ]);

        $roomId = $request->query('roomId', $validated['room_id'] ?? null);

        $query = EnergyReading::whereBetween('date', [$validated['start_date'], $validated['end_date']]);

        if ($roomId) {
            $query->where('room_id', $roomId);
        }

        $readings = $query->get();

        return response()->json([
            'totalConsumption' => $readings->sum('consumption'),
            'totalCost' => $readings->sum('cost'),
            'records' => $readings->count(),
            'period' => [
                'start' => $validated['start_date'],
                'end' => $validated['end_date'],
            ],
        ]);
    }

    private function mergeRoomId(Request $request): void
    {
        if ($request->has('roomId') && ! $request->has('room_id')) {
            $request->merge(['room_id' => $request->query('roomId')]);
        }
    }
}
