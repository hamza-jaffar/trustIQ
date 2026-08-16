<?php

use App\Enum\InstallmentFrequency;
use App\Enum\InstallmentStatus;
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
        Schema::create('installment_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('item_reference')->nullable();
            $table->decimal('total_price')->nullable();
            $table->decimal('down_payment')->nullable();
            $table->decimal('financed_amount')->nullable();
            $table->decimal('flat_markup')->nullable();
            $table->decimal('total_payable')->nullable();
            $table->enum('frequency',array_column(InstallmentFrequency::cases(), 'value'))->default(InstallmentFrequency::MONTHLY->value);
            $table->enum('status',array_column(InstallmentStatus::cases(), 'value'))->default(InstallmentStatus::PENDING_APPROVAL->value);
            $table->date('start_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('installment_plans');
    }
};
