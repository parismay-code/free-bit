<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeRole extends Model
{
    use HasFactory;

    protected $table = 'employees_roles';

    public function employee(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function organizationRole(): BelongsTo
    {
        return $this->belongsTo(OrganizationRole::class);
    }
}
