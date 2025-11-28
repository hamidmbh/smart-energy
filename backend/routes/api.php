<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UtilisateurController;

Route::apiResource('utilisateurs', UtilisateurController::class);
use App\Http\Controllers\ChambreController;

Route::apiResource('chambres', ChambreController::class);
use App\Http\Controllers\ProgrammeController;

Route::apiResource('programmes', ProgrammeController::class);
use App\Http\Controllers\CapteurController;

Route::apiResource('capteurs', CapteurController::class);
use App\Http\Controllers\ConsommationController;

Route::apiResource('consommations', ConsommationController::class);
