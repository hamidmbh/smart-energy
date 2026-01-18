<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InterventionResource extends JsonResource
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
            'description' => $this->description,
            'roomId' => (string) $this->room_id,
            'technicianId' => (string) $this->technician_id,
            'status' => $this->status,
            'priority' => $this->priority,
            'createdAt' => $this->created_at?->toIso8601String(),
            'completedAt' => $this->completed_at?->toIso8601String(),
            'notes' => $this->notes,
        ];
    }
}
