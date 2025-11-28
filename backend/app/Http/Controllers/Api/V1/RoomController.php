<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::with('client')->orderBy('number')->get();

        return RoomResource::collection($rooms);
    }

    public function store(Request $request): RoomResource
    {
        $data = $this->validateRoom($request);
        $room = Room::create($data);

        return new RoomResource($room->load('client'));
    }

    public function show(Room $room): RoomResource
    {
        return new RoomResource($room->load('client'));
    }

    public function update(Request $request, Room $room): RoomResource
    {
        $data = $this->validateRoom($request, $room->id, isUpdate: true);
        $room->update($data);

        return new RoomResource($room->load('client'));
    }

    public function destroy(Room $room): JsonResponse
    {
        $room->delete();

        return response()->json(['success' => true]);
    }

    public function updateMode(Request $request, Room $room): RoomResource
    {
        $validated = $request->validate([
            'mode' => ['required', 'in:eco,comfort,night,maintenance'],
        ]);

        $room->update(['mode' => $validated['mode']]);

        return new RoomResource($room);
    }

    public function controlEquipment(Request $request, Room $room): RoomResource
    {
        $validated = $request->validate([
            'equipment' => ['required', 'in:light,climatization'],
            'state' => ['required', 'boolean'],
        ]);

        $field = $validated['equipment'] === 'light' ? 'light_status' : 'climatization_status';
        $room->update([$field => $validated['state']]);

        return new RoomResource($room);
    }

    private function validateRoom(Request $request, ?int $roomId = null, bool $isUpdate = false): array
    {
        $this->mergeCamelCaseRoomFields($request);

        $rules = [
            'number' => [
                $isUpdate ? 'sometimes' : 'required',
                'string',
                'max:50',
                Rule::unique('rooms', 'number')->ignore($roomId),
            ],
            'floor' => [($isUpdate ? 'sometimes' : 'required'), 'integer', 'min:0'],
            'type' => [($isUpdate ? 'sometimes' : 'required'), 'string', 'max:100'],
            'status' => [($isUpdate ? 'sometimes' : 'required'), 'in:occupied,vacant,maintenance'],
            'current_temperature' => ['sometimes', 'nullable', 'numeric'],
            'target_temperature' => ['sometimes', 'nullable', 'numeric'],
            'light_status' => ['sometimes', 'boolean'],
            'climatization_status' => ['sometimes', 'boolean'],
            'mode' => [($isUpdate ? 'sometimes' : 'required'), 'in:eco,comfort,night,maintenance'],
            'client_id' => ['sometimes', 'nullable', 'exists:users,id'],
        ];

        return $request->validate($rules);
    }

    private function mergeCamelCaseRoomFields(Request $request): void
    {
        $mapping = [
            'currentTemperature' => 'current_temperature',
            'targetTemperature' => 'target_temperature',
            'lightStatus' => 'light_status',
            'climatizationStatus' => 'climatization_status',
            'clientId' => 'client_id',
        ];

        foreach ($mapping as $camel => $snake) {
            if ($request->has($camel) && ! $request->has($snake)) {
                $request->merge([$snake => $request->input($camel)]);
            }
        }
    }
}
