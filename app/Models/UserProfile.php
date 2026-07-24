<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['avatar', 'cnic', 'address','city', 'province', 'country', 'postal_code'])]
class UserProfile extends Model
{
    use SoftDeletes;
    
}
