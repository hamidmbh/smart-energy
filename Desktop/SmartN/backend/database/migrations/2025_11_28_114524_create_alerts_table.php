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
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['overconsumption', 'anomaly', 'maintenance', 'critical']);
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('low');
            $table->string('message');
            $table->text('notes')->nullable();
            $table->foreignId('room_id')->nullable()->constrained('rooms')->nullOnDelete();
            $table->foreignId('sensor_id')->nullable()->constrained('sensors')->nullOnDelete();
            $table->enum('status', ['pending', 'acknowledged', 'resolved'])->default('pending');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
