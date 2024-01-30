<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:28',
            'uid' => 'required|string|unique:users,uid|max:6',
            'email' => 'required|string',
            'phone' => 'required|string',
            'password' => [
                'required',
                'string',
                Password::min(8)->uncompromised(),
                'confirmed',
            ],
        ];
    }
}
