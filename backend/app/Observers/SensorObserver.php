<?php

namespace App\Observers;

use App\Models\Sensor;

class SensorObserver
{
    /**
     * Handle the Sensor "created" event.
     */
    public function created(Sensor $sensor): void
    {
        $this->updateRoomFromSensor($sensor);
    }

    /**
     * Handle the Sensor "updated" event.
     */
    public function updated(Sensor $sensor): void
    {
        // Mettre à jour la chambre seulement si la valeur a changé
        if ($sensor->wasChanged('value')) {
            $this->updateRoomFromSensor($sensor);
        }
    }

    /**
     * Handle the Sensor "deleted" event.
     */
    public function deleted(Sensor $sensor): void
    {
        //
    }

    /**
     * Handle the Sensor "restored" event.
     */
    public function restored(Sensor $sensor): void
    {
        //
    }

    /**
     * Handle the Sensor "force deleted" event.
     */
    public function forceDeleted(Sensor $sensor): void
    {
        //
    }

    /**
     * Met à jour la chambre associée avec la valeur du capteur
     */
    private function updateRoomFromSensor(Sensor $sensor): void
    {
        if (!$sensor->room_id) {
            return;
        }

        $room = $sensor->room;
        if (!$room) {
            return;
        }

        // Si c'est un capteur de température, mettre à jour current_temperature de la chambre
        if ($sensor->type === 'temperature' && $sensor->value !== null) {
            $room->update([
                'current_temperature' => $sensor->value,
            ]);
        }
    }
}
