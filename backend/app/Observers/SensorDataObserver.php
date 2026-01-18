<?php

namespace App\Observers;

use App\Models\SensorData;
use App\Models\Sensor;

class SensorDataObserver
{
    /**
     * Handle the SensorData "created" event.
     */
    public function created(SensorData $sensorData): void
    {
        // Mettre à jour tous les capteurs de type "temperature" avec temp_aht
        if ($sensorData->temp_aht !== null) {
            $temperatureSensors = Sensor::where('type', 'temperature')->with('room')->get();
            
            foreach ($temperatureSensors as $sensor) {
                // Mettre à jour le capteur
                $sensor->value = $sensorData->temp_aht;
                $sensor->last_reading_at = $sensorData->received_at ?? now();
                $sensor->save();
                
                // Mettre à jour directement la chambre associée (sans passer par l'Observer)
                if ($sensor->room_id && $sensor->room) {
                    $sensor->room->current_temperature = $sensorData->temp_aht;
                    $sensor->room->save();
                }
            }
        }

        // Mettre à jour tous les capteurs de type "humidity" avec hum_aht
        if ($sensorData->hum_aht !== null) {
            Sensor::where('type', 'humidity')
                ->update([
                    'value' => $sensorData->hum_aht,
                    'last_reading_at' => $sensorData->received_at ?? now(),
                ]);
        }
    }

    /**
     * Handle the SensorData "updated" event.
     */
    public function updated(SensorData $sensorData): void
    {
        //
    }

    /**
     * Handle the SensorData "deleted" event.
     */
    public function deleted(SensorData $sensorData): void
    {
        //
    }

    /**
     * Handle the SensorData "restored" event.
     */
    public function restored(SensorData $sensorData): void
    {
        //
    }

    /**
     * Handle the SensorData "force deleted" event.
     */
    public function forceDeleted(SensorData $sensorData): void
    {
        //
    }
}
