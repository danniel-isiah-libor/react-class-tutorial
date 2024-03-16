<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Laravel\Passport\RefreshTokenRepository;
use Laravel\Passport\TokenRepository;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $params = [
            'grant_type' => 'password',
            'client_id' => config('services.client_id'),
            'client_secret' => config('services.client_secret'),
            'username' => $request->email,
            'password' => $request->password,
            'scope' => '*'
        ];

        $request = request()->create('oauth/token', 'POST', $params);
        $response = app()->handle($request);

        switch ($response->status()) {
            case 200:
                $response = json_decode($response->content());
                break;
            default:
                abort($response->status(), 'Invalid Credentials.');
        }

        return response()->json($response);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        $id = $request->user()->token()->id;

        $tokenRepository = app(TokenRepository::class);
        $refreshTokenRepository = app(RefreshTokenRepository::class);

        $tokenRepository->revokeAccessToken($id);
        $refreshTokenRepository->revokeRefreshTokensByAccessTokenId($id);

        return response()->json(true);
    }

    /**
     * Refresh the token.
     */
    public function refreshToken(Request $request)
    {
        $request->validate([
            'refresh_token' => ['required', 'string']
        ]);

        $params = [
            'grant_type' => 'refresh_token',
            'refresh_token' => $request->refresh_token,
            'client_id' => config('services.client_id'),
            'client_secret' => config('services.client_secret'),
            'scope' => '*'
        ];

        $request = request()->create('oauth/token', 'POST', $params);
        $response = app()->handle($request);

        switch ($response->status()) {
            case 200:
                $response = json_decode($response->content());
                break;
            default:
                abort($response->status(), 'Invalid Credentials.');
        }

        return response()->json($response);
    }
}
