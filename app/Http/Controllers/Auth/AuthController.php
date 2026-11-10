<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{

    public function login(LoginRequest $request)
    {
        $validated = $request->validated();

        $credentials = [
            'email' => $validated['email'],
            'password' => $validated['password']
        ];

        $remember = (bool) ($validated['remembder'] ?? false);


        if(! Auth::attempt($credentials, $remember) ) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed')
            ]);
        }

        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'user' => $request->user()->only(
                'id', 'name', 'email'
            )
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out sucessfully.'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()->only('id', 'name', 'email'),
        ]);
    }

}
