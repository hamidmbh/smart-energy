<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlertResource extends JsonResource
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
            'type' => $this->type,
            'severity' => $this->severity,
            'message' => $this->message,
            'notes' => $this->notes,
            'roomId' => $this->room_id ? (string) $this->room_id : null,
            'sensorId' => $this->sensor_id ? (string) $this->sensor_id : null,
            'status' => $this->status,
            'createdAt' => $this->created_at?->toIso8601String(),
            'resolvedAt' => $this->resolved_at?->toIso8601String(),
        ];
    }
}
