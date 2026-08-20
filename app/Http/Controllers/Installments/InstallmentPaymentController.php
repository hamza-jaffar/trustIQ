<?php

namespace App\Http\Controllers\Installments;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\InstallmentSchedules;
use App\Services\InstallmentScheduleService;

class InstallmentPaymentController extends Controller
{
    protected InstallmentScheduleService $scheduleService;

    public function __construct(InstallmentScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    public function store(Request $request, InstallmentSchedules $schedule)
    {
        $validated = $request->validate([
            'amount_paid' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'payment_method' => 'nullable|string|max:50',
            'transaction_reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $this->scheduleService->recordPayment($schedule, $validated);

        return redirect()->back()->with('success', 'Payment recorded successfully.');
    }
}
