<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
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
            'name' => 'string|max:28',
            'uid' => 'string|unique:users,uid|max:6',
            'email' => 'string',
            'phone' => 'string',
            'avatar' => 'file|image|mimes:jpeg,jpg,png|max:2048',
            'password' => 'required|string',
            'new_password' => [
                'string',
                Password::min(8)->uncompromised(),
                'confirmed',
            ],
        ];
    }
}
