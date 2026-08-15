<?php

namespace App\Http\Controllers\Customer;

use App\Helpers\FileHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Models\Customer;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        return Inertia::render('customer/index');
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

    // public function

    public function profile(string $cnic)
    {
        $customer = Customer::where('cnic', $cnic)->first();

        // dd($customer->isVerified());

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
