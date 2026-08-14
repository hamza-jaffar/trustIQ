<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable('customer_id', 'type', 'path')]
class CustomerDocuments extends Model
{
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
