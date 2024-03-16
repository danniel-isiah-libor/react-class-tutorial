<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $http = new Client();

        $response = $http->request(
            'GET',
            sprintf('%s/api/user', config('services.auth_url')),
            [
                'http_errors' => false,
                'headers' => [
                    'Accept' => 'application/json',
                    'X-Requested-With' => 'XMLHttpRequest',
                    'Authorization' => $request->headers->get('authorization') ?? '',
                    'Cookie' => $request->headers->get('cookie') ?? '',
                    'Origin' => $request->headers->get('origin') ?? '',
                ]
            ]
        );

        switch ($response->getStatusCode()) {
            case 200:
                $user = json_decode($response->getBody());

                $user = User::find($user->id);

                $request->setUserResolver(function () use ($user) {
                    return $user;
                });

                break;
            default:
                Log::error($response->getBody());
                abort($response->getStatusCode(), $response->getBody());
        }

        return $next($request);
    }
}
