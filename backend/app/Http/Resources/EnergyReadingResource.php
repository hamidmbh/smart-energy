<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnergyReadingResource extends JsonResource
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
            'roomId' => $this->room_id ? (string) $this->room_id : null,
            'date' => $this->date?->toDateString(),
            'consumption' => $this->consumption,
            'cost' => $this->cost,
            'period' => $this->period,
        ];
    }
}
