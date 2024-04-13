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
    Route::post('/organizations', [OrganizationsController::class, 'create'])
        ->can('isAdmin');
    Route::post('/organizations/{organization}', [OrganizationsController::class, 'update'])
        ->can('isAdmin');
    Route::delete('/organizations/{organization}', [OrganizationsController::class, 'delete'])
        ->can('isAdmin');

    Route::get('/organizations/{organization}/users', [EmployeesController::class, 'getAll']);
    Route::post('/organizations/{organization}/user/{user}/associate', [EmployeesController::class, 'associate'])
        ->can('isOrganizationAdmin');
    Route::post('/organizations/{organization}/user/{user}/dissociate', [EmployeesController::class, 'dissociate'])
        ->can('isOrganizationAdmin');

    Route::get('/categories/organization/{organization}', [CategoriesController::class, 'getAll']);
    Route::get('/categories/{category}', [CategoriesController::class, 'get']);
    Route::post('/categories/organization/{organization}', [CategoriesController::class, 'create'])
        ->can('isOrganizationManager');
    Route::patch('/categories/{category}', [CategoriesController::class, 'update'])
        ->can('isOrganizationManager');
    Route::delete('/categories/{category}', [CategoriesController::class, 'delete'])
        ->can('isOrganizationManager');

    Route::get('/products/organization/{organization}', [ProductsController::class, 'getByOrganization']);
    Route::get('/products/category/{category}', [ProductsController::class, 'getByCategory']);
    Route::get('/products/{product}', [ProductsController::class, 'get']);
    Route::post('/products/organization/{organization}/category/{category}', [ProductsController::class, 'create'])
        ->can('isOrganizationManager');
    Route::patch('/products/{product}', [ProductsController::class, 'update'])
        ->can('isOrganizationManager');
    Route::delete('/products/{product}', [ProductsController::class, 'delete'])
        ->can('isOrganizationManager');

    Route::get('/ingredients/organization/{organization}', [IngredientsController::class, 'getByOrganization']);
    Route::get('/ingredients/product/{organization}', [IngredientsController::class, 'getByProduct']);
    Route::get('/ingredients/{ingredient}', [IngredientsController::class, 'get']);
    Route::post('/ingredients/organization/{organization}', [IngredientsController::class, 'create'])
        ->can('isOrganizationManager');
    Route::patch('/ingredients/{ingredient}', [IngredientsController::class, 'update'])
        ->can('isOrganizationManager');
    Route::delete('/ingredients/{ingredient}', [IngredientsController::class, 'delete'])
        ->can('isOrganizationManager');
    Route::post('/ingredients/{ingredient}/product/{product}/attach', [IngredientsController::class, 'attach'])
        ->can('isOrganizationManager');
    Route::post('/ingredients/{ingredient}/product/{product}/detach', [IngredientsController::class, 'detach'])
        ->can('isOrganizationManager');

    Route::get('/shifts/organization/{organization}', [EmployeeShiftsController::class, 'getByOrganization'])
        ->can('isOrganizationManager');
    Route::get('/shifts/user/{user}', [EmployeeShiftsController::class, 'getByUser'])
        ->can('isOrganizationManager');
    Route::get('/shifts/{employeeShift}', [EmployeeShiftsController::class, 'get']);
    Route::post('/shifts/user/{user}', [EmployeeShiftsController::class, 'create']);
    Route::patch('/shifts/{employeeShift}', [EmployeeShiftsController::class, 'update']);
    Route::delete('/shifts/{employeeShift}', [EmployeeShiftsController::class, 'delete'])
        ->can('isAdmin');

    Route::get('/orders', [OrdersController::class, 'getAll']);
    Route::get('/orders/{order}', [OrdersController::class, 'get']);
    Route::get('/orders/organization/{organization}', [OrdersController::class, 'getByOrganization']);
    Route::get('/orders/organization/{organization}/latest', [OrdersController::class, 'getLatestByOrganization']);
    Route::get('/orders/user/{user}', [OrdersController::class, 'getByUser']);
    Route::get('/orders/user/{user}/current', [OrdersController::class, 'getCurrentByUser']);
    Route::get('/orders/user/{user}/latest', [OrdersController::class, 'getLatestByUser']);
    Route::post('/orders/organization/{organization}', [OrdersController::class, 'create']);
    Route::patch('/orders/{order}/organization/{organization}', [OrdersController::class, 'update']);
    Route::delete('/orders/{order}', [OrdersController::class, 'delete'])
        ->can('isAdmin');
    Route::post('orders/{order}/courier/{user}', [OrdersController::class, 'associateCourier']);
    Route::post('orders/{order}/employee/{user}', [OrdersController::class, 'associateEmployee']);

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
    Route::post('/roles/{role}/user/{user}/attach', [RolesController::class, 'attach'])
        ->can('isAdmin');
    Route::post('/roles/{role}/user/{user}/detach', [RolesController::class, 'detach'])
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
