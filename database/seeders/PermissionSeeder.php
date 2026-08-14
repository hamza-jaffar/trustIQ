<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // 'dashboard.view' => 'View dashboard',

            // 'users.view' => 'View users',
            // 'users.create' => 'Create users',
            // 'users.edit' => 'Edit users',
            // 'users.delete' => 'Delete users',

            // 'roles.view' => 'View roles',
            // 'roles.create' => 'Create roles',
            // 'roles.edit' => 'Edit roles',
            // 'roles.delete' => 'Delete roles',

            // 'permissions.view' => 'View permissions',

            // 'organization.view' => 'View organization settings',
            // 'organization.update' => 'Update organization settings',
            
            'customer.view' => 'View customers of organization',
            'customer.create' => 'Add customer in organization'
        ];

        foreach ($permissions as $name => $description) {
            Permission::firstOrCreate(
                ['name' => $name],
                ['description' => $description]
            );
        }
    }
}
