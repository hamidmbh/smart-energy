<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('assignedRooms')->orderBy('name')->get();

        return UserResource::collection($users);
    }

    public function store(Request $request): UserResource
    {
        $this->mergeCamelCaseFields($request);
        $data = $this->validateUser($request);
        $data['password'] = Hash::make($data['password']);

        $roomIds = $data['assigned_room_ids'] ?? [];
        unset($data['assigned_room_ids']);

        $user = User::create($data);
        
        if ($user->role === 'technician' && !empty($roomIds)) {
            $user->assignedRooms()->sync($roomIds);
        }

        return new UserResource($user->load('assignedRooms'));
    }

    public function update(Request $request, User $user): UserResource
    {
        $this->mergeCamelCaseFields($request);
        $data = $this->validateUser($request, $user->id, isUpdate: true);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $roomIds = $data['assigned_room_ids'] ?? null;
        unset($data['assigned_room_ids']);

        $user->update($data);

        if ($user->role === 'technician' && $roomIds !== null) {
            $user->assignedRooms()->sync($roomIds);
        }

        return new UserResource($user->load('assignedRooms'));
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json(['success' => true]);
    }

    private function validateUser(Request $request, ?int $userId = null, bool $isUpdate = false): array
    {
        return $request->validate([
            'name' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:255'],
            'email' => [
                $isUpdate ? 'sometimes' : 'required',
                'email',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'password' => [$isUpdate ? 'nullable' : 'required', 'string', 'min:8'],
            'role' => [$isUpdate ? 'sometimes' : 'required', 'in:admin,technician,client'],
            'room_id' => ['nullable', 'exists:rooms,id'],
            'assigned_room_ids' => ['nullable', 'array'],
            'assigned_room_ids.*' => ['exists:rooms,id'],
        ]);
    }

    private function mergeCamelCaseFields(Request $request): void
    {
        if ($request->has('roomId') && ! $request->has('room_id')) {
            $request->merge(['room_id' => $request->input('roomId')]);
        }
        if ($request->has('assignedRoomIds') && ! $request->has('assigned_room_ids')) {
            $request->merge(['assigned_room_ids' => $request->input('assignedRoomIds')]);
        }
    }
}
