<?php

namespace App\Http\Requests;

use App\Enums\OrderStatuses;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                Rule::in(array_column(OrderStatuses::cases(), 'value')),
            ],
            'delivery' => 'bool',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
