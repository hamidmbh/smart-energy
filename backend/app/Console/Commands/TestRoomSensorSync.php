<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Sensor;
use App\Models\SensorData;
use App\Models\Room;

class TestRoomSensorSync extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:room-sensor-sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test if rooms are synchronized with sensor values';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🧪 Testing Room-Sensor synchronization...');
        $this->newLine();

        // Trouver un capteur de température avec une chambre
        $temperatureSensor = Sensor::where('type', 'temperature')
            ->whereNotNull('room_id')
            ->with('room')
            ->first();

        if (!$temperatureSensor) {
            $this->warn('⚠️  No temperature sensor with a room found.');
            $this->info('   Please create a temperature sensor assigned to a room first.');
            return 1;
        }

        $room = $temperatureSensor->room;
        $this->info("📊 Testing with:");
        $this->line("   Sensor: {$temperatureSensor->name} (ID: {$temperatureSensor->id})");
        $this->line("   Room: {$room->number} (ID: {$room->id})");
        $this->newLine();

        // Afficher les valeurs initiales
        $this->info('📊 Initial values:');
        $this->line("   Sensor value: {$temperatureSensor->value} {$temperatureSensor->unit}");
        $this->line("   Room current_temperature: " . ($room->current_temperature ?? 'null'));
        $this->newLine();

        // Créer un SensorData avec une nouvelle température
        $newTemp = 28.7;
        $this->info("🔄 Creating SensorData with temp_aht={$newTemp}...");
        
        SensorData::create([
            'temp_aht' => $newTemp,
            'hum_aht' => 65.0,
            'received_at' => now(),
        ]);

        $this->info('✅ SensorData created!');
        $this->newLine();

        // Attendre un peu
        sleep(1);

        // Rafraîchir les données
        $temperatureSensor->refresh();
        $room->refresh();

        // Vérifier les valeurs
        $this->info('📊 Updated values:');
        $sensorUpdated = abs($temperatureSensor->value - $newTemp) < 0.01;
        $roomUpdated = abs($room->current_temperature - $newTemp) < 0.01;
        
        $sensorStatus = $sensorUpdated ? '✅' : '❌';
        $roomStatus = $roomUpdated ? '✅' : '❌';
        
        $this->line("   {$sensorStatus} Sensor value: {$temperatureSensor->value} {$temperatureSensor->unit} (expected: {$newTemp})");
        $this->line("   {$roomStatus} Room current_temperature: " . ($room->current_temperature ?? 'null') . " (expected: {$newTemp})");
        $this->newLine();

        if ($sensorUpdated && $roomUpdated) {
            $this->info('✅ Test PASSED! Sensor and Room are synchronized.');
            return 0;
        } else {
            $this->error('❌ Test FAILED! Values are not synchronized.');
            if (!$sensorUpdated) {
                $this->warn('   Sensor was not updated correctly.');
            }
            if (!$roomUpdated) {
                $this->warn('   Room was not updated correctly.');
            }
            return 1;
        }
    }
}
