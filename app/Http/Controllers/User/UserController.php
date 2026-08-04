<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\OrganizationUser;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizePermission($request, 'users.view');

        $organizationId = $request->user()?->organization()?->first()?->id;

        $query = User::query()
            ->whereHas('organizationUser', function ($query) use ($organizationId) {
                $query->where('organization_id', $organizationId);
            })
            ->with('organizationUser.role')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->input('search');
                $query->where(function ($sub) use ($search) {
                    $sub->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhereHas('organizationUser.role', function ($roleQuery) use ($search) {
                            $roleQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('description', 'like', "%{$search}%" );
                        });
                });
            });

        $users = $query->orderBy('first_name')->paginate(10)->withQueryString();
        $users->getCollection()->transform(function (User $user) {
            return [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'status' => $user->status?->value ?? $user->status,
                'role' => $user->organizationUser?->role?->name ?? 'No role',
                'role_id' => $user->organizationUser?->role_id,
                'is_current_user' => $user->id === auth()->id(),
            ];
        });

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                'search' => $request->input('search'),
            ],
            'permissions' => $this->currentPermissions($request),
        ]);
    }

    public function create(Request $request)
    {
        $this->authorizePermission($request, 'users.create');

        $organizationId = $request->user()?->organization()?->first()?->id;
        $roles = Role::query()
            ->where('organization_id', $organizationId)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('users/create', [
            'roles' => $roles,
            'permissions' => $this->currentPermissions($request),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $this->authorizePermission($request, 'users.create');

        $organizationId = $request->user()?->organization()?->first()?->id;
        $role = Role::query()->where('organization_id', $organizationId)->find($request->input('role_id'));

        abort_unless($role instanceof Role, 404);

        return DB::transaction(function () use ($request, $organizationId, $role) {
            $user = User::create([
                'first_name' => $request->input('first_name'),
                'last_name' => $request->input('last_name'),
                'email' => $request->input('email'),
                'password' => $request->input('password'),
                'status' => $request->input('status', 'active'),
            ]);

            OrganizationUser::create([
                'user_id' => $user->id,
                'organization_id' => $organizationId,
                'role_id' => $role->id,
                'is_owner' => false,
            ]);

            return redirect()->route('users')->with('success', 'User created successfully.');
        });
    }

    public function edit(Request $request, User $user)
    {
        $this->authorizePermission($request, 'users.edit');

        $organizationId = $request->user()?->organization()?->first()?->id;
        abort_unless($this->belongsToOrganization($user, $organizationId), 404);

        $roles = Role::query()
            ->where('organization_id', $organizationId)
            ->orderBy('name')
            ->get(['id', 'name']);

        $organizationUser = $user->organizationUser()->first();

        return Inertia::render('users/edit', [
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'status' => $user->status?->value ?? $user->status,
                'role_id' => $organizationUser?->role_id,
                'is_current_user' => $user->id === $request->user()?->id,
            ],
            'roles' => $roles,
            'permissions' => $this->currentPermissions($request),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $this->authorizePermission($request, 'users.edit');

        $organizationId = $request->user()?->organization()?->first()?->id;
        abort_unless($this->belongsToOrganization($user, $organizationId), 404);

        $role = Role::query()->where('organization_id', $organizationId)->find($request->input('role_id'));
        abort_unless($role !== null && ! $role->wasRecentlyCreated, 404);

        return DB::transaction(function () use ($request, $user, $role) {
            $data = [
                'first_name' => $request->input('first_name'),
                'last_name' => $request->input('last_name'),
                'email' => $request->input('email'),
                'status' => $request->input('status', 'active'),
            ];

            if ($request->filled('password')) {
                $data['password'] = $request->input('password');
            }

            $user->update($data);

            $user->organizationUser()->update([
                'role_id' => $role->id,
            ]);

            return redirect()->route('users')->with('success', 'User updated successfully.');
        });
    }

    public function delete(Request $request, User $user)
    {
        $this->authorizePermission($request, 'users.delete');

        $organizationId = $request->user()?->organization()?->first()?->id;
        abort_unless($this->belongsToOrganization($user, $organizationId), 404);

        $user->organizationUser()->delete();
        $user->delete();

        return redirect()->route('users')->with('success', 'User deleted successfully.');
    }

    private function authorizePermission(Request $request, string $permission): void
    {
        $permissions = $this->currentPermissions($request);

        abort_unless(in_array($permission, $permissions, true), 403);
    }

    private function currentPermissions(Request $request): array
    {
        $organizationUser = OrganizationUser::query()
            ->where('user_id', $request->user()?->id)
            ->first();

        $role = $organizationUser?->role;

        return $role?->permissions()->pluck('name')->all() ?? [];
    }

    private function belongsToOrganization(User $user, ?int $organizationId): bool
    {
        if (! $organizationId) {
            return false;
        }

        return OrganizationUser::query()
            ->where('user_id', $user->id)
            ->where('organization_id', $organizationId)
            ->exists();
    }
}
