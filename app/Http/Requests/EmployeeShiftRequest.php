<?php

namespace App\Http\Requests;

use App\Enums\ShiftStatuses;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmployeeShiftRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                Rule::in(array_column(ShiftStatuses::cases(), 'value')),
            ],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
