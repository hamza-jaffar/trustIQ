<?php

namespace App\Http\Requests\Installment;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateInstallmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_id' => [
                'required',
                'exists:customers,id',
            ],

            'item_reference' => [
                'required',
                'string',
                'max:255',
            ],

            'total_price' => [
                'required',
                'numeric',
                'min:0',
            ],

            'down_payment' => [
                'required',
                'numeric',
                'min:0',
                'lte:total_price',
            ],

            'installment_amount' => [
                'required',
                'numeric',
                'min:0',
                'lte:total_price',
            ],
            
            'frequency' => [
                'required',
                'in:weekly,bi_weekly,monthly',
            ],

            // Guarantors
            'guarantors' => [
                'required',
                'array',
                'min:1',
            ],

            'guarantors.*.customer_id' => [
                'nullable',
                'exists:customers,id',
            ],

            'guarantors.*.full_name' => [
                'required',
                'string',
                'max:255',
            ],

            'guarantors.*.cnic' => [
                'required',
                'string',
                'max:30',
                'distinct',
            ],

            'guarantors.*.phone' => [
                'required',
                'string',
                'max:30',
            ],

            'guarantors.*.address' => [
                'required',
                'string',
                'max:1000',
            ],

            'guarantors.*.relationship' => [
                'required',
                'string',
                'max:100',
            ],

            'guarantors.*.monthly_income' => [
                'required',
                'numeric',
                'min:0',
            ],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $customerId = $this->input('customer_id');
            $guarantors = $this->input('guarantors', []);

            if (!is_array($guarantors)) {
                return;
            }

            $customerIds = [];
            $cnics = [];

            foreach ($guarantors as $index => $guarantor) {
                // 1. Guarantor cannot be the customer themselves
                if (isset($guarantor['customer_id']) && $guarantor['customer_id'] == $customerId) {
                    $validator->errors()->add("guarantors.{$index}.customer_id", "The customer cannot be their own guarantor.");
                }

                if (isset($guarantor['customer_id'])) {
                    $customerIds[] = $guarantor['customer_id'];
                }

                if (isset($guarantor['cnic'])) {
                    $cnics[] = $guarantor['cnic'];
                }
            }

            // 2. Guarantor cannot be selected twice (checked via 'distinct' for cnic, let's also check customer_id manually)
            $duplicateCustomerIds = array_unique(array_diff_assoc($customerIds, array_unique($customerIds)));
            foreach ($guarantors as $index => $guarantor) {
                if (isset($guarantor['customer_id']) && in_array($guarantor['customer_id'], $duplicateCustomerIds)) {
                    $validator->errors()->add("guarantors.{$index}.customer_id", "This guarantor is selected multiple times.");
                }
            }

            // 3. Guarantor cannot be an active/pending guarantor on any other installment
            if (count($cnics) > 0 || count($customerIds) > 0) {
                $existingGuarantors = \App\Models\Guarantor::whereHas('installment', function($q) {
                    $q->whereIn('status', [
                        \App\Enum\InstallmentStatus::ACTIVE->value,
                        \App\Enum\InstallmentStatus::PENDING_APPROVAL->value
                    ]);
                })->where('installment_id', '!=', $this->route('id'))
                  ->where(function($q) use ($cnics, $customerIds) {
                    if (count($cnics) > 0) {
                        $q->orWhereIn('cnic', $cnics);
                    }
                    if (count($customerIds) > 0) {
                        $q->orWhereIn('customer_id', $customerIds);
                    }
                })->get();

                foreach ($guarantors as $index => $guarantor) {
                    $conflict = $existingGuarantors->first(function($existing) use ($guarantor) {
                        return (isset($guarantor['cnic']) && $existing->cnic == $guarantor['cnic']) ||
                               (isset($guarantor['customer_id']) && $existing->customer_id == $guarantor['customer_id']);
                    });

                    if ($conflict) {
                        $validator->errors()->add("guarantors.{$index}.cnic", "This person is already a guarantor on an active or pending installment plan.");
                    }
                }
            }
        });
    }
}
