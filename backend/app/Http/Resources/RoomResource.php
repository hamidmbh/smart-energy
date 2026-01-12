<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
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
            'floorId' => $this->floor_id ? (string) $this->floor_id : null,
            'floor' => $this->whenLoaded('floor', function () {
                return [
                    'id' => (string) $this->floor->id,
                    'number' => $this->floor->number,
                    'name' => $this->floor->name,
                ];
            }, null),
            'type' => $this->type,
            'status' => $this->status,
            'currentTemperature' => $this->current_temperature,
            'targetTemperature' => $this->target_temperature,
            'lightStatus' => (bool) $this->light_status,
            'climatizationStatus' => (bool) $this->climatization_status,
            'mode' => $this->mode,
            'clientId' => $this->client_id ? (string) $this->client_id : null,
            'client' => UserResource::make($this->whenLoaded('client')),
            'technicians' => UserResource::collection($this->whenLoaded('technicians')),
        ];
    }
}
