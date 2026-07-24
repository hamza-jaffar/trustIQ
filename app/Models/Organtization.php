<?php

namespace App\Models;

use App\Enum\OrganizationStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable('name', 'slug', 'logo', 'email', 'phone', 'website', 'business_type', 'registration_number', 'tax_number', 'trust_score', 'status')]
class Organtization extends Model
{
    use SoftDeletes;
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => OrganizationStatus::class,
        ];
    }
}
