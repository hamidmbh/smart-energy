<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SensorResource;
use App\Models\Room;
use App\Models\Sensor;
use App\Models\SensorReading;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SensorController extends Controller
{
    public function index()
    {
        $sensors = Sensor::with('room')->orderBy('name')->get();

        return SensorResource::collection($sensors);
    }

    public function store(Request $request): SensorResource
    {
        $this->mergeCamelCaseFields($request);
        $data = $this->validateSensor($request);
        $sensor = Sensor::create($data);

        if (isset($data['value'])) {
            $this->storeReading($sensor, $data['value']);
        }

        return new SensorResource($sensor);
    }

    public function show(Sensor $sensor): SensorResource
    {
        return new SensorResource($sensor);
    }

    public function update(Request $request, Sensor $sensor): SensorResource
    {
        $this->mergeCamelCaseFields($request);
        $data = $this->validateSensor($request, isUpdate: true);
        $sensor->update($data);

        if (isset($data['value'])) {
            $this->storeReading($sensor, $data['value']);
        }

        return new SensorResource($sensor);
    }

    public function destroy(Sensor $sensor): JsonResponse
    {
        $sensor->delete();

        return response()->json(['success' => true]);
    }

    public function byRoom(Room $room)
    {
        $sensors = $room->sensors()->orderBy('name')->get();

        return SensorResource::collection($sensors);
    }

    public function readings(Request $request, Sensor $sensor)
    {
        $limit = (int) $request->query('limit', 50);

        $readings = $sensor->readings()
            ->orderByDesc('recorded_at')
            ->limit($limit)
            ->get()
            ->map(fn (SensorReading $reading) => [
                'id' => (string) $reading->id,
                'value' => $reading->value,
                'recordedAt' => $reading->recorded_at?->toIso8601String(),
            ]);

        return response()->json(['data' => $readings]);
    }

    private function validateSensor(Request $request, bool $isUpdate = false): array
    {
        return $request->validate([
            'name' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:100'],
            'type' => [$isUpdate ? 'sometimes' : 'required', 'in:temperature,humidity,light,motion,energy'],
            'room_id' => ['nullable', 'exists:rooms,id'],
            'value' => ['nullable', 'numeric'],
            'unit' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:10'],
            'status' => [$isUpdate ? 'sometimes' : 'required', 'in:active,inactive,error'],
        ]);
    }

    private function storeReading(Sensor $sensor, float $value): void
    {
        $sensor->update(['last_reading_at' => now(), 'value' => $value]);

        $sensor->readings()->create([
            'value' => $value,
            'recorded_at' => now(),
        ]);
    }

    private function mergeCamelCaseFields(Request $request): void
    {
        if ($request->has('roomId') && ! $request->has('room_id')) {
            $request->merge(['room_id' => $request->input('roomId')]);
        }
    }
}
