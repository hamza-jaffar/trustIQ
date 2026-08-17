<?php

use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Installments\InstallmentsController;
use App\Http\Controllers\Organization\OrganizationController;
use App\Http\Controllers\Role\RoleController;
use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('organization', [OrganizationController::class, 'index'])->middleware('permission:organization.view')->name('organization');
    Route::post('organization/post', [OrganizationController::class, 'post'])->middleware('permission:organization.update')->name('organization.post');

    Route::prefix('roles')->name('roles')->middleware('permission:roles.view')->group(function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::get('/create', [RoleController::class, 'create'])->name('.create')->middleware('permission:roles.create');
        Route::post('/', [RoleController::class, 'store'])->name('.store')->middleware('permission:roles.create');
        Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('.edit')->middleware('permission:roles.edit');
        Route::put('/{role}', [RoleController::class, 'update'])->name('.update')->middleware('permission:roles.edit');
        Route::delete('/{role}', [RoleController::class, 'delete'])->name('.delete')->middleware('permission:roles.delete');
    });

    Route::prefix('users')->name('users')->middleware('permission:users.view')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/create', [UserController::class, 'create'])->name('.create')->middleware('permission:users.create');
        Route::post('/', [UserController::class, 'store'])->name('.store')->middleware('permission:users.create');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('.edit')->middleware('permission:users.edit');
        Route::put('/{user}', [UserController::class, 'update'])->name('.update')->middleware('permission:users.edit');
        Route::delete('/{user}', [UserController::class, 'delete'])->name('.delete')->middleware('permission:users.delete');
    });

    Route::prefix('customers')->name('customers')->group(function () {
        Route::get('/', [CustomerController::class, 'index'])->name('.index');
        Route::get('/create', [CustomerController::class, 'create'])->name('.create');
        Route::post('/store', [CustomerController::class, 'store'])->name('store');
        Route::put('/update/{id}', [CustomerController::class, 'update'])->name('.update');
        Route::get('/search-by-cnic/{cnic}', [CustomerController::class, 'searchByCnic'])->name('.searchByCnic');
        Route::get('/{cnic}', [CustomerController::class, 'profile'])->name('.profile');
    });

    Route::prefix('installments')->name('installments')->group(function () {
        Route::get('/', [InstallmentsController::class, 'index'])->name('.index');
        Route::get('/create', [InstallmentsController::class, 'create'])->name('.create');
        Route::post('/store', [InstallmentsController::class, 'store'])->name('.store');
        Route::get('/{id}', [InstallmentsController::class, 'show'])->name('.show');
    });

});

require __DIR__.'/settings.php';
