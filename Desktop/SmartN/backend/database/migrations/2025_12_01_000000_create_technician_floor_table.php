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
        Schema::create('technician_floor', function (Blueprint $table) {
            $table->id();
            $table->foreignId('technician_id')->constrained('users')->onDelete('cascade');
            $table->unsignedInteger('floor');
            $table->timestamps();

            $table->unique(['technician_id', 'floor']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('technician_floor');
    }
};

