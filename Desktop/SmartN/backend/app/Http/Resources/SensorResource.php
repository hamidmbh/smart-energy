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
        // Get the latest reading from sensor_readings table if available
        // This ensures readings are pulled from database
        $latestReading = $this->readings()->latest('recorded_at')->first();
        
        // Use latest reading value if available, otherwise use sensor's cached value
        $value = $latestReading ? $latestReading->value : $this->value;
        $lastReadingAt = $latestReading ? $latestReading->recorded_at : $this->last_reading_at;

        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'roomId' => (string) $this->room_id,
            'value' => $value,
            'unit' => $this->unit,
            'status' => $this->status,
            'lastReading' => optional($lastReadingAt)->toIso8601String(),
        ];
    }
}
