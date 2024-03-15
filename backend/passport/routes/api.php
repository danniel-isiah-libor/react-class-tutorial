<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:api'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('refresh-token', [AuthenticatedSessionController::class, 'refreshToken']);
