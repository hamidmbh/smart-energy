<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\FloorResource;
use App\Models\Floor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FloorController extends Controller
{
    public function index()
    {
        $floors = Floor::withCount('rooms')->orderBy('number')->get();

        return FloorResource::collection($floors);
    }

    public function store(Request $request): FloorResource
    {
        $data = $request->validate([
            'number' => ['required', 'integer', 'min:0', Rule::unique('floors', 'number')],
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $floor = Floor::create($data);

        return new FloorResource($floor->loadCount('rooms'));
    }

    public function show(Floor $floor): FloorResource
    {
        return new FloorResource($floor->load(['rooms', 'rooms.client'])->loadCount('rooms'));
    }

    public function update(Request $request, Floor $floor): FloorResource
    {
        $data = $request->validate([
            'number' => ['sometimes', 'integer', 'min:0', Rule::unique('floors', 'number')->ignore($floor->id)],
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $floor->update($data);

        return new FloorResource($floor->loadCount('rooms'));
    }

    public function destroy(Floor $floor): JsonResponse
    {
        // Check if floor has rooms
        if ($floor->rooms()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete floor with existing rooms',
            ], 422);
        }

        $floor->delete();

        return response()->json(['success' => true]);
    }
}

