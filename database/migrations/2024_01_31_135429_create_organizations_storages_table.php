<?php

use App\Models\Ingredient;
use App\Models\Organization;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('organizations_storages', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Organization::class);
            $table->foreignIdFor(Ingredient::class);
            $table->integer('count');
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('ingredient_id')->references('id')->on('ingredients')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organizations_storages');
    }
};
