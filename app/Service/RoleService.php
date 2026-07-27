<?php

namespace App\Service;

use App\Models\Role;
use App\Models\RolePermission;

class RoleService
{
    public static function createRole(
        string $organizationId,
        string $name,
        string $description
    ): Role {
        return Role::create([
            'organization_id' => $organizationId,
            'name' => $name,
            'description' => $description,
        ]);
    }

    public static function assignPermissions(
        array $permissionIds,
        string $roleId
    ): void {
        $data = collect($permissionIds)
            ->map(fn ($permissionId) => [
                'role_id' => $roleId,
                'permission_id' => $permissionId,
            ])
            ->toArray();

        RolePermission::insert($data);
    }
}
