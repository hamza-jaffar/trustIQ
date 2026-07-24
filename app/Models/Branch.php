<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable('organization_id', 'name', 'code', 'phone', 'email', 'address', 'city', 'province', 'latitude', 'longitude')]
class Branch extends Model
{
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
}
