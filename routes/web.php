
<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
});

/*
|--------------------------------------------------------------------------
| Test Route (Temporary)
|--------------------------------------------------------------------------
*/

Route::get('/test-laravel', function () {
    return response()->json([
        'message' => 'Laravel routing works',
    ]);
});

/*
|--------------------------------------------------------------------------
| Vue SPA Catch-All Route
|--------------------------------------------------------------------------
| Keep this LAST.
*/

Route::get('/{any?}', function () {
    return view('application');
})->where('any', '.*');
