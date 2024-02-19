<?php

namespace App\Http\Filters;

class OrganizationsFilter extends QueryFilter
{
    public function query(string $query): void
    {
        $this->builder->where('name', 'like', "%$query%");
    }
}
