<?php

use App\Enum\InstallmentSchedulesStatus;
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
        Schema::create('installment_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('installment_plan_id')->constrained()->cascadeOnDelete();
            $table->integer('installment_number')->nullable();
            $table->date('due_date')->nullable();
            $table->decimal("amount_due")->nullable();
            $table->decimal('amount_paid')->nullable();
            $table->enum('status', array_column(InstallmentSchedulesStatus::cases(), 'value'))->default(InstallmentSchedulesStatus::PENDING->value);
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('installment_schedules');
    }
};
