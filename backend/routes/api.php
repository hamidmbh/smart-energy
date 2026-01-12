<?php

use App\Http\Controllers\Api\V1\AlertController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\EnergyController;
use App\Http\Controllers\Api\V1\FloorController;
use App\Http\Controllers\Api\V1\InterventionController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\RoomController;
use App\Http\Controllers\Api\V1\SensorController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'currentUser']);

        Route::apiResource('rooms', RoomController::class);
        Route::patch('rooms/{room}/mode', [RoomController::class, 'updateMode']);
        Route::patch('rooms/{room}/equipment', [RoomController::class, 'controlEquipment']);

        Route::apiResource('sensors', SensorController::class);
        Route::get('sensors/room/{room}', [SensorController::class, 'byRoom']);
        Route::get('sensors/{sensor}/readings', [SensorController::class, 'readings']);

        Route::get('alerts', [AlertController::class, 'index']);
        Route::patch('alerts/{alert}/acknowledge', [AlertController::class, 'acknowledge']);
        Route::patch('alerts/{alert}/resolve', [AlertController::class, 'resolve']);

        Route::get('energy/consumption', [EnergyController::class, 'consumption']);
        Route::get('energy/statistics', [EnergyController::class, 'statistics']);

        Route::apiResource('interventions', InterventionController::class);
        Route::get('interventions/technician/{technicianId}', [InterventionController::class, 'byTechnician']);
        Route::patch('interventions/{intervention}/complete', [InterventionController::class, 'complete']);

        Route::apiResource('users', UserController::class)->except(['show']);

        Route::apiResource('floors', FloorController::class);

        Route::post('reports/generate', [ReportController::class, 'generate']);
    });
});

