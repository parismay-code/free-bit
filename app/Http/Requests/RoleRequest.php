<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoleRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:28',
            'description' => 'string|max:120',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
