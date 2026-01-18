<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;
use App\Models\SensorData;
use Exception;

class ListenToMqtt extends Command
{
    protected $signature = 'mqtt:listen';
    protected $description = 'Récupère les données du capteur via MQTT toutes les 20 secondes et les enregistre en DB';

    public function handle()
    {
        $server   = '109.123.243.44';   // IP de ton broker MQTT
        $port     = 1883;                // Port MQTT
        $clientId = 'laravel_listener';  // Identifiant unique

        // Paramètres de connexion
        $connectionSettings = (new ConnectionSettings)
            ->setUsername('chaari')        // Remplace par ton user MQTT
            ->setPassword('chaari2023')    // Remplace par ton mot de passe MQTT
            ->setKeepAliveInterval(60)
            ->setLastWillTopic('esp32/status')
            ->setLastWillMessage('Laravel listener disconnected')
            ->setLastWillQualityOfService(1);

        $this->info("Démarrage du listener MQTT (toutes les 20 secondes)...");

        while (true) {
            try {
                $mqtt = new MqttClient($server, $port, $clientId);
                $mqtt->connect($connectionSettings, true);
                $this->info("Connecté au broker MQTT !");

                // Subscribe au topic "esp32/sensor" (retain = true)
                $mqtt->subscribe('esp32/sensor', function ($topic, $message) {
                    $data = json_decode($message, true);

                    if ($data && isset($data['temp_aht'], $data['hum_aht'], $data['temp_bmp'], $data['press_bmp'])) {
                        SensorData::create([
                            'temp_aht' => $data['temp_aht'],
                            'hum_aht'  => $data['hum_aht'],
                            'received_at' => now(),
                        ]);
                        $this->info("Dernière valeur sauvegardée : $message");
                    } else {
                        $this->warn("Message invalide reçu : $message");
                    }
                }, 0);

        
$mqtt->loop(true, 2000);

$mqtt->disconnect();

$this->info("Pause 20 secondes avant la prochaine récupération...");
sleep(20);

            } catch (Exception $e) {
                $this->error("Erreur MQTT : " . $e->getMessage());
                $this->info("Nouvelle tentative dans 5 secondes...");
                sleep(5);
            }
        }
    }
}