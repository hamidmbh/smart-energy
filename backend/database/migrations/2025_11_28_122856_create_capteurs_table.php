public function up()
{
    Schema::create('capteurs', function (Blueprint $table) {
        $table->id('idCapteur');
        $table->string('type');        // température, humidité, etc.
        $table->string('valeur');      // valeur actuelle
        $table->string('categorie');   // CapteurActif / CapteurPassif
        $table->string('etat');        // actif / inactif
        $table->timestamps();
    });
}
