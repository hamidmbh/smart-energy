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
    Schema::create('consommations', function (Blueprint $table) {
        $table->id('idConsommation');
        $table->date('dateConsommation');
        $table->string('periode');      // matin / après-midi / soir
        $table->integer('niveau');      // niveau de consommation (valeur numérique)
        $table->unsignedBigInteger('idChambre'); // FK vers chambre
        $table->timestamps();

        // Clé étrangère vers chambres.idChambre
        // (on pourra vraiment l'activer quand la BDD sera prête)
        // $table->foreign('idChambre')->references('idChambre')->on('chambres')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consommations');
    }
};
