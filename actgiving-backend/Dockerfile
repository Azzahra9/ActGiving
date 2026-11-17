FROM php:8.2-cli

# Install dependencies sistem dan ekstensi PostgreSQL
RUN apt-get update -y && apt-get install -y libpq-dev unzip zip curl \
    && docker-php-ext-install pdo pdo_pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy seluruh source code backend
COPY . .

# Install dependensi Laravel
RUN composer install --no-dev --optimize-autoloader

# Berikan akses write ke folder storage dan cache
RUN chmod -R 777 storage bootstrap/cache

# Jalankan migrasi dan nyalakan server
# (Render otomatis menyuntikkan variabel $PORT)
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-10000}
