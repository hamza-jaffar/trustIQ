<?php

namespace App\Http\Controllers\Organization;

use App\Enum\OrganizationStatus;
use App\Helpers\FileHelper;
use App\Helpers\SlugHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Organization\OrganizationRequest;
use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\Permission;
use App\Service\RoleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('organization/index');
    }

    public function post(OrganizationRequest $request)
    {
        try {

            $user = $request->user();

            $organizationId = $request->input('organization_id') ?? null;
            $existingUserOrg = OrganizationUser::where('user_id', $user->id)->first();
            
            if ($organizationId) {
                if (!$existingUserOrg || $existingUserOrg->organization_id != $organizationId) {
                    throw new \Exception('Unauthorized action.');
                }
            } else {
                if ($existingUserOrg) {
                    throw new \Exception('You already belong to an organization.');
                }
            }

            $logo = null;

            //TODO: If logo already exist first delete the prev logo then store new
            if ($request->hasFile('logo')) {
                $logo = FileHelper::store('organizations', $request->file('logo'));
            }

            $slug = SlugHelper::create(
                Organization::class,
                $request->name
            );

            $organization = Organization::updateOrCreate(['id' => $organizationId],[
                'name' => $request->name,
                'slug' => $slug,
                'email' => $request->email,
                'phone' => $request->phone,
                'logo' => $logo,
                'website' => $request->website,
                'business_type' => $request->business_type,
                'registration_number' => $request->registration_number,
                'tax_number' => $request->tax_number,
                'status' => OrganizationStatus::ACTIVE,
            ]);

            $user = $request->user();

            $organiztionUser = OrganizationUser::where(['user_id' => $user->id, 'organization_id' => $organization->id])->exists();

            if (empty($organiztionUser)) {
                $role = RoleService::createRole(
                    $organization->id,
                    'Super Admin',
                    'Full administrative access to manage the organization and all its resources.'
                );

                RoleService::assignPermissions(
                    Permission::pluck('id')->toArray(),
                    $role->id
                );

                OrganizationUser::create([
                    'user_id' => $user->id,
                    'role_id' => $role->id,
                    'is_owner' => true,
                    'organization_id' => $organization->id,
                ]);
            }

            return redirect()->route('roles')->with('success', '');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
