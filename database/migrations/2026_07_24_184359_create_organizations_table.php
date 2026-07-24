<?php

use App\Enum\OrganizationStatus;
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
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo')->nullable();
            $table->string('email')->unique();
            $table->string('phone')->unique();
            $table->string('website')->nullable();
            $table->string('business_type')->nullable();
            $table->string('registration_number')->nullable();
            $table->string('tax_number')->nullable();
            $table->decimal('trust_score',5,2)->nullable();
            $table->enum('status', array_column(OrganizationStatus::cases(), 'value'))->default(OrganizationStatus::ACTIVE->value);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organtizations');
    }
};
