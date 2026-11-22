<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Menentukan izin akses lintas domain untuk frontend (React / Next.js / Vite).
    | Ketika supports_credentials diatur ke true untuk Sanctum / cookie auth,
    | allowed_origins TIDAK BOLEH berupa wildcard [*], melainkan harus domain spesifik.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'storage/*', 'up'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_unique(array_filter(array_merge(
        [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
        ],
        explode(',', env('FRONTEND_URL', 'http://localhost:3000'))
    )))),

    'allowed_origins_patterns' => array_values(array_filter([
        '#^https://.*\.vercel\.app$#',
        env('FRONTEND_URL_PATTERN'),
    ])),

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => true,

];
