<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AttachWithCountRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'count' => 'required|integer',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
