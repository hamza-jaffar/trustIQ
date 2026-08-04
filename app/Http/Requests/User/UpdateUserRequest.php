<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $this->route('user')?->id],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'status' => ['nullable', 'in:active,suspended'],
            'role_id' => ['required', 'exists:roles,id'],
        ];
    }
}
