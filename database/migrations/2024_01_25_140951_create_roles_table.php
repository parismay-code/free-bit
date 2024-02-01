<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->timestamps();
        });

        DB::table('roles')->insert([
            ['name' => 'developer', 'description' => 'Разработчик'],
            ['name' => 'admin', 'description' => 'Администратор'],
            ['name' => 'manager', 'description' => 'Менеджер'],
            ['name' => 'courier', 'description' => 'Курьер'],
            ['name' => 'user', 'description' => 'Пользователь'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
