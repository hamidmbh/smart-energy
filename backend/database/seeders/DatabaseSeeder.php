<?php

namespace Database\Seeders;

use App\Models\Alert;
use App\Models\EnergyReading;
use App\Models\Intervention;
use App\Models\Room;
use App\Models\Sensor;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@hotel.com',
            'role' => 'admin',
        ]);

        $technician = User::factory()->create([
            'name' => 'Tech User',
            'email' => 'tech@hotel.com',
            'role' => 'technician',
        ]);

        $client = User::factory()->create([
            'name' => 'Client User',
            'email' => 'client@hotel.com',
            'role' => 'client',
        ]);

        $room101 = Room::create([
            'number' => '101',
            'floor' => 1,
            'type' => 'standard',
            'status' => 'occupied',
            'current_temperature' => 22.5,
            'target_temperature' => 22,
            'light_status' => true,
            'climatization_status' => true,
            'mode' => 'comfort',
            'client_id' => $client->id,
        ]);

        $client->update(['room_id' => $room101->id]);

        $room102 = Room::create([
            'number' => '102',
            'floor' => 1,
            'type' => 'suite',
            'status' => 'vacant',
            'current_temperature' => 20,
            'target_temperature' => 21,
            'light_status' => false,
            'climatization_status' => false,
            'mode' => 'eco',
        ]);

        $temperatureSensor = Sensor::create([
            'name' => 'Temp 101',
            'type' => 'temperature',
            'room_id' => $room101->id,
            'value' => 22.5,
            'unit' => '°C',
            'status' => 'active',
            'last_reading_at' => now(),
        ]);

        Sensor::create([
            'name' => 'Energy 102',
            'type' => 'energy',
            'room_id' => $room102->id,
            'value' => 6.3,
            'unit' => 'kWh',
            'status' => 'active',
            'last_reading_at' => now(),
        ]);

        Alert::create([
            'type' => 'overconsumption',
            'severity' => 'high',
            'message' => 'Consommation anormale détectée',
            'notes' => null,
            'room_id' => $room101->id,
            'sensor_id' => $temperatureSensor->id,
            'status' => 'pending',
        ]);

        foreach (range(0, 6) as $index) {
            EnergyReading::create([
                'room_id' => $room101->id,
                'date' => now()->subDays($index)->toDateString(),
                'consumption' => 12 + $index,
                'cost' => 2.5 + ($index * 0.2),
                'period' => 'daily',
            ]);
        }

        Intervention::create([
            'type' => 'maintenance',
            'description' => 'Vérifier le système CVC',
            'room_id' => $room101->id,
            'technician_id' => $technician->id,
            'status' => 'in_progress',
            'priority' => 'high',
        ]);
    }
}
