<?php

namespace App\Http\Filters;

class UsersFilter extends QueryFilter
{
    public function query(string $query): void
    {
        $this->builder
            ->where('name', 'like', "%$query%")
            ->orWhere('uid', 'like', "%$query%")
            ->orWhere('email', 'like', "%$query%");
    }
}
