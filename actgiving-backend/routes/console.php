<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('admin:make {email?} {--name=} {--password=} {--assign-only} {--revoke}', function () {
    return $this->call('make:admin', [
        'email' => $this->argument('email'),
        '--name' => $this->option('name'),
        '--password' => $this->option('password'),
        '--assign-only' => $this->option('assign-only'),
        '--revoke' => $this->option('revoke'),
    ]);
})->purpose('Alias untuk perintah make:admin');
