<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Enums\OrderStatuses;
use App\Models\Order;
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

    private array $adminRoles = ['developer', 'admin'];

    private array $closedOrderStatuses = [
        OrderStatuses::CLOSED_BY_CLIENT,
        OrderStatuses::CLOSED_BY_ORGANIZATION,
        OrderStatuses::CLOSED_BY_ADMINISTRATION,
    ];

    private array $availableOrderStatuses = [
        'created' => [
            OrderStatuses::ACCEPTED,
            OrderStatuses::DECLINED,
        ],
        'accepted' => [
            OrderStatuses::COOKING,
        ],
        'cooking' => [
            OrderStatuses::DELIVERING,
        ],
        'delivering' => [
            OrderStatuses::FINISHED,
        ],
    ];

    private function isAdmin(User $user): bool
    {
        return $user->roles()->whereIn('name', $this->adminRoles)->exists();
    }

    private function checkAccess(User $user, array $allowedRoles, bool $isOrganization = false): bool
    {
        if ($this->isAdmin($user)) {
            return true;
        }

        if ($isOrganization) {
            return $user->organizationRoles()->whereIn('name', $allowedRoles)->exists();
        }

        return $user->roles()->whereIn('name', $allowedRoles)->exists();
    }

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('isAdmin', function (User $user) {
            return $this->isAdmin($user);
        });

        Gate::define('isManager', function (User $user) {
            $allowedRoles = ['manager'];

            return $this->checkAccess($user, $allowedRoles);
        });

        Gate::define('isOrganizationOwner', function (User $user) {
            $allowedRoles = ['owner'];

            return $this->checkAccess($user, $allowedRoles, true);
        });

        Gate::define('isOrganizationDeputy', function (User $user) {
            $allowedRoles = ['owner', 'deputy'];

            return $this->checkAccess($user, $allowedRoles, true);
        });

        Gate::define('isOrganizationAdmin', function (User $user) {
            $allowedRoles = ['owner', 'deputy', 'admin'];

            return $this->checkAccess($user, $allowedRoles, true);
        });

        Gate::define('isOrganizationManager', function (User $user) {
            $allowedRoles = ['owner', 'deputy', 'admin', 'manager'];

            return $this->checkAccess($user, $allowedRoles, true);
        });

        Gate::define('updateOrder', function (User $user, Order $order, string $status) {
            if ($order->status === $status) {
                return true;
            }

            if (!empty($this->availableOrderStatuses[$order->status])) {
                return in_array($status, $this->availableOrderStatuses);
            }

            return false;
        });
    }
}
