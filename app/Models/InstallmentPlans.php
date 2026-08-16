<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable('organization_id', 'customer_id', 'created_by_user_id', 'item_reference', 'total_price', 'down_payment', 'financed_amount', 'flat_markup', 'total_payable', 'frequency', 'status', 'start_date')]
class InstallmentPlans extends Model
{
    use SoftDeletes;

    public function installmentSchedules()
    {
        return $this->hasMany(InstallmentSchedules::class);
    }

    public function guarantors()
    {
        return $this->hasMany(Guarantor::class, 'installment_id');
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

}
