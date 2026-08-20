<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable('installment_plan_id', 'installment_number', 'due_date', 'amount_due', 'amount_paid', 'status', 'paid_at')]
class InstallmentSchedules extends Model
{
    public function installmentPlan()
    {
        return $this->belongsTo(InstallmentPlans::class);
    }

    public function installmentPayments()
    {
        return $this->hasMany(InstallmentPayment::class, 'installment_schedule_id');
    }
}
