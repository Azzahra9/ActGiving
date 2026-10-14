# Introduction

RESTful API untuk platform Donasi & Kerelawanan ActGiving. Mendukung 3 aktor: Administrator, User Terdaftar (Inisiator / Relawan), dan Donatur Tamu (Guest Checkout).

<aside>
    <strong>Base URL</strong>: <code>http://localhost:8000</code>
</aside>

    Selamat datang di dokumentasi interaktif API **ActGiving**.

    **Autentikasi:** Sebagian besar endpoint memerlukan token Bearer (Laravel Sanctum).
    Untuk mendapatkan token, gunakan endpoint `POST /api/auth/login` atau `POST /api/auth/register`.
    Kemudian klik tombol **Authorize** di atas dan masukkan token dengan format: `Bearer {token_anda}`.

    <aside>Anda dapat langsung mencoba setiap endpoint dari halaman ini menggunakan tombol <b>Try it out</b> tanpa perlu aplikasi Postman.</aside>

