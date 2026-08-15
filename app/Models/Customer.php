<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable('first_name', 'last_name', 'cnic', 'phone', 'email', 'dob', 'gender', 'address', 'city', 'province', 'country', 'occupation', 'monthly_income', 'verification_status', 'email_confirm_at', 'phone_confirm_at')]
class Customer extends Model
{
    public function documents()
    {
        return $this->hasMany(CustomerDocuments::class);
    }

    public function isVerified(): bool
    {
        return !is_null($this->email_confirm_at);
    }
}
