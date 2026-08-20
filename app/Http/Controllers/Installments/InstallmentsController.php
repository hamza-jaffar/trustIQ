<?php

namespace App\Http\Controllers\Installments;

use App\Enum\InstallmentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Installment\CreateInstallmentRequest;
use App\Http\Requests\Installment\UpdateInstallmentRequest;
use App\Models\Customer;
use App\Models\InstallmentPlans;
use App\Models\User;
use App\Services\InstallmentScheduleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class InstallmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        $organizationId = $user
            ->organization()
            ->value('organizations.id');

        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->toString();
        $frequency = $request->string('frequency')->toString();
        $createdBy = $request->input('created_by');
        $startDateFrom = $request->input('start_date_from');
        $startDateTo = $request->input('start_date_to');
        $minPrice = $request->input('min_price');
        $maxPrice = $request->input('max_price');
        $minFinanced = $request->input('min_financed');
        $maxFinanced = $request->input('max_financed');
        $minPayable = $request->input('min_payable');
        $maxPayable = $request->input('max_payable');
        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');
        $allowedSorts = [
            'id',
            'item_reference',
            'total_price',
            'down_payment',
            'financed_amount',
            'flat_markup',
            'total_payable',
            'frequency',
            'status',
            'start_date',
            'created_at',
        ];

        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'created_at';
        }

        if (! in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'desc';
        }

        $perPage = (int) $request->input('per_page', 15);

        $allowedPerPage = [10, 15, 25, 50, 100];

        if (! in_array($perPage, $allowedPerPage, true)) {
            $perPage = 15;
        }
        $installments = InstallmentPlans::query()
            ->where(function ($query) use ($organizationId, $user) {
                $query
                    ->where('organization_id', $organizationId)
                    ->orWhere('created_by_user_id', $user->id);
            })
            ->with([
                'customer:id,first_name,last_name,cnic,phone,email',
                'createdBy:id,first_name,last_name,email',
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('item_reference', 'like', "%{$search}%")
                        ->orWhereHas('customer', function ($query) use ($search) {
                            $query
                                ->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%")
                                ->orWhereRaw(
                                    "CONCAT(first_name, ' ', last_name) LIKE ?",
                                    ["%{$search}%"]
                                )
                                ->orWhere('cnic', 'like', "%{$search}%")
                                ->orWhere('phone', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($frequency, function ($query) use ($frequency) {
                $query->where('frequency', $frequency);
            })
            ->when($createdBy, function ($query) use ($createdBy) {
                $query->where('created_by_user_id', $createdBy);
            })
            ->when($startDateFrom, function ($query) use ($startDateFrom) {
                $query->whereDate('start_date', '>=', $startDateFrom);
            })
            ->when($startDateTo, function ($query) use ($startDateTo) {
                $query->whereDate('start_date', '<=', $startDateTo);
            })
            ->when($minPrice !== null && $minPrice !== '', function ($query) use ($minPrice) {
                $query->where('total_price', '>=', $minPrice);
            })
            ->when($maxPrice !== null && $maxPrice !== '', function ($query) use ($maxPrice) {
                $query->where('total_price', '<=', $maxPrice);
            })
            ->when($minFinanced !== null && $minFinanced !== '', function ($query) use ($minFinanced) {
                $query->where('financed_amount', '>=', $minFinanced);
            })
            ->when($maxFinanced !== null && $maxFinanced !== '', function ($query) use ($maxFinanced) {
                $query->where('financed_amount', '<=', $maxFinanced);
            })
            ->when($minPayable !== null && $minPayable !== '', function ($query) use ($minPayable) {
                $query->where('total_payable', '>=', $minPayable);
            })
            ->when($maxPayable !== null && $maxPayable !== '', function ($query) use ($maxPayable) {
                $query->where('total_payable', '<=', $maxPayable);
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        $users = User::query()
            ->whereHas('createdInstallments', function ($query) use ($organizationId) {
                $query->where('organization_id', $organizationId);
            })
            ->select('id', 'first_name', 'last_name')
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->get();

        return Inertia::render('installments/index', [
            'installments' => $installments,

            'filters' => [
                'search' => $search,
                'status' => $status,
                'frequency' => $frequency,
                'created_by' => $createdBy,
                'start_date_from' => $startDateFrom,
                'start_date_to' => $startDateTo,
                'min_price' => $minPrice,
                'max_price' => $maxPrice,
                'min_financed' => $minFinanced,
                'max_financed' => $maxFinanced,
                'min_payable' => $minPayable,
                'max_payable' => $maxPayable,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],

            'filterOptions' => [
                'users' => $users,
            ],
        ]);
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
            $financedAmount = $totalPrice - $downPayment;
            $markupRate = 20;
            $flatMarkup = $financedAmount * ($markupRate / 100);
            $totalPayable = $financedAmount + $flatMarkup;

            $installment = InstallmentPlans::create([
                'created_by_user_id' => auth()->user()->id ?? null,
                'organization_id' => auth()->user()->organization()->value('organizations.id') ?? null,
                'customer_id' => $validated['customer_id'],
                'item_reference' => $validated['item_reference'],
                'total_price' => $totalPrice,
                'down_payment' => $downPayment,
                'financed_amount' => $financedAmount,
                'installment_amount' => $validated['installment_amount'],
                'flat_markup' => $flatMarkup,
                'total_payable' => $totalPayable,
                'frequency' => $validated['frequency'],
                'start_date' => null, // Will be set when status becomes active
            ]);

            foreach ($validated['guarantors'] as $guarantor) {
                $installment->guarantors()->create([
                    'customer_id' => $validated['customer_id'] ?? null,
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
        $installment = InstallmentPlans::with([
            'customer',
            'createdBy:id,first_name,last_name,email',
            'guarantors',
        ])->findOrFail($id);

        $schedules = $installment->installmentSchedules()
            ->where('status', '!=', 'pending')
            ->with('installmentPayments')
            ->get();

        $latestPendingSchedule = $installment->installmentSchedules()
            ->where('status', 'pending')
            ->orderBy('due_date', 'asc')
            ->with('installmentPayments')
            ->first();

        if ($latestPendingSchedule) {
            $schedules->push($latestPendingSchedule);
        }

        $schedules = $schedules
            ->sortBy('id')
            ->values();

        $installment->setRelation(
            'installmentSchedules',
            $schedules
        );

        return Inertia::render('installments/show', [
            'installment' => $installment,
            'statuses' => ['pending_approval', 'active'],
        ]);
    }

    /**
     * Update the status of the specified resource.
     */
    public function updateStatus(Request $request, string $id, InstallmentScheduleService $scheduleService)
    {
        $installment = InstallmentPlans::findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', Rule::enum(InstallmentStatus::class)],
        ]);

        if ($validated['status'] === InstallmentStatus::ACTIVE->value && ! $installment->start_date) {
            $installment->start_date = now();
            $installment->save();
            $scheduleService->generateSchedules($installment);
        }

        $installment->update([
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Installment status updated successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $installment = InstallmentPlans::with('guarantors')->findOrFail($id);

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

        return Inertia::render('installments/edit/index', [
            'installment' => $installment,
            'customers' => $customers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInstallmentRequest $request, string $id)
    {
        $installment = InstallmentPlans::findOrFail($id);
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $installment) {
            $totalPrice = (float) $validated['total_price'];
            $downPayment = (float) $validated['down_payment'];

            // Amount remaining after down payment
            $financedAmount = $totalPrice - $downPayment;

            // Example: 20% flat markup
            $markupRate = 20;
            $flatMarkup = $financedAmount * ($markupRate / 100);

            // Total amount customer will pay through installments
            $totalPayable = $financedAmount + $flatMarkup;

            $installment->update([
                'customer_id' => $validated['customer_id'],
                'item_reference' => $validated['item_reference'],
                'total_price' => $totalPrice,
                'down_payment' => $downPayment,
                'financed_amount' => $financedAmount,
                'installment_amount' => $validated['installment_amount'],
                'flat_markup' => $flatMarkup,
                'total_payable' => $totalPayable,
                'frequency' => $validated['frequency'],
            ]);

            // Re-create guarantors for simplicity (or update them)
            $installment->guarantors()->delete();

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
            ->with('success', 'Installment updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $installment = InstallmentPlans::findOrFail($id);
        $installment->delete();

        return redirect()->route('installments.index')->with('success', 'Installment deleted successfully.');
    }
}
