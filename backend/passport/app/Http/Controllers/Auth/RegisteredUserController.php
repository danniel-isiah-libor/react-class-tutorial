<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            event(new Registered($user));

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

            DB::commit();

            return response()->json($response);
        } catch (\Exception $e) {
            DB::rollBack();

            throw $e;
        }
    }
}
