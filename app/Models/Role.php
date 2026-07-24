<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable('organization_id', 'name', 'description')]
class Role extends Model
{
    use SoftDeletes;

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function rolePermission()
    {
        return $this->belongsTo(RolePermission::class);
    }

    public function permissions()
    {
        return $this->rolePermission()->permission();
    }
}
