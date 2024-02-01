<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Models\OrganizationRole;
use App\Models\User;
use Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('isAdmin', function (User $user) {
            $allowedRoles = ['developer', 'admin'];

            return $user->roles()->whereIn('name', $allowedRoles)->exists();
        });

        Gate::define('isManager', function (User $user) {
            return $user->roles()->where('name', 'manager')->exists();
        });

        Gate::define('isOrganizationAdmin', function (User $user) {
            $allowedRoles = ['owner', 'deputy', 'admin'];

            return $user->organizationRoles()
                ->whereIn('name', $allowedRoles)
                ->exists();
        });

        Gate::define('isOrganizationManager', function (User $user) {
            return $user->organizationRoles()
                ->where('name', 'manager')
                ->exists();
        });
    }
}
