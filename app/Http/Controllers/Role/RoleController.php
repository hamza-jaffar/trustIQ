<?php

namespace App\Http\Controllers\Role;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        return Inertia::render('role-permission/index');
    }

    public function create()
    {
        $permissions = Permission::all();

        return Inertia::render('role-permission/create', [
            'permissions' => $permissions,
        ]);
    }
}
