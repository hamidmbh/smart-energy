<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('sensors_data', function (Blueprint $table) {
        $table->id();
        $table->float('temp_aht');
        $table->float('hum_aht');
        $table->float('temp_bmp');
        $table->float('press_bmp');
        $table->timestamp('received_at');
        $table->timestamps();
    })
    ;
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};