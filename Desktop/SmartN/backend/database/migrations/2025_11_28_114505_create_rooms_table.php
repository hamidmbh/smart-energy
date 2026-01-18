<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('number');
            $table->unsignedInteger('floor')->default(1);
            $table->string('type')->default('standard');
            $table->enum('status', ['occupied', 'vacant', 'maintenance'])->default('vacant');
            $table->decimal('current_temperature', 5, 2)->nullable();
            $table->decimal('target_temperature', 5, 2)->nullable();
            $table->boolean('light_status')->default(false);
            $table->boolean('climatization_status')->default(false);
            $table->enum('mode', ['eco', 'comfort', 'night', 'maintenance'])->default('eco');
            $table->foreignId('client_id')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
