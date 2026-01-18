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
        Schema::create('sensors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['temperature', 'humidity', 'light', 'motion', 'energy']);
            $table->foreignId('room_id')->constrained('rooms')->cascadeOnDelete();
            $table->decimal('value', 8, 2)->default(0);
            $table->string('unit')->default('°C');
            $table->enum('status', ['active', 'inactive', 'error'])->default('active');
            $table->timestamp('last_reading_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sensors');
    }
};
