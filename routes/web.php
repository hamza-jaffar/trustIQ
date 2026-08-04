<?php

use App\Http\Controllers\Organization\OrganizationController;
use App\Http\Controllers\Role\RoleController;
use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('organization', [OrganizationController::class, 'index'])->name('organization');
    Route::post('organization/post', [OrganizationController::class, 'post'])->name('proganization.post');

    Route::prefix('roles')->name('roles')->group(function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::get('/create', [RoleController::class, 'create'])->name('.create');
        Route::post('/', [RoleController::class, 'store'])->name('.store');
        Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('.edit');
        Route::put('/{role}', [RoleController::class, 'update'])->name('.update');
        Route::delete('/{role}', [RoleController::class, 'delete'])->name('.delete');
    });

    Route::prefix('users')->name('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/create', [UserController::class, 'create'])->name('.create');
        Route::post('/', [UserController::class, 'store'])->name('.store');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('.edit');
        Route::put('/{user}', [UserController::class, 'update'])->name('.update');
        Route::delete('/{user}', [UserController::class, 'delete'])->name('.delete');
    });

});

require __DIR__.'/settings.php';
