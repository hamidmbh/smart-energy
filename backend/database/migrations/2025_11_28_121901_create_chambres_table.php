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
    Schema::create('chambres', function (Blueprint $table) {
        $table->id('idChambre');
        $table->integer('numero');
        $table->integer('etage');
        $table->enum('statut', ['occupé', 'libre', 'maintenance']);
        $table->enum('modeActuel', ['Eco', 'Confort', 'Nuit']);
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chambres');
    }
};
