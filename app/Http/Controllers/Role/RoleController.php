<?php

namespace App\Http\Controllers\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Models\OrganizationUser;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizePermission($request, 'roles.view');

        $organization = $request->user()?->organization()->first();
        $organizationId = $organization?->id;

        $query = Role::query()
            ->where('organization_id', $organizationId)
            ->with('permissions')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->input('search');
                $query->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            });

        $roles = $query->orderBy('name')->paginate(10)->withQueryString();
        $roles->getCollection()->transform(function (Role $role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'description' => $role->description,
                'is_system' => $role->name === 'Super Admin',
                'permissions' => $role->permissions->pluck('name')->toArray(),
                'permissions_count' => $role->permissions->count(),
            ];
        });

        return Inertia::render('role-permission/index', [
            'roles' => $roles,
            'filters' => [
                'search' => $request->input('search'),
            ],
            'permissions' => $this->currentPermissions($request),
        ]);
    }

    public function create(Request $request)
    {
        $this->authorizePermission($request, 'roles.create');

        $permissions = Permission::query()->orderBy('name')->get();

        return Inertia::render('role-permission/create', [
            'permissions' => $permissions,
            'permissions_scope' => $this->currentPermissions($request),
        ]);
    }

    public function store(StoreRoleRequest $request)
    {
        $this->authorizePermission($request, 'roles.create');

        $organization = $request->user()?->organization()->first();
        $organizationId = $organization?->id;

        return DB::transaction(function () use ($request, $organizationId) {
            $role = Role::create([
                'organization_id' => $organizationId,
                'name' => $request->input('name'),
                'description' => $request->input('description', ''),
            ]);

            $permissionIds = $request->input('permissions', []);
            $this->syncPermissions($role, $permissionIds);

            return redirect()->route('roles')->with('success', 'Role created successfully.');
        });
    }

    public function edit(Request $request, Role $role)
    {
        $this->authorizePermission($request, 'roles.edit');

        $organization = $request->user()?->organization()->first();

        abort_unless($role->organization_id === $organization?->id, 404);

        $role->load('permissions');

        $permissions = Permission::query()->orderBy('name')->get();

        return Inertia::render('role-permission/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'description' => $role->description,
                'is_system' => $role->name === 'Super Admin',
                'permissions' => $role->permissions->pluck('id')->toArray(),
            ],
            'permissions' => $permissions,
            'permissions_scope' => $this->currentPermissions($request),
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role)
    {
        $this->authorizePermission($request, 'roles.edit');

        $organization = $request->user()?->organization()->first();

        abort_unless($role->organization_id === $organization?->id, 404);

        if ($role->name === 'Super Admin') {
            return redirect()->back()->with('error', 'The Super Admin role cannot be edited.');
        }

        return DB::transaction(function () use ($request, $role) {
            $role->update([
                'name' => $request->input('name'),
                'description' => $request->input('description', ''),
            ]);

            $permissionIds = $request->input('permissions', []);
            $this->syncPermissions($role, $permissionIds);

            return redirect()->route('roles')->with('success', 'Role updated successfully.');
        });
    }

    public function delete(Request $request, Role $role)
    {
        $this->authorizePermission($request, 'roles.delete');

        $organization = $request->user()?->organization()->first();

        abort_unless($role->organization_id === $organization?->id, 404);

        if ($role->name === 'Super Admin') {
            return redirect()->back()->with('error', 'The Super Admin role cannot be deleted.');
        }

        $role->delete();

        return redirect()->route('roles')->with('success', 'Role deleted successfully.');
    }

    private function syncPermissions(Role $role, array $permissionIds): void
    {
        $role->permissions()->sync($permissionIds);
    }

    private function authorizePermission(Request $request, string $permission): void
    {
        abort_unless(in_array($permission, $this->currentPermissions($request), true), 403);
    }

    private function currentPermissions(Request $request): array
    {
        $organizationUser = OrganizationUser::query()
            ->where('user_id', $request->user()?->id)
            ->first();

        return $organizationUser?->role?->permissions()->pluck('name')->all() ?? [];
    }
}
