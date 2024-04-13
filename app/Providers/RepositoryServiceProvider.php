<?php

namespace App\Providers;

use App\Repositories\CategoryRepository;
use App\Repositories\Contracts\CategoryRepositoryContract;
use App\Repositories\Contracts\IngredientRepositoryContract;
use App\Repositories\Contracts\OrderRepositoryContract;
use App\Repositories\Contracts\OrganizationRepositoryContract;
use App\Repositories\Contracts\ProductRepositoryContract;
use App\Repositories\Contracts\RoleRepositoryContract;
use App\Repositories\Contracts\UserRepositoryContract;
use App\Repositories\IngredientRepository;
use App\Repositories\OrderRepository;
use App\Repositories\OrganizationRepository;
use App\Repositories\ProductRepository;
use App\Repositories\RoleRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(
            OrderRepositoryContract::class,
            OrderRepository::class,
        );

        $this->app->bind(
            OrganizationRepositoryContract::class,
            OrganizationRepository::class,
        );

        $this->app->bind(
            CategoryRepositoryContract::class,
            CategoryRepository::class,
        );

        $this->app->bind(
            ProductRepositoryContract::class,
            ProductRepository::class,
        );

        $this->app->bind(
            IngredientRepositoryContract::class,
            IngredientRepository::class,
        );

        $this->app->bind(
            UserRepositoryContract::class,
            UserRepository::class,
        );

        $this->app->bind(
            RoleRepositoryContract::class,
            RoleRepository::class,
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
