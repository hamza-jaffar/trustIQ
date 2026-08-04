<?php

namespace App\Http\Middleware;

use App\Models\OrganizationUser;
use Closure;
use Illuminate\Http\Request;

class PermissionMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$permissions): mixed
    {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        $organizationUser = OrganizationUser::query()
            ->where('user_id', $user->id)
            ->first();

        $userPermissions = $organizationUser?->role?->permissions()->pluck('name')->all() ?? [];

        foreach ($permissions as $permission) {
            if (in_array($permission, $userPermissions, true)) {
                return $next($request);
            }
        }

        abort(403);
    }
}
