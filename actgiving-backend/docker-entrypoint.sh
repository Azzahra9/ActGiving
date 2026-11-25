#!/bin/sh
set -e

# Port dinamis yang di-inject oleh Railway (default ke 8080 jika tidak ada)
export SERVER_NAME=":${PORT:-8080}"
export SERVER_ROOT="/app/public"

# Jalankan migrasi database PostgreSQL (Supabase)
echo "Running database migrations..."
php artisan migrate --force || echo "Migration warning/skipped"

# Pastikan akun admin produksi tersedia
echo "Ensuring production admin account..."
php artisan make:admin admin@actgiving.com --name="Admin ActGiving" --password="adminactgiving" --no-interaction || echo "Admin creation skipped"

# Pastikan public storage symlink tersedia
php artisan storage:link || true

# Cache config, route, dan view untuk optimasi production
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "Starting FrankenPHP server on port ${PORT:-8080} with document root /app/public..."
exec frankenphp run --config /etc/caddy/Caddyfile
