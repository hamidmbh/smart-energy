<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\SensorData;
use App\Models\Sensor;
use App\Observers\SensorDataObserver;
use App\Observers\SensorObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        SensorData::observe(SensorDataObserver::class);
        Sensor::observe(SensorObserver::class);
    }
}
