<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, create floors from existing room floors
        DB::statement("
            INSERT INTO floors (number, name, created_at, updated_at)
            SELECT DISTINCT floor, CONCAT('Étage ', floor), NOW(), NOW()
            FROM rooms
            WHERE NOT EXISTS (
                SELECT 1 FROM floors WHERE floors.number = rooms.floor
            )
        ");

        Schema::table('rooms', function (Blueprint $table) {
            $table->foreignId('floor_id')->nullable()->after('number')->constrained('floors')->onDelete('restrict');
        });

        // Update rooms to set floor_id based on floor number
        DB::statement("
            UPDATE rooms
            SET floor_id = (SELECT id FROM floors WHERE floors.number = rooms.floor LIMIT 1)
        ");

        Schema::table('rooms', function (Blueprint $table) {
            $table->foreignId('floor_id')->nullable(false)->change();
            $table->dropColumn('floor');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->unsignedInteger('floor')->default(1)->after('number');
        });

        // Restore floor number from floor_id
        DB::statement("
            UPDATE rooms
            SET floor = (SELECT number FROM floors WHERE floors.id = rooms.floor_id LIMIT 1)
        ");

        Schema::table('rooms', function (Blueprint $table) {
            $table->dropForeign(['floor_id']);
            $table->dropColumn('floor_id');
        });
    }
};

