<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\SensorData;
use App\Observers\SensorDataObserver;

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
    }
}
