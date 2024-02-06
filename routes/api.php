<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\EmployeeRolesController;
use App\Http\Controllers\EmployeesController;
use App\Http\Controllers\EmployeeShiftsController;
use App\Http\Controllers\IngredientsController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\OrganizationsController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/users', [UsersController::class, 'getAll'])
        ->can('isManager');
    Route::get('/users/{user}', [UsersController::class, 'get'])
        ->can('isManager');
    Route::post('/users/{user}', [UsersController::class, 'update']);
    Route::delete('/users/{user}', [UsersController::class, 'delete']);

    Route::get('/organizations', [OrganizationsController::class, 'getAll']);
    Route::get('/organizations/{organization}', [OrganizationsController::class, 'get']);
    Route::post('/organizations/owner/{user}', [OrganizationsController::class, 'create'])
        ->can('isAdmin');
    Route::patch('/organizations/{organization}/owner/{user}', [OrganizationsController::class, 'update'])
        ->can('isAdmin');
    Route::delete('/organizations/{organization}', [OrganizationsController::class, 'delete'])
        ->can('isAdmin');

    Route::get('/organizations/{organization}/employees', [EmployeesController::class, 'getAll']);
    Route::get('/organizations/{organization}/employees/{user}', [EmployeesController::class, 'get'])
        ->can('isOrganizationManager');
    Route::post('/organizations/{organization}/employees/{user}/associate', [EmployeesController::class, 'associate'])
        ->can('isOrganizationAdmin');
    Route::post('/organizations/{organization}/employees/{user}/dissociate', [EmployeesController::class, 'dissociate'])
        ->can('isOrganizationAdmin');

    Route::get('/organizations/{organization}/categories', [CategoriesController::class, 'getAll']);
    Route::get('/organizations/{organization}/categories/{category}', [CategoriesController::class, 'get']);
    Route::post('/organizations/{organization}/categories', [CategoriesController::class, 'create'])
        ->can('isOrganizationManager');
    Route::patch('/organizations/{organization}/categories/{category}', [CategoriesController::class, 'update'])
        ->can('isOrganizationManager');
    Route::delete('/organizations/{organization}/categories/{category}', [CategoriesController::class, 'delete'])
        ->can('isOrganizationManager');

    Route::get('/organizations/{organization}/products', [ProductsController::class, 'getAll']);
    Route::get('/organizations/{organization}/products/{product}', [ProductsController::class, 'get']);
    Route::post('/organizations/{organization}/categories/{category}/products', [ProductsController::class, 'create'])
        ->can('isOrganizationManager');
    Route::patch('/organizations/{organization}/categories/{category}/products/{product}', [ProductsController::class, 'update'])
        ->can('isOrganizationManager');
    Route::delete('/organizations/{organization}/products/{product}', [ProductsController::class, 'delete'])
        ->can('isOrganizationManager');

    Route::get('/organizations/{organization}/ingredients', [IngredientsController::class, 'getAll']);
    Route::get('/organizations/{organization/ingredients/{ingredient}', [IngredientsController::class, 'get']);
    Route::post('/organizations/{organization}/ingredients', [IngredientsController::class, 'create'])
        ->can('isOrganizationManager');
    Route::patch('/organizations/{organization}/ingredients/{ingredient}', [IngredientsController::class, 'update'])
        ->can('isOrganizationManager');
    Route::delete('/organizations/{organization}/ingredients/{ingredient}', [IngredientsController::class, 'delete'])
        ->can('isOrganizationManager');
    Route::post('/organizations/{organization}/products/{product}/ingredients/{ingredient}/attach', [IngredientsController::class, 'attach'])
        ->can('isOrganizationManager');
    Route::post('/organizations/{organization}/products/{product}/ingredients/{ingredient}/detach', [IngredientsController::class, 'detach'])
        ->can('isOrganizationManager');

    Route::post('/organizations/{organization}/employee/{user}/shifts', [EmployeeShiftsController::class, 'create']);
    Route::patch('/organizations/{organization}/employee/{user}/shifts/{employeeShift}', [EmployeeShiftsController::class, 'update']);
    Route::delete('/organizations/{organization}/employee/{user}/shifts/{employeeShift}', [EmployeeShiftsController::class, 'delete'])
        ->can('isAdmin');

    Route::get('/organizations/{organization}/orders', [OrdersController::class, 'getAll']);
    Route::get('/organizations/{organization}/orders/{order}', [OrdersController::class, 'get']);
    Route::post('/organizations/{organization}/orders', [OrdersController::class, 'create']);
    Route::patch('/organizations/{organization}/orders/{order}', [OrdersController::class, 'update']);
    Route::delete('/organizations/{organization}/orders/{order}', [OrdersController::class, 'delete'])
        ->can('isAdmin');
    Route::post('/organizations/{organization}/orders/{order}/courier/{user}', [OrdersController::class, 'associateCourier']);
    Route::post('/organizations/{organization}/orders/{order}/employee/{user}', [OrdersController::class, 'associateEmployee']);

    Route::get('/roles', [RolesController::class, 'getAll'])
        ->can('isManager');
    Route::get('/roles/{role}', [RolesController::class, 'get'])
        ->can('isManager');
    Route::post('/roles', [RolesController::class, 'create'])
        ->can('isAdmin');
    Route::patch('/roles/{role}', [RolesController::class, 'update'])
        ->can('isAdmin');
    Route::delete('/roles/{role}', [RolesController::class, 'delete'])
        ->can('isAdmin');
    Route::post('/users/{user}/roles/{role}/attach', [RolesController::class, 'attach'])
        ->can('isAdmin');
    Route::post('/users/{user}/roles/{role}/detach', [RolesController::class, 'detach'])
        ->can('isAdmin');

    Route::get('/organizations/{organization}/roles', [EmployeeRolesController::class, 'getAll']);
    Route::get('/organizations/{organization}/roles/{organizationRole}', [EmployeeRolesController::class, 'get'])
        ->can('isOrganizationManager');
    Route::post('/organizations/{organization}/roles', [EmployeeRolesController::class, 'create'])
        ->can('isOrganizationAdmin');
    Route::patch('/organizations/{organization}/roles/{organizationRole}', [EmployeeRolesController::class, 'update'])
        ->can('isOrganizationAdmin');
    Route::delete('/organizations/{organization}/roles/{organizationRole}', [EmployeeRolesController::class, 'delete'])
        ->can('isOrganizationAdmin');
    Route::post('/organizations/{organization}/employees/{user}/roles/{organizationRole}/attach', [EmployeeRolesController::class, 'attach'])
        ->can('isOrganizationManager');
    Route::post('/organizations/{organization}/employees/{user}/roles/{organizationRole}/detach', [EmployeeRolesController::class, 'detach'])
        ->can('isOrganizationManager');
});
