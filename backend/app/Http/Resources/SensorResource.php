<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SensorResource extends JsonResource
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
            'name' => $this->name,
            'type' => $this->type,
            'roomId' => (string) $this->room_id,
            'value' => $this->value,
            'unit' => $this->unit,
            'status' => $this->status,
            'lastReading' => optional($this->last_reading_at)->toIso8601String(),
        ];
    }
}
