<?php

use App\Http\Controllers\Organization\OrganizationController;
use App\Http\Controllers\Role\RoleController;
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

});

require __DIR__.'/settings.php';
