<?php

namespace App\Http\Middleware;

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
                'headers' => $request->headers->all()
            ]
        );

        switch ($response->getStatusCode()) {
            case 200:
                $user = json_decode($response->getBody());

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
