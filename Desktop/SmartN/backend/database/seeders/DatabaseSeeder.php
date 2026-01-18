<?php
use App\Models\Alert;
use App\Models\EnergyReading;
use App\Models\Intervention;
use App\Models\Room;
use App\Models\Sensor;
use App\Models\User;
use App\Models\Floor; // 🔹 n'oublie pas d'importer le modèle Floor
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1️⃣ Crée les utilisateurs
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

        // 2️⃣ Crée d'abord les floors
        $floor1 = Floor::create([
            'number' => 1,
            'name' => 'Étage 1',
        ]);

        $floor2 = Floor::create([
            'number' => 2,
            'name' => 'Étage 2',
        ]);

        // 3️⃣ Crée les rooms avec floor_id
        $room101 = Room::create([
            'number' => '101',
            'floor_id' => $floor1->id,
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
            'floor_id' => $floor1->id,
            'type' => 'suite',
            'status' => 'vacant',
            'current_temperature' => 20,
            'target_temperature' => 21,
            'light_status' => false,
            'climatization_status' => false,
            'mode' => 'eco',
        ]);

        // 4️⃣ Capteurs
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

        // 5️⃣ Alertes
        Alert::create([
            'type' => 'overconsumption',
            'severity' => 'high',
            'message' => 'Consommation anormale détectée',
            'notes' => null,
            'room_id' => $room101->id,
            'sensor_id' => $temperatureSensor->id,
            'status' => 'pending',
        ]);

        // 6️⃣ Energy readings
        foreach (range(0, 6) as $index) {
            EnergyReading::create([
                'room_id' => $room101->id,
                'date' => now()->subDays($index)->toDateString(),
                'consumption' => 12 + $index,
                'cost' => 2.5 + ($index * 0.2),
                'period' => 'daily',
            ]);
        }

        // 7️⃣ Interventions
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