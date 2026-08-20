<?php

namespace App\Services;

use App\Enum\InstallmentFrequency;
use App\Enum\InstallmentSchedulesStatus;
use App\Enum\InstallmentStatus;
use App\Models\InstallmentPayment;
use App\Models\InstallmentPlans;
use App\Models\InstallmentSchedules;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class InstallmentScheduleService
{
    /**
     * Generate installment schedules for a given plan.
     *
     * @return void
     */
    public function generateSchedules(InstallmentPlans $plan)
    {
        DB::transaction(function () use ($plan) {
            // Delete existing pending schedules if any
            $plan->installmentSchedules()->where('status', InstallmentSchedulesStatus::PENDING->value)->delete();

            $totalAmount = $plan->total_payable;
            // if financed_amount is set, we use that, otherwise use total_payable - down_payment
            $financedAmount = $plan->financed_amount ?? ($totalAmount - ($plan->down_payment ?? 0));
            $installmentAmount = $plan->installment_amount;

            if (! $installmentAmount || $installmentAmount <= 0) {
                // If not set, we cannot calculate by amount, fallback or throw error
                throw new \Exception('Installment amount is missing or invalid.');
            }

            $numberOfInstallments = ceil($financedAmount / $installmentAmount);

            $startDate = Carbon::parse($plan->start_date ?? now());
            $frequency = InstallmentFrequency::tryFrom($plan->frequency) ?? InstallmentFrequency::MONTHLY;

            $remainingBalance = $financedAmount;

            for ($i = 1; $i <= $numberOfInstallments; $i++) {
                $dueDate = clone $startDate;

                if ($i > 1) {
                    // Assuming InstallmentFrequency cases
                    if ($frequency->value === 'weekly') {
                        $dueDate->addWeeks($i - 1);
                    } elseif ($frequency->value === 'bi_weekly') {
                        $dueDate->addWeeks(($i - 1) * 2);
                    } else {
                        // default to monthly
                        $dueDate->addMonths($i - 1);
                    }
                }

                $amountDue = ($remainingBalance > $installmentAmount) ? $installmentAmount : $remainingBalance;

                InstallmentSchedules::create([
                    'installment_plan_id' => $plan->id,
                    'installment_number' => $i,
                    'due_date' => $dueDate->format('Y-m-d'),
                    'amount_due' => $amountDue,
                    'amount_paid' => 0,
                    'status' => InstallmentSchedulesStatus::PENDING->value,
                ]);

                $remainingBalance -= $amountDue;
            }
        });
    }

    /**
     * Record a payment for an installment schedule.
     *
     * @return InstallmentPayment
     */
    public function recordPayment(InstallmentSchedules $schedule, array $paymentData)
{
    return DB::transaction(function () use ($schedule, $paymentData) {
        $payment = InstallmentPayment::create([
            'installment_schedule_id' => $schedule->id,
            'amount_paid' => $paymentData['amount_paid'],
            'payment_date' => $paymentData['payment_date'],
            'payment_method' => $paymentData['payment_method'] ?? null,
            'transaction_reference' => $paymentData['transaction_reference'] ?? null,
            'notes' => $paymentData['notes'] ?? null,
        ]);

        // Calculate total paid for this schedule
        $totalPaid = $schedule->installmentPayments()
            ->sum('amount_paid');

        $status = InstallmentSchedulesStatus::PARTIAL->value;
        $paidAt = $schedule->paid_at;

        // Mark schedule as paid if fully paid
        if ($totalPaid >= $schedule->amount_due) {
            $status = InstallmentSchedulesStatus::PAID->value;
            $paidAt = $paidAt ?? now();
        }

        $schedule->update([
            'amount_paid' => $totalPaid,
            'status' => $status,
            'paid_at' => $paidAt,
        ]);

        // Check if any pending or partial schedules remain
        $hasRemainingPayments = $schedule->installmentPlan
            ->installmentSchedules()
            ->whereIn('status', [
                InstallmentSchedulesStatus::PENDING->value,
                InstallmentSchedulesStatus::PARTIAL->value,
            ])
            ->exists();

        if (! $hasRemainingPayments) {
            $schedule->installmentPlan->update([
                'status' => InstallmentStatus::COMPLETED->value,
            ]);
        }

        return $payment;
    });
}
}
