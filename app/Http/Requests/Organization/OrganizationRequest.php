<?php

namespace App\Http\Requests\Organization;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrganizationRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $organizationId = $this->input('organization_id') ?? null;
        return [
        'name' => ['required', 'string', 'max:255'],

        'email' => [
            'nullable',
            'email',
            'max:255',
            Rule::unique('organizations', 'email')->ignore($organizationId),
        ],

        'phone' => [
            'required',
            'string',
            'max:20',
            Rule::unique('organizations', 'phone')->ignore($organizationId),
        ],

        'business_type' => [
            'required',
            // Rule::enum(BusinessType::class),
        ],

        'website' => [
            'nullable',
            'url',
            'max:255',
        ],

        'registration_number' => [
            'nullable',
            'string',
            'max:100',
            Rule::unique('organizations', 'registration_number')
                ->ignore($organizationId),
        ],

        'tax_number' => [
            'nullable',
            'string',
            'max:100',
            Rule::unique('organizations', 'tax_number')
                ->ignore($organizationId),
        ],

        'logo' => [
            'nullable',
            'image',
            'mimes:jpg,jpeg,png,webp,svg',
            'max:2048',
        ],
    ];
    }
}
