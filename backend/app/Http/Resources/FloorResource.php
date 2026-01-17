<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FloorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'number' => $this->number,
            'name' => $this->name,
            'description' => $this->description,
            'rooms' => RoomResource::collection($this->whenLoaded('rooms')),
            'roomsCount' => $this->when(isset($this->rooms_count), $this->rooms_count),
        ];
    }
}

