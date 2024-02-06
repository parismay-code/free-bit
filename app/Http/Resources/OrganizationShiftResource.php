<?php

namespace App\Http\Resources;

use App\Models\EmployeeShift;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin EmployeeShift */
class OrganizationShiftResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'organization' => new OrganizationResource($this->organization),
            'employee' => new UserResource($this->employee),
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
