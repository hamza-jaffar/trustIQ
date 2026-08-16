<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable('name', 'description')]
class Permission extends Model
{
    use SoftDeletes;
    
    public function rolePermission()
    {
        return $this->belongsTo(RolePermission::class);
    }
}
