<?php

use Knuckles\Scribe\Config\AuthIn;
use Knuckles\Scribe\Config\Defaults;
use Knuckles\Scribe\Extracting\Strategies;

use function Knuckles\Scribe\Config\configureStrategy;

return [
    // Judul halaman HTML dokumentasi
    'title' => 'ActGiving API Documentation',

    // Deskripsi singkat ditampilkan di atas halaman docs
    'description' => 'RESTful API untuk platform Donasi & Kerelawanan ActGiving. Mendukung 3 aktor: Administrator, User Terdaftar (Inisiator / Relawan), dan Donatur Tamu (Guest Checkout).',

    // Teks pengantar di bagian "Introduction" (Mendukung Markdown & HTML)
    'intro_text' => <<<'INTRO'
            Selamat datang di dokumentasi interaktif API **ActGiving**.

            **Autentikasi:** Sebagian besar endpoint memerlukan token Bearer (Laravel Sanctum).
            Untuk mendapatkan token, gunakan endpoint `POST /api/auth/login` atau `POST /api/auth/register`.
            Kemudian klik tombol **Authorize** di atas dan masukkan token dengan format: `Bearer {token_anda}`.

            <aside>Anda dapat langsung mencoba setiap endpoint dari halaman ini menggunakan tombol <b>Try it out</b> tanpa perlu aplikasi Postman.</aside>
        INTRO,

    // Base URL yang ditampilkan di dokumentasi
    'base_url' => config('app.url'),

    // Rute yang akan didokumentasikan
    'routes' => [
        [
            'match' => [
                'prefixes' => ['api/*'],
                'domains' => ['*'],
            ],
            'include' => [],
            'exclude' => [
                // Kecualikan route internal Sanctum CSRF yang bukan bagian API utama
                'sanctum/csrf-cookie',
            ],
        ],
    ],

    // Gunakan 'laravel' agar UI tersedia via route /docs (Memungkinkan Try It Out)
    'type' => 'laravel',

    'theme' => 'default',

    'static' => [
        'output_path' => 'public/docs',
    ],

    'laravel' => [
        // Otomatis tambah route /docs, /docs.postman, /docs.openapi
        'add_routes' => true,

        // Endpoint docs dapat diakses di http://localhost:8000/docs
        'docs_url' => '/docs',

        'assets_directory' => null,

        // Middleware: Kosongkan agar docs dapat diakses bebas (tambahkan 'auth' untuk proteksi production)
        'middleware' => [],
    ],

    'external' => [
        'html_attributes' => [],
    ],

    'try_it_out' => [
        // AKTIFKAN tombol "Try It Out" agar API bisa ditest langsung dari browser
        'enabled' => true,

        // Arahkan ke base URL server lokal Anda
        'base_url' => env('APP_URL', 'http://localhost:8000'),

        // Aktifkan CSRF token untuk endpoint yang menggunakan Laravel Sanctum cookie
        'use_csrf' => true,

        // URL untuk mengambil CSRF token sebelum request (Sanctum)
        'csrf_url' => '/sanctum/csrf-cookie',
    ],

    // Konfigurasi Autentikasi: Menggunakan Bearer Token (Laravel Sanctum)
    'auth' => [
        // Aktifkan: Tampilkan padlock 🔒 di endpoint yang membutuhkan auth
        'enabled' => true,

        // Default: semua endpoint memerlukan auth kecuali yang ditandai @unauthenticated
        'default' => false,

        // Token Bearer dikirim via header "Authorization: Bearer {token}"
        'in' => AuthIn::BEARER->value,

        'name' => 'Authorization',

        // Isi SCRIBE_AUTH_KEY di .env dengan token admin/test Anda untuk response calls
        'use_value' => env('SCRIBE_AUTH_KEY'),

        // Placeholder yang tampil di UI dokumentasi
        'placeholder' => '{YOUR_BEARER_TOKEN}',

        'extra_info' => 'Dapatkan token dengan memanggil endpoint <code>POST /api/auth/login</code>. Salin nilai dari field <code>data.token</code> di respons, lalu klik tombol <b>Authorize</b> di atas dan masukkan nilainya.',
    ],

    // Bahasa contoh kode request yang ditampilkan
    'example_languages' => [
        'bash',
        'javascript',
        'php',
    ],

    // Generate Postman Collection (dapat diimport ke Postman)
    'postman' => [
        'enabled' => true,
        'overrides' => [
            'info.version' => '1.0.0',
        ],
    ],

    // Generate OpenAPI Spec YAML (dapat diimport ke Insomnia / Swagger UI eksternal)
    'openapi' => [
        'enabled' => true,
        'version' => '3.0.3',
        'overrides' => [
            'info.version' => '1.0.0',
        ],
        'generators' => [],
    ],

    'groups' => [
        'default' => 'Endpoints',
        // Urutan tampilan grup di sidebar dokumentasi
        'order' => [
            'Authentication',
            'Kampanye Publik',
            'Kategori',
            'Donasi',
            'Pendaftaran Relawan',
            'Inisiator',
            'Pencairan Dana',
            'Laporan Aduan',
            'Administrator',
        ],
    ],

    'logo' => false,

    'last_updated' => 'Last updated: {date:d F Y}',

    'examples' => [
        'faker_seed' => 1234,
        'models_source' => ['factoryCreate', 'factoryMake', 'databaseFirst'],
    ],

    'strategies' => [
        'metadata' => [
            ...Defaults::METADATA_STRATEGIES,
        ],
        'headers' => [
            ...Defaults::HEADERS_STRATEGIES,
            Strategies\StaticData::withSettings(data: [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ]),
        ],
        'urlParameters' => [
            ...Defaults::URL_PARAMETERS_STRATEGIES,
        ],
        'queryParameters' => [
            ...Defaults::QUERY_PARAMETERS_STRATEGIES,
        ],
        'bodyParameters' => [
            ...Defaults::BODY_PARAMETERS_STRATEGIES,
        ],
        'responses' => configureStrategy(
            Defaults::RESPONSES_STRATEGIES,
            Strategies\Responses\ResponseCalls::withSettings(
                only: ['GET *'],
                config: [
                    'app.debug' => false,
                ]
            )
        ),
        'responseFields' => [
            ...Defaults::RESPONSE_FIELDS_STRATEGIES,
        ],
    ],

    'database_connections_to_transact' => [config('database.default')],

    'fractal' => [
        'serializer' => null,
    ],
];
