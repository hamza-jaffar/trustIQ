<?php

namespace App\Http\Controllers\Installments;

use App\Http\Controllers\Controller;
use App\Http\Requests\Installment\CreateInstallmentRequest;
use App\Models\Customer;
use App\Models\InstallmentPlans;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InstallmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $installments = InstallmentPlans::where('organization_id', auth()->user()->organization()->value('organizations.id'))->orWhere('created_by_user_id', auth()->user()->id)->get();

        return Inertia::render('installments/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $customerId = $request->query('customer_id');

        $customers = Customer::query()
            ->select([
                'id',
                'first_name',
                'last_name',
                'phone',
                'email',
                'cnic',
            ])
            ->get();

        return Inertia::render('installments/create/index', [
            'customer_id' => $customerId,
            'customers' => $customers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateInstallmentRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {

            $totalPrice = (float) $validated['total_price'];
            $downPayment = (float) $validated['down_payment'];

            // Amount remaining after down payment
            $financedAmount = $totalPrice - $downPayment;

            // Example: 20% flat markup
            $markupRate = 20;

            $flatMarkup = $financedAmount * ($markupRate / 100);

            // Total amount customer will pay through installments
            $totalPayable = $financedAmount + $flatMarkup;

            $installment = InstallmentPlans::create([
                'created_by_user_id' => auth()->user()->id ?? null,
                'organization_id' => auth()->user()->organization()->value('organizations.id') ?? null,
                'customer_id' => $validated['customer_id'],
                'item_reference' => $validated['item_reference'],
                'total_price' => $totalPrice,
                'down_payment' => $downPayment,
                'financed_amount' => $financedAmount,
                'flat_markup' => $flatMarkup,
                'total_payable' => $totalPayable,
                'frequency' => $validated['frequency'],
                'start_date' => $validated['start_date'],
            ]);

            foreach ($validated['guarantors'] as $guarantor) {
                $installment->guarantors()->create([
                    'customer_id' => $guarantor['customer_id'] ?? null,
                    'full_name' => $guarantor['full_name'] ?? null,
                    'cnic' => $guarantor['cnic'] ?? null,
                    'phone' => $guarantor['phone'] ?? null,
                    'address' => $guarantor['address'] ?? null,
                    'relationship' => $guarantor['relationship'] ?? null,
                    'monthly_income' => $guarantor['monthly_income'] ?? null,
                ]);
            }
        });

        return redirect()
            ->route('installments.index')
            ->with('success', 'Installment created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
