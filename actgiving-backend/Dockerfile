FROM dunglas/frankenphp:1-php8.3

# Install dependencies sistem dan ekstensi PHP yang dibutuhkan Laravel & Supabase PostgreSQL
RUN install-php-extensions \
    pdo_pgsql \
    pgsql \
    bcmath \
    intl \
    zip \
    opcache \
    pcntl

# Install Composer resmi
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy seluruh source code backend
COPY . .

# Install dependensi Laravel (production mode tanpa dev)
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Berikan izin ke folder storage dan cache
RUN chmod -R 775 storage bootstrap/cache

# Setup entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Document root mengarah ke Laravel public
ENV SERVER_ROOT=/app/public

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
