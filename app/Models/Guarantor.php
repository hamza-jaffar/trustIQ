<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable('installment_id', 'customer_id', 'full_name', 'cnic', 'phone', 'address', 'relationship', 'monthly_income')]
class Guarantor extends Model
{
    public function installemt()
    {
        return $this->belongsTo(InstallmentPlans::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

}
