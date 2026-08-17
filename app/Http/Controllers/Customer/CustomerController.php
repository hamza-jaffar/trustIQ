<?php

namespace App\Http\Controllers\Customer;

use App\Helpers\FileHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $organizationId = auth()
            ->user()
            ->organization()
            ->value('organizations.id');

        $search = $request->string('search')->trim()->toString();

        $verificationStatus = $request->string('verification_status')->toString();
        $gender = $request->string('gender')->toString();
        $city = $request->string('city')->trim()->toString();
        $province = $request->string('province')->trim()->toString();

        $minIncome = $request->input('min_income');
        $maxIncome = $request->input('max_income');

        $emailVerified = $request->input('email_verified');
        $phoneVerified = $request->input('phone_verified');

        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');
        $perPage = min((int) $request->input('per_page', 15), 100);

        $allowedSorts = [
            'first_name',
            'last_name',
            'created_at',
            'monthly_income',
            'verification_status',
            'city',
        ];

        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'created_at';
        }

        if (! in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'desc';
        }

        $customers = Customer::query()
            ->whereHas('installments', function ($query) use ($organizationId) {
                $query->where('organization_id', $organizationId);
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhereRaw(
                            "CONCAT(first_name, ' ', last_name) LIKE ?",
                            ["%{$search}%"]
                        )
                        ->orWhere('cnic', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%")
                        ->orWhere('province', 'like', "%{$search}%")
                        ->orWhere('occupation', 'like', "%{$search}%");
                });
            })
            ->when($verificationStatus, function ($query) use ($verificationStatus) {
                $query->where('verification_status', $verificationStatus);
            })
            ->when($gender, function ($query) use ($gender) {
                $query->where('gender', $gender);
            })
            ->when($city, function ($query) use ($city) {
                $query->where('city', 'like', "%{$city}%");
            })
            ->when($province, function ($query) use ($province) {
                $query->where('province', 'like', "%{$province}%");
            })
            ->when($minIncome !== null && $minIncome !== '', function ($query) use ($minIncome) {
                $query->whereRaw(
                    'CAST(monthly_income AS DECIMAL(15,2)) >= ?',
                    [(float) $minIncome]
                );
            })
            ->when($maxIncome !== null && $maxIncome !== '', function ($query) use ($maxIncome) {
                $query->whereRaw(
                    'CAST(monthly_income AS DECIMAL(15,2)) <= ?',
                    [(float) $maxIncome]
                );
            })
            ->when($emailVerified !== null && $emailVerified !== '', function ($query) use ($emailVerified) {
                if ($emailVerified === 'verified') {
                    $query->whereNotNull('email_confirm_at');
                }

                if ($emailVerified === 'unverified') {
                    $query->whereNull('email_confirm_at');
                }
            })
            ->when($phoneVerified !== null && $phoneVerified !== '', function ($query) use ($phoneVerified) {
                if ($phoneVerified === 'verified') {
                    $query->whereNotNull('phone_confirm_at');
                }

                if ($phoneVerified === 'unverified') {
                    $query->whereNull('phone_confirm_at');
                }
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        $cities = Customer::query()
            ->whereHas('installments', function ($query) use ($organizationId) {
                $query->where('organization_id', $organizationId);
            })
            ->whereNotNull('city')
            ->distinct()
            ->orderBy('city')
            ->pluck('city');

        $provinces = Customer::query()
            ->whereHas('installments', function ($query) use ($organizationId) {
                $query->where('organization_id', $organizationId);
            })
            ->whereNotNull('province')
            ->distinct()
            ->orderBy('province')
            ->pluck('province');

        return Inertia::render('customer/index', [
            'customers' => $customers,

            'filters' => [
                'search' => $search,
                'verification_status' => $verificationStatus,
                'gender' => $gender,
                'city' => $city,
                'province' => $province,
                'min_income' => $minIncome,
                'max_income' => $maxIncome,
                'email_verified' => $emailVerified,
                'phone_verified' => $phoneVerified,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],

            'filterOptions' => [
                'cities' => $cities,
                'provinces' => $provinces,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('customer/create');
    }

    public function store(StoreCustomerRequest $request)
    {
        $validated = $request->validated();

        if (isset($validated['date_of_birth'])) {
            $validated['dob'] = $validated['date_of_birth'];
            unset($validated['date_of_birth']);
        }

        $validated['country'] = 'Pakistan';

        $customer = Customer::create($validated);

        if ($request->hasFile('id_front')) {
            $path = FileHelper::store('customers/documents', $request->file('id_front'));
            $customer->documents()->create([
                'type' => 'id_front',
                'path' => $path,
            ]);
        }

        if ($request->hasFile('id_back')) {
            $path = FileHelper::store('customers/documents', $request->file('id_front'));
            $customer->documents()->create([
                'type' => 'id_back',
                'path' => $path,
            ]);
        }

        return redirect()->route('customers.index')->with('success', 'Customer created successfully.');
    }

    public function searchByCnic(string $cnic)
    {
        $cnic = trim($cnic);

        if (empty($cnic)) {
            return response()->json(['message' => 'Please Enter CNIC', 'status' => false], 400);
        }

        $customer = Customer::where('cnic', $cnic)->first();

        if ($customer) {
            return response()->json(['customer' => $customer, 'status' => true], 200);
        }

        return response()->json(['message' => 'Customer not found', 'status' => false], 404);
    }

    public function profile(string $cnic)
    {
        $customer = Customer::where('cnic', $cnic)->with([
            'activeOrPendingInstallments' => function ($query) {
                $query
                    ->latest()
                    ->limit(3);
            },
        ])->first();

        return Inertia::render('customer/profile/index', ['customer' => $customer]);
    }

    public function update(UpdateCustomerRequest $request, string $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validated();

        if (
            array_key_exists('email', $validated) &&
            $validated['email'] !== $customer->email
        ) {
            $validated['email_confirm_at'] = null;
        }

        if (
            array_key_exists('phone', $validated) &&
            $validated['phone'] !== $customer->phone
        ) {
            $validated['phone_confirm_at'] = null;
        }

        $customer->update($validated);

        return back()->with('success', 'Customer updated successfully.');
    }
}
