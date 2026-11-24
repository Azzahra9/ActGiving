<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || (method_exists($user, 'isAdmin') ? ! $user->isAdmin() : $user->role !== 'admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Endpoint ini hanya untuk Administrator.',
            ], 403);
        }

        return $next($request);
    }
}
