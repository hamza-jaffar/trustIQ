<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable('installment_schedule_id', 'amount_paid', 'payment_date', 'payment_method', 'transaction_reference', 'notes')]
class InstallmentPayment extends Model
{
    public function installmentSchedule()
    {
        return $this->belongsTo(InstallmentSchedules::class, 'installment_schedule_id');
    }
}
