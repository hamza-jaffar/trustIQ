<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable('installment_id', 'customer_id', 'full_name', 'cnic', 'phone', 'address', 'relationship', 'monthly_income')]
class Guarantor extends Model
{
    public function installment()
    {
        return $this->belongsTo(InstallmentPlans::class, 'installment_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

}
