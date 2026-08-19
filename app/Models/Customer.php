<?php

namespace App\Models;

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

    public function amountToBePaid()
    {
        // $amout = $this->installments()->where('status', 'active')
    }
}
