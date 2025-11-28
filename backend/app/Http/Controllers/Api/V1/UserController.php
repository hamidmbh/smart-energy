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
        $users = User::orderBy('name')->get();

        return UserResource::collection($users);
    }

    public function store(Request $request): UserResource
    {
        $this->mergeCamelCaseFields($request);
        $data = $this->validateUser($request);
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        return new UserResource($user);
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

        $user->update($data);

        return new UserResource($user);
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
        ]);
    }

    private function mergeCamelCaseFields(Request $request): void
    {
        if ($request->has('roomId') && ! $request->has('room_id')) {
            $request->merge(['room_id' => $request->input('roomId')]);
        }
    }
}
