<?php

namespace App\Http\Requests\Installment;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateInstallmentRequest extends FormRequest
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

            'frequency' => [
                'required',
                'in:weekly,bi_weekly,monthly',
            ],

            'start_date' => [
                'required',
                'date',
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
}
