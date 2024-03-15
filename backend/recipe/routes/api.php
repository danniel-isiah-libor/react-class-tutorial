<?php

use App\Http\Controllers\RecipeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::resource('recipes', RecipeController::class)->only([
        'index',
        'store',
        'show',
        'update',
        'destroy'
    ]);
});
