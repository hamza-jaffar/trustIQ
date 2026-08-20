<?php

namespace App\Models;

use App\Enum\InstallmentSchedulesStatus;
use App\Enum\InstallmentStatus;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable('first_name', 'last_name', 'cnic', 'phone', 'email', 'dob', 'gender', 'address', 'city', 'province', 'country', 'occupation', 'monthly_income', 'verification_status', 'email_confirm_at', 'phone_confirm_at')]
class Customer extends Model
{
    use SoftDeletes;

    public function documents()
    {
        return $this->hasMany(CustomerDocuments::class);
    }

    public function isVerified(): bool
    {
        return ! is_null($this->email_confirm_at);
    }

    public function installmentPlans()
    {
        return $this->hasMany(InstallmentPlans::class);
    }

    public function installments()
    {
        return $this->hasMany(InstallmentPlans::class);
    }

    public function activeOrPendingInstallments()
    {
        return $this->hasMany(InstallmentPlans::class)
            ->whereIn('status', ['active', 'pending_approval']);
    }

    public function installmentsNumber()
    {
        // Fetch collections for all individual statuses
        $pending = $this->installments()->where('status', 'pending')->get();
        $active = $this->installments()->where('status', 'active')->get();
        $completed = $this->installments()->where('status', 'completed')->get();
        $rejected = $this->installments()->where('status', 'rejected')->get();
        $cancelled = $this->installments()->where('status', 'cancelled')->get();

        return [
            'pending' => $pending->count(),
            'active' => $active->count(),
            'completed' => $completed->count(),
            'rejected' => $rejected->count(),
            'cancelled' => $cancelled->count(),
            'total' => $pending->count() + $active->count() + $completed->count() + $rejected->count() + $cancelled->count(),
        ];
    }

    public function calculateTotalMonthlyCommitment(): float
    {
        $activePlans = $this->installments()
            ->where('status', 'active')
            ->with([
                // Only load unpaid/partial schedules so we see what's truly still owed
                'installmentSchedules' => function ($q) {
                    $q->whereIn('status', ['pending', 'partial', 'overdue']);
                },
            ])
            ->get();

        return $activePlans->sum(function ($plan) {
            $remainingOnPlan = $plan->installmentSchedules->sum(function ($schedule) {
                return max(0, (float) $schedule->amount_due - (float) $schedule->amount_paid);
            });

            // If schedules haven't been generated yet (plan just activated),
            // fall back to the original installment_amount as a safe estimate.
            if ($plan->installmentSchedules->isEmpty()) {
                $remainingOnPlan = (float) ($plan->installment_amount ?? 0);
            }

            // Normalise the remaining amount to a monthly figure
            // so DTI is always expressed as "per month"
            switch (strtolower($plan->frequency)) {
                case 'weekly':
                    // 4.33 weeks in a month → spread remaining over remaining weeks, then per month
                    return $remainingOnPlan > 0
                        ? ($plan->installment_amount ?? 0) * 4.33
                        : 0;
                case 'bi_weekly':
                    return $remainingOnPlan > 0
                        ? ($plan->installment_amount ?? 0) * 2.16
                        : 0;
                case 'monthly':
                default:
                    // For monthly, the per-month obligation is simply the installment_amount
                    // as long as there are still open schedule rows
                    return $remainingOnPlan > 0
                        ? (float) ($plan->installment_amount ?? 0)
                        : 0;
            }
        });
    }

    public function calculateDtiPercentage(): float
    {
        if (empty($this->monthly_income) || $this->monthly_income <= 0) {
            return 0.00;
        }

        $totalToPay = $this->calculateTotalMonthlyCommitment() ?? 0;

        $percentage = ($totalToPay / $this->monthly_income) * 100;

        return round($percentage, 2);
    }

    public function trustScore(): array
    {
        $plans = $this->installmentPlans()
            ->with([
                'installmentSchedules.installmentPayments',
            ])
            ->get();

        if ($plans->isEmpty()) {
            return [
                'score' => 50,
                'rating' => 'New Customer',
                'color' => 'gray',
                'details' => [
                    'payment_completion' => 0,
                    'on_time_payments' => 0,
                    'overdue_payments' => 0,
                    'history' => 0,
                ],
            ];
        }

        $schedules = $plans->flatMap->installmentSchedules;

        $totalSchedules = $schedules->count();

        if ($totalSchedules === 0) {
            return [
                'score' => 50,
                'rating' => 'New Customer',
                'color' => 'gray',
                'details' => [],
            ];
        }

        $paidSchedules = $schedules
            ->where('status', InstallmentSchedulesStatus::PAID->value)
            ->count();

        $completionRate = ($paidSchedules / $totalSchedules) * 100;

        $completionScore = ($completionRate / 100) * 40;

        $onTimeSchedules = $schedules
            ->filter(function ($schedule) {

                if ($schedule->status !== InstallmentSchedulesStatus::PAID->value) {
                    return false;
                }

                return $schedule->paid_at &&
                    Carbon::parse($schedule->paid_at)->lte(Carbon::parse($schedule->due_date));
            })
            ->count();

        $onTimeRate = $paidSchedules > 0
            ? ($onTimeSchedules / $paidSchedules) * 100
            : 0;

        $onTimeScore = ($onTimeRate / 100) * 30;

        $overdueSchedules = $schedules
            ->filter(function ($schedule) {
                // Explicitly marked overdue by the system — always count it
                if ($schedule->status === InstallmentSchedulesStatus::OVERDUE->value) {
                    return true;
                }

                // Pending or partial but the due date has passed — also overdue
                return in_array($schedule->status, [
                    InstallmentSchedulesStatus::PENDING->value,
                    InstallmentSchedulesStatus::PARTIAL->value,
                ]) && now()->greaterThan(Carbon::parse($schedule->due_date));
            })
            ->count();

        $overdueRate = ($overdueSchedules / $totalSchedules) * 100;

        $overdueScore = max(
            0,
            20 - (($overdueRate / 100) * 20)
        );

        $completedPlans = $plans
            ->where('status', InstallmentStatus::COMPLETED->value)
            ->count();

        $historyScore = min(
            10,
            ($completedPlans / 3) * 10
        );

        $score = round(
            $completionScore +
            $onTimeScore +
            $overdueScore +
            $historyScore
        );

        $score = max(0, min(100, $score));

        if ($score >= 90) {
            $rating = 'Excellent';
            $color = 'green';
        } elseif ($score >= 75) {
            $rating = 'Good';
            $color = 'blue';
        } elseif ($score >= 50) {
            $rating = 'Fair';
            $color = 'yellow';
        } else {
            $rating = 'Poor';
            $color = 'red';
        }

        return [
            'score' => $score,
            'rating' => $rating,
            'color' => $color,

            'details' => [
                'total_schedules' => $totalSchedules,
                'paid_schedules' => $paidSchedules,
                'on_time_schedules' => $onTimeSchedules,
                'overdue_schedules' => $overdueSchedules,
                'completed_plans' => $completedPlans,

                'payment_completion' => round($completionRate, 2),
                'on_time_payments' => round($onTimeRate, 2),

                'scores' => [
                    'completion' => round($completionScore, 2),
                    'on_time' => round($onTimeScore, 2),
                    'overdue' => round($overdueScore, 2),
                    'history' => round($historyScore, 2),
                ],
            ],
        ];
    }
}
