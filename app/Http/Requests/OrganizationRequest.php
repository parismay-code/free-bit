<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrganizationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:28',
            'description' => 'string|max:120',
            'avatar' => 'file|image|mimes:jpeg,jpg,png|max:2048',
            'banner' => 'file|image|mimes:jpeg,jpg,png|max:6144',
            'owner_uid' => 'required|string|exists:users,uid',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
