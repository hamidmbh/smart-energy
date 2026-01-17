<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\InterventionResource;
use App\Models\Intervention;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InterventionController extends Controller
{
    public function index(Request $request)
    {
        $query = Intervention::query()->orderByDesc('created_at');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return InterventionResource::collection($query->get());
    }

    public function store(Request $request): InterventionResource
    {
        $this->mergeCamelCaseFields($request);
        $data = $this->validateIntervention($request);
        $intervention = Intervention::create($data);

        return new InterventionResource($intervention);
    }

    public function show(Intervention $intervention): InterventionResource
    {
        return new InterventionResource($intervention);
    }

    public function update(Request $request, Intervention $intervention): InterventionResource
    {
        $this->mergeCamelCaseFields($request);
        $data = $this->validateIntervention($request, isUpdate: true);
        $intervention->update($data);

        return new InterventionResource($intervention);
    }

    public function destroy(Intervention $intervention): JsonResponse
    {
        $intervention->delete();

        return response()->json(['success' => true]);
    }

    public function byTechnician(int $technicianId)
    {
        $interventions = Intervention::where('technician_id', $technicianId)->orderByDesc('created_at')->get();

        return InterventionResource::collection($interventions);
    }

    public function complete(Request $request, Intervention $intervention): InterventionResource
    {
        $data = $request->validate([
            'notes' => ['nullable', 'string'],
        ]);

        $intervention->update([
            'status' => 'completed',
            'notes' => $data['notes'] ?? $intervention->notes,
            'completed_at' => now(),
        ]);

        return new InterventionResource($intervention);
    }

    private function validateIntervention(Request $request, bool $isUpdate = false): array
    {
        return $request->validate([
            'type' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'room_id' => [$isUpdate ? 'sometimes' : 'required', 'exists:rooms,id'],
            'technician_id' => [$isUpdate ? 'sometimes' : 'required', 'exists:users,id'],
            'status' => [$isUpdate ? 'sometimes' : 'required', 'in:pending,in_progress,completed,cancelled'],
            'priority' => [$isUpdate ? 'sometimes' : 'required', 'in:low,medium,high,urgent'],
            'notes' => ['nullable', 'string'],
        ]);
    }

    private function mergeCamelCaseFields(Request $request): void
    {
        $mapping = [
            'roomId' => 'room_id',
            'technicianId' => 'technician_id',
        ];

        foreach ($mapping as $camel => $snake) {
            if ($request->has($camel) && ! $request->has($snake)) {
                $request->merge([$snake => $request->input($camel)]);
            }
        }
    }
}
