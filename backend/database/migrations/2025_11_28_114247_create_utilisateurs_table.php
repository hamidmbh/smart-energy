public function up()
{
    Schema::create('utilisateurs', function (Blueprint $table) {
        $table->id('idUtilisateur');
        $table->string('nom');
        $table->string('prenom');
        $table->string('email')->unique();
        $table->string('motDePasse');
        $table->enum('role', ['Admin', 'Technicien', 'Client']);
        $table->timestamps();
    });
}
