<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>ActGiving API Documentation</title>

    <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="{{ asset("/vendor/scribe/css/theme-default.style.css") }}" media="screen">
    <link rel="stylesheet" href="{{ asset("/vendor/scribe/css/theme-default.print.css") }}" media="print">

    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js"></script>

    <link rel="stylesheet"
          href="https://unpkg.com/@highlightjs/cdn-assets@11.6.0/styles/obsidian.min.css">
    <script src="https://unpkg.com/@highlightjs/cdn-assets@11.6.0/highlight.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jets/0.14.1/jets.min.js"></script>

    <style id="language-style">
        /* starts out as display none and is replaced with js later  */
                    body .content .bash-example code { display: none; }
                    body .content .javascript-example code { display: none; }
                    body .content .php-example code { display: none; }
            </style>

    <script>
        var tryItOutBaseUrl = "http://localhost:8000";
        var useCsrf = Boolean(1);
        var csrfUrl = "/sanctum/csrf-cookie";
    </script>
    <script src="{{ asset("/vendor/scribe/js/tryitout-5.11.0.js") }}"></script>

    <script src="{{ asset("/vendor/scribe/js/theme-default-5.11.0.js") }}"></script>

</head>

<body data-languages="[&quot;bash&quot;,&quot;javascript&quot;,&quot;php&quot;]">

<a href="#" id="nav-button">
    <span>
        MENU
        <img src="{{ asset("/vendor/scribe/images/navbar.png") }}" alt="navbar-image"/>
    </span>
</a>
<div class="tocify-wrapper">
    
            <div class="lang-selector">
                                            <button type="button" class="lang-button" data-language-name="bash">bash</button>
                                            <button type="button" class="lang-button" data-language-name="javascript">javascript</button>
                                            <button type="button" class="lang-button" data-language-name="php">php</button>
                    </div>
    
    <div class="search">
        <input type="text" class="search" id="input-search" placeholder="Search">
    </div>

    <div id="toc">
                    <ul id="tocify-header-introduction" class="tocify-header">
                <li class="tocify-item level-1" data-unique="introduction">
                    <a href="#introduction">Introduction</a>
                </li>
                            </ul>
                    <ul id="tocify-header-authenticating-requests" class="tocify-header">
                <li class="tocify-item level-1" data-unique="authenticating-requests">
                    <a href="#authenticating-requests">Authenticating requests</a>
                </li>
                            </ul>
                    <ul id="tocify-header-authentication" class="tocify-header">
                <li class="tocify-item level-1" data-unique="authentication">
                    <a href="#authentication">Authentication</a>
                </li>
                                    <ul id="tocify-subheader-authentication" class="tocify-subheader">
                                                    <li class="tocify-item level-2" data-unique="authentication-POSTapi-auth-register">
                                <a href="#authentication-POSTapi-auth-register">Register User Baru</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="authentication-POSTapi-auth-login">
                                <a href="#authentication-POSTapi-auth-login">Login Pengguna & Penerbitan Token Sanctum.</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="authentication-POSTapi-auth-forgot-password">
                                <a href="#authentication-POSTapi-auth-forgot-password">FR-05: Lupa Kata Sandi (Generate Token Reset Password - Kadaluwarsa 60 Menit).</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="authentication-POSTapi-auth-reset-password">
                                <a href="#authentication-POSTapi-auth-reset-password">FR-05: Reset Kata Sandi Menggunakan Token.</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="authentication-GETapi-auth-me">
                                <a href="#authentication-GETapi-auth-me">Dapatkan Profil User yang Sedang Login.</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="authentication-POSTapi-auth-logout">
                                <a href="#authentication-POSTapi-auth-logout">Logout & Revoke Token Sanctum.</a>
                            </li>
                                                                        </ul>
                            </ul>
                    <ul id="tocify-header-kampanye-publik" class="tocify-header">
                <li class="tocify-item level-1" data-unique="kampanye-publik">
                    <a href="#kampanye-publik">Kampanye Publik</a>
                </li>
                                    <ul id="tocify-subheader-kampanye-publik" class="tocify-subheader">
                                                    <li class="tocify-item level-2" data-unique="kampanye-publik-GETapi-campaigns">
                                <a href="#kampanye-publik-GETapi-campaigns">Daftar Kampanye Aktif</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="kampanye-publik-GETapi-campaigns--id-">
                                <a href="#kampanye-publik-GETapi-campaigns--id-">Detail Kampanye</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="kampanye-publik-POSTapi-campaigns">
                                <a href="#kampanye-publik-POSTapi-campaigns">Buat Kampanye Baru (Inisiator)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="kampanye-publik-GETapi-my-campaigns">
                                <a href="#kampanye-publik-GETapi-my-campaigns">Kampanye Saya (Inisiator)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="kampanye-publik-PUTapi-campaigns--id-">
                                <a href="#kampanye-publik-PUTapi-campaigns--id-">Update Data Kampanye (Inisiator)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="kampanye-publik-DELETEapi-campaigns--id-">
                                <a href="#kampanye-publik-DELETEapi-campaigns--id-">Hapus Kampanye (Inisiator)</a>
                            </li>
                                                                        </ul>
                            </ul>
                    <ul id="tocify-header-kategori" class="tocify-header">
                <li class="tocify-item level-1" data-unique="kategori">
                    <a href="#kategori">Kategori</a>
                </li>
                                    <ul id="tocify-subheader-kategori" class="tocify-subheader">
                                                    <li class="tocify-item level-2" data-unique="kategori-GETapi-categories">
                                <a href="#kategori-GETapi-categories">Daftar Kategori</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="kategori-POSTapi-admin-categories">
                                <a href="#kategori-POSTapi-admin-categories">Tambah Kategori (Admin)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="kategori-PUTapi-admin-categories--id-">
                                <a href="#kategori-PUTapi-admin-categories--id-">Update Kategori (Admin)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="kategori-DELETEapi-admin-categories--id-">
                                <a href="#kategori-DELETEapi-admin-categories--id-">Hapus Kategori (Admin)</a>
                            </li>
                                                                        </ul>
                            </ul>
                    <ul id="tocify-header-donasi" class="tocify-header">
                <li class="tocify-item level-1" data-unique="donasi">
                    <a href="#donasi">Donasi</a>
                </li>
                                    <ul id="tocify-subheader-donasi" class="tocify-subheader">
                                                    <li class="tocify-item level-2" data-unique="donasi-POSTapi-donations">
                                <a href="#donasi-POSTapi-donations">Pencatatan Transaksi Donasi Nyata / QRIS (POST /api/donations)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="donasi-GETapi-donations">
                                <a href="#donasi-GETapi-donations">Audit Transaksi Donasi Moneter (Admin / Sandbox)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="donasi-GETapi-admin-donations">
                                <a href="#donasi-GETapi-admin-donations">Audit Transaksi Donasi Moneter (Admin / Sandbox)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="donasi-POSTapi-donations-guest-checkout">
                                <a href="#donasi-POSTapi-donations-guest-checkout">Guest Checkout (Tanpa Login)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="donasi-GETapi-donations--reference_code--status">
                                <a href="#donasi-GETapi-donations--reference_code--status">Cek Status Pembayaran</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="donasi-POSTapi-donations-webhook-simulate">
                                <a href="#donasi-POSTapi-donations-webhook-simulate">Simulasi Webhook Pembayaran (ACID)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="donasi-POSTapi-donations-user-checkout">
                                <a href="#donasi-POSTapi-donations-user-checkout">Donasi User Terdaftar</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="donasi-GETapi-my-donations">
                                <a href="#donasi-GETapi-my-donations">Riwayat Donasi Saya</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="donasi-PATCHapi-donations--id--approval">
                                <a href="#donasi-PATCHapi-donations--id--approval">Approval Donasi oleh Inisiator (ACID)</a>
                            </li>
                                                                        </ul>
                            </ul>
                    <ul id="tocify-header-pendaftaran-relawan" class="tocify-header">
                <li class="tocify-item level-1" data-unique="pendaftaran-relawan">
                    <a href="#pendaftaran-relawan">Pendaftaran Relawan</a>
                </li>
                                    <ul id="tocify-subheader-pendaftaran-relawan" class="tocify-subheader">
                                                    <li class="tocify-item level-2" data-unique="pendaftaran-relawan-POSTapi-campaigns--id--volunteer-register">
                                <a href="#pendaftaran-relawan-POSTapi-campaigns--id--volunteer-register">Daftar sebagai Relawan & Pembuatan Akun Relawan Otomatis</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="pendaftaran-relawan-GETapi-initiator-volunteers">
                                <a href="#pendaftaran-relawan-GETapi-initiator-volunteers">Daftar Semua Pendaftar Relawan untuk Inisiator (FR Inisiator)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="pendaftaran-relawan-GETapi-campaigns--id--registrations">
                                <a href="#pendaftaran-relawan-GETapi-campaigns--id--registrations">Daftar Pelamar Relawan per Kampanye (Inisiator)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="pendaftaran-relawan-PATCHapi-volunteer-registrations--id--status">
                                <a href="#pendaftaran-relawan-PATCHapi-volunteer-registrations--id--status">Seleksi Relawan - Accept/Reject (Inisiator, ACID)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="pendaftaran-relawan-GETapi-my-volunteer-registrations">
                                <a href="#pendaftaran-relawan-GETapi-my-volunteer-registrations">Riwayat Pendaftaran Relawan Saya</a>
                            </li>
                                                                        </ul>
                            </ul>
                    <ul id="tocify-header-pencairan-dana" class="tocify-header">
                <li class="tocify-item level-1" data-unique="pencairan-dana">
                    <a href="#pencairan-dana">Pencairan Dana</a>
                </li>
                                    <ul id="tocify-subheader-pencairan-dana" class="tocify-subheader">
                                                    <li class="tocify-item level-2" data-unique="pencairan-dana-POSTapi-campaigns--id--disbursements">
                                <a href="#pencairan-dana-POSTapi-campaigns--id--disbursements">Ajukan Pencairan Dana (Inisiator)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="pencairan-dana-GETapi-campaigns--id--disbursements">
                                <a href="#pencairan-dana-GETapi-campaigns--id--disbursements">Riwayat Pencairan Kampanye (Inisiator)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="pencairan-dana-PATCHapi-admin-disbursements--id--status">
                                <a href="#pencairan-dana-PATCHapi-admin-disbursements--id--status">Setujui / Tolak Pencairan Dana (Admin, ACID)</a>
                            </li>
                                                                        </ul>
                            </ul>
                    <ul id="tocify-header-laporan-aduan" class="tocify-header">
                <li class="tocify-item level-1" data-unique="laporan-aduan">
                    <a href="#laporan-aduan">Laporan Aduan</a>
                </li>
                                    <ul id="tocify-subheader-laporan-aduan" class="tocify-subheader">
                                                    <li class="tocify-item level-2" data-unique="laporan-aduan-POSTapi-campaigns--id--reports">
                                <a href="#laporan-aduan-POSTapi-campaigns--id--reports">Kirim Laporan Aduan Kampanye</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="laporan-aduan-GETapi-admin-reports">
                                <a href="#laporan-aduan-GETapi-admin-reports">Daftar Laporan Aduan (Admin)</a>
                            </li>
                                                                        </ul>
                            </ul>
                    <ul id="tocify-header-administrator" class="tocify-header">
                <li class="tocify-item level-1" data-unique="administrator">
                    <a href="#administrator">Administrator</a>
                </li>
                                    <ul id="tocify-subheader-administrator" class="tocify-subheader">
                                                    <li class="tocify-item level-2" data-unique="administrator-GETapi-admin-campaigns">
                                <a href="#administrator-GETapi-admin-campaigns">Semua Kampanye (Moderasi Admin)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="administrator-PATCHapi-admin-campaigns--id--status">
                                <a href="#administrator-PATCHapi-admin-campaigns--id--status">Ubah Status Kampanye (Admin)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="administrator-GETapi-admin-users">
                                <a href="#administrator-GETapi-admin-users">Daftar Pengguna (Admin)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="administrator-PATCHapi-admin-users--id--verify">
                                <a href="#administrator-PATCHapi-admin-users--id--verify">Verifikasi Pengguna / Inisiator (Admin)</a>
                            </li>
                                                                        </ul>
                            </ul>
                    <ul id="tocify-header-laporan-pertanggungjawaban-lpj" class="tocify-header">
                <li class="tocify-item level-1" data-unique="laporan-pertanggungjawaban-lpj">
                    <a href="#laporan-pertanggungjawaban-lpj">Laporan Pertanggungjawaban (LPJ)</a>
                </li>
                                    <ul id="tocify-subheader-laporan-pertanggungjawaban-lpj" class="tocify-subheader">
                                                    <li class="tocify-item level-2" data-unique="laporan-pertanggungjawaban-lpj-GETapi-campaigns--id--lpj">
                                <a href="#laporan-pertanggungjawaban-lpj-GETapi-campaigns--id--lpj">Daftar LPJ Publik Suatu Kampanye</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="laporan-pertanggungjawaban-lpj-GETapi-admin-lpj">
                                <a href="#laporan-pertanggungjawaban-lpj-GETapi-admin-lpj">Daftar Seluruh LPJ untuk Audit Admin</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="laporan-pertanggungjawaban-lpj-PATCHapi-admin-lpj--id--status">
                                <a href="#laporan-pertanggungjawaban-lpj-PATCHapi-admin-lpj--id--status">Ubah Status LPJ oleh Admin (Verifikasi Sah / Batal)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="laporan-pertanggungjawaban-lpj-PATCHapi-admin-lpj--id--verify">
                                <a href="#laporan-pertanggungjawaban-lpj-PATCHapi-admin-lpj--id--verify">Verifikasi Sah LPJ (Admin Shortcut)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="laporan-pertanggungjawaban-lpj-PATCHapi-admin-lpj--id--unverify">
                                <a href="#laporan-pertanggungjawaban-lpj-PATCHapi-admin-lpj--id--unverify">Batalkan Verifikasi LPJ (Admin Shortcut)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="laporan-pertanggungjawaban-lpj-POSTapi-campaigns--id--lpj">
                                <a href="#laporan-pertanggungjawaban-lpj-POSTapi-campaigns--id--lpj">Upload LPJ Baru (Inisiator, FR-12)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="laporan-pertanggungjawaban-lpj-PUTapi-campaigns--campaign_id--lpj--id-">
                                <a href="#laporan-pertanggungjawaban-lpj-PUTapi-campaigns--campaign_id--lpj--id-">Update LPJ (Inisiator)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="laporan-pertanggungjawaban-lpj-PATCHapi-campaigns--campaign_id--lpj--id-">
                                <a href="#laporan-pertanggungjawaban-lpj-PATCHapi-campaigns--campaign_id--lpj--id-">Update LPJ (Inisiator)</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="laporan-pertanggungjawaban-lpj-DELETEapi-campaigns--campaign_id--lpj--id-">
                                <a href="#laporan-pertanggungjawaban-lpj-DELETEapi-campaigns--campaign_id--lpj--id-">Hapus LPJ (Inisiator)</a>
                            </li>
                                                                        </ul>
                            </ul>
            </div>

    <ul class="toc-footer" id="toc-footer">
                    <li style="padding-bottom: 5px;"><a href="{{ route("scribe.postman") }}">View Postman collection</a></li>
                            <li style="padding-bottom: 5px;"><a href="{{ route("scribe.openapi") }}">View OpenAPI spec</a></li>
                <li><a href="http://github.com/knuckleswtf/scribe">Documentation powered by Scribe ✍</a></li>
    </ul>

    <ul class="toc-footer" id="last-updated">
        <li>Last updated: 29 October 2026</li>
    </ul>
</div>

<div class="page-wrapper">
    <div class="dark-box"></div>
    <div class="content">
        <h1 id="introduction">Introduction</h1>
<p>RESTful API untuk platform Donasi &amp; Kerelawanan ActGiving. Mendukung 3 aktor: Administrator, User Terdaftar (Inisiator / Relawan), dan Donatur Tamu (Guest Checkout).</p>
<aside>
    <strong>Base URL</strong>: <code>http://localhost:8000</code>
</aside>
<pre><code>Selamat datang di dokumentasi interaktif API **ActGiving**.

**Autentikasi:** Sebagian besar endpoint memerlukan token Bearer (Laravel Sanctum).
Untuk mendapatkan token, gunakan endpoint `POST /api/auth/login` atau `POST /api/auth/register`.
Kemudian klik tombol **Authorize** di atas dan masukkan token dengan format: `Bearer {token_anda}`.

&lt;aside&gt;Anda dapat langsung mencoba setiap endpoint dari halaman ini menggunakan tombol &lt;b&gt;Try it out&lt;/b&gt; tanpa perlu aplikasi Postman.&lt;/aside&gt;</code></pre>

        <h1 id="authenticating-requests">Authenticating requests</h1>
<p>To authenticate requests, include an <strong><code>Authorization</code></strong> header with the value <strong><code>"Bearer {YOUR_BEARER_TOKEN}"</code></strong>.</p>
<p>All authenticated endpoints are marked with a <code>requires authentication</code> badge in the documentation below.</p>
<p>Dapatkan token dengan memanggil endpoint <code>POST /api/auth/login</code>. Salin nilai dari field <code>data.token</code> di respons, lalu klik tombol <b>Authorize</b> di atas dan masukkan nilainya.</p>

        <h1 id="authentication">Authentication</h1>

    <p>Endpoint untuk registrasi, login, logout, dan reset kata sandi.</p>

                                <h2 id="authentication-POSTapi-auth-register">Register User Baru</h2>

<p>
</p>

<p>Membuat akun baru. Akun dapat berfungsi sebagai Inisiator kampanye maupun Relawan.</p>

<span id="example-requests-POSTapi-auth-register">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost:8000/api/auth/register" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"name\": \"b\",
    \"email\": \"zbailey@example.net\",
    \"password\": \"-0pBNvYgxw\",
    \"phone_whatsapp\": \"aykcmyuwpwlvqwrs\",
    \"city_domicile\": \"i\",
    \"identity_doc_url\": \"http:\\/\\/fritsch.com\\/autem-et-consequatur-aut-dolores-enim-non-facere-tempora\"
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/auth/register"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "name": "b",
    "email": "zbailey@example.net",
    "password": "-0pBNvYgxw",
    "phone_whatsapp": "aykcmyuwpwlvqwrs",
    "city_domicile": "i",
    "identity_doc_url": "http:\/\/fritsch.com\/autem-et-consequatur-aut-dolores-enim-non-facere-tempora"
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/auth/register';
$response = $client-&gt;post(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'name' =&gt; 'b',
            'email' =&gt; 'zbailey@example.net',
            'password' =&gt; '-0pBNvYgxw',
            'phone_whatsapp' =&gt; 'aykcmyuwpwlvqwrs',
            'city_domicile' =&gt; 'i',
            'identity_doc_url' =&gt; 'http://fritsch.com/autem-et-consequatur-aut-dolores-enim-non-facere-tempora',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-POSTapi-auth-register">
</span>
<span id="execution-results-POSTapi-auth-register" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-auth-register"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-auth-register"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-auth-register" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-auth-register">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-auth-register" data-method="POST"
      data-path="api/auth/register"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-auth-register', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-auth-register"
                    onclick="tryItOut('POSTapi-auth-register');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-auth-register"
                    onclick="cancelTryOut('POSTapi-auth-register');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-auth-register"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/auth/register</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-auth-register"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-auth-register"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>name</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="name"                data-endpoint="POSTapi-auth-register"
               value="b"
               data-component="body">
    <br>
<p>Must not be greater than 255 characters. Example: <code>b</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>email</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="email"                data-endpoint="POSTapi-auth-register"
               value="zbailey@example.net"
               data-component="body">
    <br>
<p>Must be a valid email address. Must not be greater than 255 characters. Example: <code>zbailey@example.net</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>password</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="password"                data-endpoint="POSTapi-auth-register"
               value="-0pBNvYgxw"
               data-component="body">
    <br>
<p>Must be at least 8 characters. Example: <code>-0pBNvYgxw</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>phone_whatsapp</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="phone_whatsapp"                data-endpoint="POSTapi-auth-register"
               value="aykcmyuwpwlvqwrs"
               data-component="body">
    <br>
<p>Must not be greater than 20 characters. Example: <code>aykcmyuwpwlvqwrs</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>city_domicile</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="city_domicile"                data-endpoint="POSTapi-auth-register"
               value="i"
               data-component="body">
    <br>
<p>Must not be greater than 100 characters. Example: <code>i</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>identity_doc_url</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="identity_doc_url"                data-endpoint="POSTapi-auth-register"
               value="http://fritsch.com/autem-et-consequatur-aut-dolores-enim-non-facere-tempora"
               data-component="body">
    <br>
<p>Must be a valid URL. Example: <code>http://fritsch.com/autem-et-consequatur-aut-dolores-enim-non-facere-tempora</code></p>
        </div>
        </form>

                    <h2 id="authentication-POSTapi-auth-login">Login Pengguna &amp; Penerbitan Token Sanctum.</h2>

<p>
</p>



<span id="example-requests-POSTapi-auth-login">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost:8000/api/auth/login" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"email\": \"gbailey@example.net\",
    \"password\": \"|]|{+-\"
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/auth/login"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "email": "gbailey@example.net",
    "password": "|]|{+-"
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/auth/login';
$response = $client-&gt;post(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'email' =&gt; 'gbailey@example.net',
            'password' =&gt; '|]|{+-',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-POSTapi-auth-login">
</span>
<span id="execution-results-POSTapi-auth-login" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-auth-login"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-auth-login"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-auth-login" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-auth-login">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-auth-login" data-method="POST"
      data-path="api/auth/login"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-auth-login', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-auth-login"
                    onclick="tryItOut('POSTapi-auth-login');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-auth-login"
                    onclick="cancelTryOut('POSTapi-auth-login');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-auth-login"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/auth/login</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-auth-login"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-auth-login"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>email</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="email"                data-endpoint="POSTapi-auth-login"
               value="gbailey@example.net"
               data-component="body">
    <br>
<p>Must be a valid email address. Example: <code>gbailey@example.net</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>password</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="password"                data-endpoint="POSTapi-auth-login"
               value="|]|{+-"
               data-component="body">
    <br>
<p>Example: <code>|]|{+-</code></p>
        </div>
        </form>

                    <h2 id="authentication-POSTapi-auth-forgot-password">FR-05: Lupa Kata Sandi (Generate Token Reset Password - Kadaluwarsa 60 Menit).</h2>

<p>
</p>



<span id="example-requests-POSTapi-auth-forgot-password">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost:8000/api/auth/forgot-password" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"email\": \"gbailey@example.net\"
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/auth/forgot-password"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "email": "gbailey@example.net"
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/auth/forgot-password';
$response = $client-&gt;post(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'email' =&gt; 'gbailey@example.net',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-POSTapi-auth-forgot-password">
</span>
<span id="execution-results-POSTapi-auth-forgot-password" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-auth-forgot-password"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-auth-forgot-password"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-auth-forgot-password" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-auth-forgot-password">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-auth-forgot-password" data-method="POST"
      data-path="api/auth/forgot-password"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-auth-forgot-password', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-auth-forgot-password"
                    onclick="tryItOut('POSTapi-auth-forgot-password');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-auth-forgot-password"
                    onclick="cancelTryOut('POSTapi-auth-forgot-password');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-auth-forgot-password"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/auth/forgot-password</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-auth-forgot-password"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-auth-forgot-password"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>email</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="email"                data-endpoint="POSTapi-auth-forgot-password"
               value="gbailey@example.net"
               data-component="body">
    <br>
<p>Must be a valid email address. Must match an existing stored value. Example: <code>gbailey@example.net</code></p>
        </div>
        </form>

                    <h2 id="authentication-POSTapi-auth-reset-password">FR-05: Reset Kata Sandi Menggunakan Token.</h2>

<p>
</p>



<span id="example-requests-POSTapi-auth-reset-password">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost:8000/api/auth/reset-password" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"email\": \"gbailey@example.net\",
    \"token\": \"architecto\",
    \"password\": \"]|{+-0pBNvYg\"
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/auth/reset-password"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "email": "gbailey@example.net",
    "token": "architecto",
    "password": "]|{+-0pBNvYg"
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/auth/reset-password';
$response = $client-&gt;post(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'email' =&gt; 'gbailey@example.net',
            'token' =&gt; 'architecto',
            'password' =&gt; ']|{+-0pBNvYg',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-POSTapi-auth-reset-password">
</span>
<span id="execution-results-POSTapi-auth-reset-password" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-auth-reset-password"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-auth-reset-password"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-auth-reset-password" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-auth-reset-password">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-auth-reset-password" data-method="POST"
      data-path="api/auth/reset-password"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-auth-reset-password', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-auth-reset-password"
                    onclick="tryItOut('POSTapi-auth-reset-password');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-auth-reset-password"
                    onclick="cancelTryOut('POSTapi-auth-reset-password');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-auth-reset-password"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/auth/reset-password</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-auth-reset-password"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-auth-reset-password"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>email</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="email"                data-endpoint="POSTapi-auth-reset-password"
               value="gbailey@example.net"
               data-component="body">
    <br>
<p>Must be a valid email address. Must match an existing stored value. Example: <code>gbailey@example.net</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>token</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="token"                data-endpoint="POSTapi-auth-reset-password"
               value="architecto"
               data-component="body">
    <br>
<p>Example: <code>architecto</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>password</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="password"                data-endpoint="POSTapi-auth-reset-password"
               value="]|{+-0pBNvYg"
               data-component="body">
    <br>
<p>Must be at least 8 characters. Example: <code>]|{+-0pBNvYg</code></p>
        </div>
        </form>

                    <h2 id="authentication-GETapi-auth-me">Dapatkan Profil User yang Sedang Login.</h2>

<p>
</p>



<span id="example-requests-GETapi-auth-me">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/auth/me" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/auth/me"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/auth/me';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-auth-me">
            <blockquote>
            <p>Example response (401):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;message&quot;: &quot;Unauthenticated.&quot;
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-auth-me" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-auth-me"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-auth-me"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-auth-me" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-auth-me">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-auth-me" data-method="GET"
      data-path="api/auth/me"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-auth-me', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-auth-me"
                    onclick="tryItOut('GETapi-auth-me');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-auth-me"
                    onclick="cancelTryOut('GETapi-auth-me');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-auth-me"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/auth/me</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-auth-me"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-auth-me"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                    <h2 id="authentication-POSTapi-auth-logout">Logout &amp; Revoke Token Sanctum.</h2>

<p>
</p>



<span id="example-requests-POSTapi-auth-logout">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost:8000/api/auth/logout" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/auth/logout"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "POST",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/auth/logout';
$response = $client-&gt;post(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-POSTapi-auth-logout">
</span>
<span id="execution-results-POSTapi-auth-logout" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-auth-logout"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-auth-logout"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-auth-logout" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-auth-logout">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-auth-logout" data-method="POST"
      data-path="api/auth/logout"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-auth-logout', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-auth-logout"
                    onclick="tryItOut('POSTapi-auth-logout');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-auth-logout"
                    onclick="cancelTryOut('POSTapi-auth-logout');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-auth-logout"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/auth/logout</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-auth-logout"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-auth-logout"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                <h1 id="kampanye-publik">Kampanye Publik</h1>

    <p>Endpoint untuk menelusuri dan mengelola kampanye donasi &amp; kerelawanan.</p>

                                <h2 id="kampanye-publik-GETapi-campaigns">Daftar Kampanye Aktif</h2>

<p>
</p>

<p>Menampilkan daftar kampanye publik (Hanya status 'active').
Mendukung filter: category_id, campaign_mode, search query.</p>

<span id="example-requests-GETapi-campaigns">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/campaigns" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/campaigns"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/campaigns';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-campaigns">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;success&quot;: true,
    &quot;data&quot;: {
        &quot;current_page&quot;: 1,
        &quot;data&quot;: [
            {
                &quot;id&quot;: 10,
                &quot;user_id&quot;: 2,
                &quot;category_id&quot;: 1,
                &quot;title&quot;: &quot;Uji Coba Moderasi Kampanye Baru 1792862057985&quot;,
                &quot;description&quot;: &quot;Deskripsi lengkap uji coba kampanye baru agar masuk ke antrean moderasi admin.&quot;,
                &quot;target_amount&quot;: &quot;10000000.00&quot;,
                &quot;current_amount&quot;: &quot;0.00&quot;,
                &quot;target_volunteers&quot;: 5,
                &quot;current_volunteers&quot;: 0,
                &quot;location&quot;: &quot;Bandung, Jawa Barat&quot;,
                &quot;activity_date&quot;: null,
                &quot;status&quot;: &quot;active&quot;,
                &quot;campaign_mode&quot;: &quot;both&quot;,
                &quot;created_at&quot;: &quot;2026-10-24T17:14:18.000000Z&quot;,
                &quot;updated_at&quot;: &quot;2026-10-25T11:45:13.000000Z&quot;,
                &quot;image_url&quot;: null,
                &quot;category&quot;: {
                    &quot;id&quot;: 1,
                    &quot;category_name&quot;: &quot;Bencana Alam&quot;
                },
                &quot;user&quot;: {
                    &quot;id&quot;: 2,
                    &quot;name&quot;: &quot;Yayasan Peduli Bersama&quot;,
                    &quot;is_verified&quot;: true
                },
                &quot;lpj_reports&quot;: []
            },
            {
                &quot;id&quot;: 2,
                &quot;user_id&quot;: 4,
                &quot;category_id&quot;: 1,
                &quot;title&quot;: &quot;Bantuan Darurat Medis &amp; Masker untuk Korban Kabut Asap Karhutla Kalimantan&quot;,
                &quot;description&quot;: &quot;Kebakaran hutan dan lahan (Karhutla) di Kalimantan semakin meluas, menyebabkan kabut asap pekat yang menyelimuti pemukiman. Jarak pandang menurun drastis dan ribuan warga, terutama balita dan lansia, mulai berjatuhan sakit akibat ISPA (Infeksi Saluran Pernapasan Akut). Kami sangat membutuhkan dana darurat untuk pengadaan masker N95, tabung oksigen portabel, obat-obatan pernapasan, dan vitamin. Kami juga memanggil relawan untuk turun langsung membantu evakuasi warga rentan dan mendistribusikan bantuan medis dari rumah ke rumah. Mari bergerak cepat selamatkan napas saudara kita!&quot;,
                &quot;target_amount&quot;: &quot;10000000.00&quot;,
                &quot;current_amount&quot;: &quot;10010000.00&quot;,
                &quot;target_volunteers&quot;: 20,
                &quot;current_volunteers&quot;: 1,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;,
                &quot;activity_date&quot;: &quot;2026-10-29T00:00:00.000000Z&quot;,
                &quot;status&quot;: &quot;active&quot;,
                &quot;campaign_mode&quot;: &quot;both&quot;,
                &quot;created_at&quot;: &quot;2026-10-21T16:43:14.000000Z&quot;,
                &quot;updated_at&quot;: &quot;2026-10-28T13:50:11.000000Z&quot;,
                &quot;image_url&quot;: &quot;http://127.0.0.1:8000/storage/campaigns/ff131484-5b78-4db8-a1f9-beb8cac09a76_1792647116.jpeg&quot;,
                &quot;category&quot;: {
                    &quot;id&quot;: 1,
                    &quot;category_name&quot;: &quot;Bencana Alam&quot;
                },
                &quot;user&quot;: {
                    &quot;id&quot;: 4,
                    &quot;name&quot;: &quot;fadhilah azzahra&quot;,
                    &quot;is_verified&quot;: false
                },
                &quot;lpj_reports&quot;: []
            },
            {
                &quot;id&quot;: 1,
                &quot;user_id&quot;: 2,
                &quot;category_id&quot;: 1,
                &quot;title&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
                &quot;description&quot;: &quot;Penyaluran logistik darurat, masker, makanan siap saji, dan posko medis untuk warga terdampak erupsi Semeru.&quot;,
                &quot;target_amount&quot;: &quot;50000000.00&quot;,
                &quot;current_amount&quot;: &quot;15575000.00&quot;,
                &quot;target_volunteers&quot;: 10,
                &quot;current_volunteers&quot;: 4,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;,
                &quot;activity_date&quot;: &quot;2026-10-28T00:00:00.000000Z&quot;,
                &quot;status&quot;: &quot;active&quot;,
                &quot;campaign_mode&quot;: &quot;both&quot;,
                &quot;created_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;,
                &quot;updated_at&quot;: &quot;2026-10-24T17:15:28.000000Z&quot;,
                &quot;image_url&quot;: null,
                &quot;category&quot;: {
                    &quot;id&quot;: 1,
                    &quot;category_name&quot;: &quot;Bencana Alam&quot;
                },
                &quot;user&quot;: {
                    &quot;id&quot;: 2,
                    &quot;name&quot;: &quot;Yayasan Peduli Bersama&quot;,
                    &quot;is_verified&quot;: true
                },
                &quot;lpj_reports&quot;: []
            }
        ],
        &quot;first_page_url&quot;: &quot;http://localhost:8000/api/campaigns?page=1&quot;,
        &quot;from&quot;: 1,
        &quot;last_page&quot;: 1,
        &quot;last_page_url&quot;: &quot;http://localhost:8000/api/campaigns?page=1&quot;,
        &quot;links&quot;: [
            {
                &quot;url&quot;: null,
                &quot;label&quot;: &quot;&amp;laquo; Previous&quot;,
                &quot;page&quot;: null,
                &quot;active&quot;: false
            },
            {
                &quot;url&quot;: &quot;http://localhost:8000/api/campaigns?page=1&quot;,
                &quot;label&quot;: &quot;1&quot;,
                &quot;page&quot;: 1,
                &quot;active&quot;: true
            },
            {
                &quot;url&quot;: null,
                &quot;label&quot;: &quot;Next &amp;raquo;&quot;,
                &quot;page&quot;: null,
                &quot;active&quot;: false
            }
        ],
        &quot;next_page_url&quot;: null,
        &quot;path&quot;: &quot;http://localhost:8000/api/campaigns&quot;,
        &quot;per_page&quot;: 10,
        &quot;prev_page_url&quot;: null,
        &quot;to&quot;: 3,
        &quot;total&quot;: 3
    }
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-campaigns" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-campaigns"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-campaigns"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-campaigns" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-campaigns">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-campaigns" data-method="GET"
      data-path="api/campaigns"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-campaigns', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-campaigns"
                    onclick="tryItOut('GETapi-campaigns');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-campaigns"
                    onclick="cancelTryOut('GETapi-campaigns');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-campaigns"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/campaigns</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-campaigns"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-campaigns"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                    <h2 id="kampanye-publik-GETapi-campaigns--id-">Detail Kampanye</h2>

<p>
</p>

<p>Menampilkan detail kampanye publik beserta inisiator, kategori, &amp; LPJ.</p>

<span id="example-requests-GETapi-campaigns--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/campaigns/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/campaigns/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/campaigns/1';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-campaigns--id-">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;success&quot;: true,
    &quot;data&quot;: {
        &quot;id&quot;: 1,
        &quot;user_id&quot;: 2,
        &quot;category_id&quot;: 1,
        &quot;title&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
        &quot;description&quot;: &quot;Penyaluran logistik darurat, masker, makanan siap saji, dan posko medis untuk warga terdampak erupsi Semeru.&quot;,
        &quot;target_amount&quot;: &quot;50000000.00&quot;,
        &quot;current_amount&quot;: &quot;15575000.00&quot;,
        &quot;target_volunteers&quot;: 10,
        &quot;current_volunteers&quot;: 4,
        &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;,
        &quot;activity_date&quot;: &quot;2026-10-28T00:00:00.000000Z&quot;,
        &quot;status&quot;: &quot;active&quot;,
        &quot;campaign_mode&quot;: &quot;both&quot;,
        &quot;created_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;,
        &quot;updated_at&quot;: &quot;2026-10-24T17:15:28.000000Z&quot;,
        &quot;image_url&quot;: null,
        &quot;total_donors&quot;: 4,
        &quot;approved_volunteers_count&quot;: 0,
        &quot;category&quot;: {
            &quot;id&quot;: 1,
            &quot;category_name&quot;: &quot;Bencana Alam&quot;
        },
        &quot;user&quot;: {
            &quot;id&quot;: 2,
            &quot;name&quot;: &quot;Yayasan Peduli Bersama&quot;,
            &quot;city_domicile&quot;: &quot;Bandung&quot;,
            &quot;is_verified&quot;: true
        },
        &quot;lpj_reports&quot;: []
    }
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-campaigns--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-campaigns--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-campaigns--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-campaigns--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-campaigns--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-campaigns--id-" data-method="GET"
      data-path="api/campaigns/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-campaigns--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-campaigns--id-"
                    onclick="tryItOut('GETapi-campaigns--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-campaigns--id-"
                    onclick="cancelTryOut('GETapi-campaigns--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-campaigns--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/campaigns/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-campaigns--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-campaigns--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="GETapi-campaigns--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the campaign. Example: <code>1</code></p>
            </div>
                    </form>

                    <h2 id="kampanye-publik-POSTapi-campaigns">Buat Kampanye Baru (Inisiator)</h2>

<p>
</p>

<p>Inisiator: Membuat pengajuan kampanye baru (status awal: 'pending').</p>

<span id="example-requests-POSTapi-campaigns">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost:8000/api/campaigns" \
    --header "Content-Type: multipart/form-data" \
    --header "Accept: application/json" \
    --form "category_id=architecto"\
    --form "title=n"\
    --form "description=Eius et animi quos velit et."\
    --form "campaign_mode=both"\
    --form "target_amount=60"\
    --form "target_volunteers=42"\
    --form "location=l"\
    --form "activity_date=2026-10-29T00:19:24"\
    --form "image=@C:\Users\ASUS\AppData\Local\Temp\php5135.tmp" </code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/campaigns"
);

const headers = {
    "Content-Type": "multipart/form-data",
    "Accept": "application/json",
};

const body = new FormData();
body.append('category_id', 'architecto');
body.append('title', 'n');
body.append('description', 'Eius et animi quos velit et.');
body.append('campaign_mode', 'both');
body.append('target_amount', '60');
body.append('target_volunteers', '42');
body.append('location', 'l');
body.append('activity_date', '2026-10-29T00:19:24');
body.append('image', document.querySelector('input[name="image"]').files[0]);

fetch(url, {
    method: "POST",
    headers,
    body,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/campaigns';
$response = $client-&gt;post(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'multipart/form-data',
            'Accept' =&gt; 'application/json',
        ],
        'multipart' =&gt; [
            [
                'name' =&gt; 'category_id',
                'contents' =&gt; 'architecto'
            ],
            [
                'name' =&gt; 'title',
                'contents' =&gt; 'n'
            ],
            [
                'name' =&gt; 'description',
                'contents' =&gt; 'Eius et animi quos velit et.'
            ],
            [
                'name' =&gt; 'campaign_mode',
                'contents' =&gt; 'both'
            ],
            [
                'name' =&gt; 'target_amount',
                'contents' =&gt; '60'
            ],
            [
                'name' =&gt; 'target_volunteers',
                'contents' =&gt; '42'
            ],
            [
                'name' =&gt; 'location',
                'contents' =&gt; 'l'
            ],
            [
                'name' =&gt; 'activity_date',
                'contents' =&gt; '2026-10-29T00:19:24'
            ],
            [
                'name' =&gt; 'image',
                'contents' =&gt; fopen('C:\Users\ASUS\AppData\Local\Temp\php5135.tmp', 'r')
            ],
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-POSTapi-campaigns">
</span>
<span id="execution-results-POSTapi-campaigns" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-campaigns"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-campaigns"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-campaigns" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-campaigns">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-campaigns" data-method="POST"
      data-path="api/campaigns"
      data-authed="0"
      data-hasfiles="1"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-campaigns', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-campaigns"
                    onclick="tryItOut('POSTapi-campaigns');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-campaigns"
                    onclick="cancelTryOut('POSTapi-campaigns');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-campaigns"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/campaigns</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-campaigns"
               value="multipart/form-data"
               data-component="header">
    <br>
<p>Example: <code>multipart/form-data</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-campaigns"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>category_id</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="category_id"                data-endpoint="POSTapi-campaigns"
               value="architecto"
               data-component="body">
    <br>
<p>Must match an existing stored value. Example: <code>architecto</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>title</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="title"                data-endpoint="POSTapi-campaigns"
               value="n"
               data-component="body">
    <br>
<p>Must not be greater than 255 characters. Example: <code>n</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>description</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="description"                data-endpoint="POSTapi-campaigns"
               value="Eius et animi quos velit et."
               data-component="body">
    <br>
<p>Example: <code>Eius et animi quos velit et.</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>campaign_mode</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="campaign_mode"                data-endpoint="POSTapi-campaigns"
               value="both"
               data-component="body">
    <br>
<p>Example: <code>both</code></p>
Must be one of:
<ul style="list-style-type: square;"><li><code>fund_only</code></li> <li><code>volunteer_only</code></li> <li><code>both</code></li></ul>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>target_amount</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="target_amount"                data-endpoint="POSTapi-campaigns"
               value="60"
               data-component="body">
    <br>
<p>This field is required when <code>campaign_mode</code> is <code>fund_only</code> or <code>both</code>. Must be at least 0. Example: <code>60</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>target_volunteers</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="target_volunteers"                data-endpoint="POSTapi-campaigns"
               value="42"
               data-component="body">
    <br>
<p>This field is required when <code>campaign_mode</code> is <code>volunteer_only</code> or <code>both</code>. Must be at least 0. Example: <code>42</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>location</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="location"                data-endpoint="POSTapi-campaigns"
               value="l"
               data-component="body">
    <br>
<p>Must not be greater than 255 characters. Example: <code>l</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>activity_date</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="activity_date"                data-endpoint="POSTapi-campaigns"
               value="2026-10-29T00:19:24"
               data-component="body">
    <br>
<p>Must be a valid date. Example: <code>2026-10-29T00:19:24</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>image</code></b>&nbsp;&nbsp;
<small>file</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="file" style="display: none"
                              name="image"                data-endpoint="POSTapi-campaigns"
               value=""
               data-component="body">
    <br>
<p>Must be an image. Must not be greater than 5120 kilobytes. Example: <code>C:\Users\ASUS\AppData\Local\Temp\php5135.tmp</code></p>
        </div>
        </form>

                    <h2 id="kampanye-publik-GETapi-my-campaigns">Kampanye Saya (Inisiator)</h2>

<p>
</p>

<p>Inisiator: Melihat daftar kampanye miliknya sendiri.</p>

<span id="example-requests-GETapi-my-campaigns">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/my-campaigns" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/my-campaigns"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/my-campaigns';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-my-campaigns">
            <blockquote>
            <p>Example response (401):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;message&quot;: &quot;Unauthenticated.&quot;
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-my-campaigns" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-my-campaigns"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-my-campaigns"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-my-campaigns" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-my-campaigns">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-my-campaigns" data-method="GET"
      data-path="api/my-campaigns"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-my-campaigns', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-my-campaigns"
                    onclick="tryItOut('GETapi-my-campaigns');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-my-campaigns"
                    onclick="cancelTryOut('GETapi-my-campaigns');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-my-campaigns"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/my-campaigns</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-my-campaigns"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-my-campaigns"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                    <h2 id="kampanye-publik-PUTapi-campaigns--id-">Update Data Kampanye (Inisiator)</h2>

<p>
</p>

<p>Inisiator: Memperbarui data kampanye miliknya sendiri.</p>

<span id="example-requests-PUTapi-campaigns--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request PUT \
    "http://localhost:8000/api/campaigns/1" \
    --header "Content-Type: multipart/form-data" \
    --header "Accept: application/json" \
    --form "title=b"\
    --form "description=Eius et animi quos velit et."\
    --form "campaign_mode=volunteer_only"\
    --form "location=v"\
    --form "activity_date=2026-10-29T00:19:24"\
    --form "target_amount=42"\
    --form "target_volunteers=37"\
    --form "image=@C:\Users\ASUS\AppData\Local\Temp\php5155.tmp" </code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/campaigns/1"
);

const headers = {
    "Content-Type": "multipart/form-data",
    "Accept": "application/json",
};

const body = new FormData();
body.append('title', 'b');
body.append('description', 'Eius et animi quos velit et.');
body.append('campaign_mode', 'volunteer_only');
body.append('location', 'v');
body.append('activity_date', '2026-10-29T00:19:24');
body.append('target_amount', '42');
body.append('target_volunteers', '37');
body.append('image', document.querySelector('input[name="image"]').files[0]);

fetch(url, {
    method: "PUT",
    headers,
    body,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/campaigns/1';
$response = $client-&gt;put(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'multipart/form-data',
            'Accept' =&gt; 'application/json',
        ],
        'multipart' =&gt; [
            [
                'name' =&gt; 'title',
                'contents' =&gt; 'b'
            ],
            [
                'name' =&gt; 'description',
                'contents' =&gt; 'Eius et animi quos velit et.'
            ],
            [
                'name' =&gt; 'campaign_mode',
                'contents' =&gt; 'volunteer_only'
            ],
            [
                'name' =&gt; 'location',
                'contents' =&gt; 'v'
            ],
            [
                'name' =&gt; 'activity_date',
                'contents' =&gt; '2026-10-29T00:19:24'
            ],
            [
                'name' =&gt; 'target_amount',
                'contents' =&gt; '42'
            ],
            [
                'name' =&gt; 'target_volunteers',
                'contents' =&gt; '37'
            ],
            [
                'name' =&gt; 'image',
                'contents' =&gt; fopen('C:\Users\ASUS\AppData\Local\Temp\php5155.tmp', 'r')
            ],
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-PUTapi-campaigns--id-">
</span>
<span id="execution-results-PUTapi-campaigns--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-PUTapi-campaigns--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-PUTapi-campaigns--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-PUTapi-campaigns--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-PUTapi-campaigns--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-PUTapi-campaigns--id-" data-method="PUT"
      data-path="api/campaigns/{id}"
      data-authed="0"
      data-hasfiles="1"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('PUTapi-campaigns--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-PUTapi-campaigns--id-"
                    onclick="tryItOut('PUTapi-campaigns--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-PUTapi-campaigns--id-"
                    onclick="cancelTryOut('PUTapi-campaigns--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-PUTapi-campaigns--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-darkblue">PUT</small>
            <b><code>api/campaigns/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="PUTapi-campaigns--id-"
               value="multipart/form-data"
               data-component="header">
    <br>
<p>Example: <code>multipart/form-data</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="PUTapi-campaigns--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="PUTapi-campaigns--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the campaign. Example: <code>1</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>category_id</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="category_id"                data-endpoint="PUTapi-campaigns--id-"
               value=""
               data-component="body">
    <br>
<p>Must match an existing stored value.</p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>title</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="title"                data-endpoint="PUTapi-campaigns--id-"
               value="b"
               data-component="body">
    <br>
<p>Must not be greater than 255 characters. Example: <code>b</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>description</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="description"                data-endpoint="PUTapi-campaigns--id-"
               value="Eius et animi quos velit et."
               data-component="body">
    <br>
<p>Example: <code>Eius et animi quos velit et.</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>campaign_mode</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="campaign_mode"                data-endpoint="PUTapi-campaigns--id-"
               value="volunteer_only"
               data-component="body">
    <br>
<p>Example: <code>volunteer_only</code></p>
Must be one of:
<ul style="list-style-type: square;"><li><code>fund_only</code></li> <li><code>volunteer_only</code></li> <li><code>both</code></li></ul>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>location</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="location"                data-endpoint="PUTapi-campaigns--id-"
               value="v"
               data-component="body">
    <br>
<p>Must not be greater than 255 characters. Example: <code>v</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>activity_date</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="activity_date"                data-endpoint="PUTapi-campaigns--id-"
               value="2026-10-29T00:19:24"
               data-component="body">
    <br>
<p>Must be a valid date. Example: <code>2026-10-29T00:19:24</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>target_amount</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="target_amount"                data-endpoint="PUTapi-campaigns--id-"
               value="42"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>42</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>target_volunteers</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="target_volunteers"                data-endpoint="PUTapi-campaigns--id-"
               value="37"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>37</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>image</code></b>&nbsp;&nbsp;
<small>file</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="file" style="display: none"
                              name="image"                data-endpoint="PUTapi-campaigns--id-"
               value=""
               data-component="body">
    <br>
<p>Must be an image. Must not be greater than 5120 kilobytes. Example: <code>C:\Users\ASUS\AppData\Local\Temp\php5155.tmp</code></p>
        </div>
        </form>

                    <h2 id="kampanye-publik-DELETEapi-campaigns--id-">Hapus Kampanye (Inisiator)</h2>

<p>
</p>



<span id="example-requests-DELETEapi-campaigns--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request DELETE \
    "http://localhost:8000/api/campaigns/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/campaigns/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "DELETE",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/campaigns/1';
$response = $client-&gt;delete(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-DELETEapi-campaigns--id-">
</span>
<span id="execution-results-DELETEapi-campaigns--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-DELETEapi-campaigns--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-DELETEapi-campaigns--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-DELETEapi-campaigns--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-DELETEapi-campaigns--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-DELETEapi-campaigns--id-" data-method="DELETE"
      data-path="api/campaigns/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('DELETEapi-campaigns--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-DELETEapi-campaigns--id-"
                    onclick="tryItOut('DELETEapi-campaigns--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-DELETEapi-campaigns--id-"
                    onclick="cancelTryOut('DELETEapi-campaigns--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-DELETEapi-campaigns--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-red">DELETE</small>
            <b><code>api/campaigns/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="DELETEapi-campaigns--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="DELETEapi-campaigns--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="DELETEapi-campaigns--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the campaign. Example: <code>1</code></p>
            </div>
                    </form>

                <h1 id="kategori">Kategori</h1>

    <p>Manajemen kategori program kampanye.</p>

                                <h2 id="kategori-GETapi-categories">Daftar Kategori</h2>

<p>
</p>

<p>Tampilkan semua kategori (Publik).</p>

<span id="example-requests-GETapi-categories">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/categories" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/categories"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/categories';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-categories">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;success&quot;: true,
    &quot;data&quot;: [
        {
            &quot;id&quot;: 1,
            &quot;category_name&quot;: &quot;Bencana Alam&quot;,
            &quot;created_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;,
            &quot;campaigns_count&quot;: 3
        },
        {
            &quot;id&quot;: 2,
            &quot;category_name&quot;: &quot;Pendidikan&quot;,
            &quot;created_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;,
            &quot;campaigns_count&quot;: 0
        },
        {
            &quot;id&quot;: 3,
            &quot;category_name&quot;: &quot;Kesehatan&quot;,
            &quot;created_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;,
            &quot;campaigns_count&quot;: 0
        },
        {
            &quot;id&quot;: 4,
            &quot;category_name&quot;: &quot;Lingkungan Hidup&quot;,
            &quot;created_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;,
            &quot;campaigns_count&quot;: 0
        },
        {
            &quot;id&quot;: 5,
            &quot;category_name&quot;: &quot;Sosial Kemanusiaan&quot;,
            &quot;created_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;,
            &quot;campaigns_count&quot;: 0
        }
    ]
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-categories" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-categories"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-categories"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-categories" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-categories">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-categories" data-method="GET"
      data-path="api/categories"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-categories', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-categories"
                    onclick="tryItOut('GETapi-categories');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-categories"
                    onclick="cancelTryOut('GETapi-categories');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-categories"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/categories</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-categories"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-categories"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                    <h2 id="kategori-POSTapi-admin-categories">Tambah Kategori (Admin)</h2>

<p>
</p>

<p>Buat kategori baru (Admin).</p>

<span id="example-requests-POSTapi-admin-categories">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost:8000/api/admin/categories" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"category_name\": \"b\"
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/admin/categories"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "category_name": "b"
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/admin/categories';
$response = $client-&gt;post(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'category_name' =&gt; 'b',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-POSTapi-admin-categories">
</span>
<span id="execution-results-POSTapi-admin-categories" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-admin-categories"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-admin-categories"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-admin-categories" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-admin-categories">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-admin-categories" data-method="POST"
      data-path="api/admin/categories"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-admin-categories', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-admin-categories"
                    onclick="tryItOut('POSTapi-admin-categories');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-admin-categories"
                    onclick="cancelTryOut('POSTapi-admin-categories');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-admin-categories"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/admin/categories</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-admin-categories"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-admin-categories"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>category_name</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="category_name"                data-endpoint="POSTapi-admin-categories"
               value="b"
               data-component="body">
    <br>
<p>Must not be greater than 100 characters. Example: <code>b</code></p>
        </div>
        </form>

                    <h2 id="kategori-PUTapi-admin-categories--id-">Update Kategori (Admin)</h2>

<p>
</p>

<p>Perbarui kategori (Admin).</p>

<span id="example-requests-PUTapi-admin-categories--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request PUT \
    "http://localhost:8000/api/admin/categories/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/admin/categories/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "PUT",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/admin/categories/1';
$response = $client-&gt;put(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-PUTapi-admin-categories--id-">
</span>
<span id="execution-results-PUTapi-admin-categories--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-PUTapi-admin-categories--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-PUTapi-admin-categories--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-PUTapi-admin-categories--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-PUTapi-admin-categories--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-PUTapi-admin-categories--id-" data-method="PUT"
      data-path="api/admin/categories/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('PUTapi-admin-categories--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-PUTapi-admin-categories--id-"
                    onclick="tryItOut('PUTapi-admin-categories--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-PUTapi-admin-categories--id-"
                    onclick="cancelTryOut('PUTapi-admin-categories--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-PUTapi-admin-categories--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-darkblue">PUT</small>
            <b><code>api/admin/categories/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="PUTapi-admin-categories--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="PUTapi-admin-categories--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="PUTapi-admin-categories--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the category. Example: <code>1</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>category_name</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="category_name"                data-endpoint="PUTapi-admin-categories--id-"
               value=""
               data-component="body">
    <br>

        </div>
        </form>

                    <h2 id="kategori-DELETEapi-admin-categories--id-">Hapus Kategori (Admin)</h2>

<p>
</p>

<p>Hapus kategori (Admin).</p>

<span id="example-requests-DELETEapi-admin-categories--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request DELETE \
    "http://localhost:8000/api/admin/categories/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/admin/categories/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "DELETE",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/admin/categories/1';
$response = $client-&gt;delete(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-DELETEapi-admin-categories--id-">
</span>
<span id="execution-results-DELETEapi-admin-categories--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-DELETEapi-admin-categories--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-DELETEapi-admin-categories--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-DELETEapi-admin-categories--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-DELETEapi-admin-categories--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-DELETEapi-admin-categories--id-" data-method="DELETE"
      data-path="api/admin/categories/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('DELETEapi-admin-categories--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-DELETEapi-admin-categories--id-"
                    onclick="tryItOut('DELETEapi-admin-categories--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-DELETEapi-admin-categories--id-"
                    onclick="cancelTryOut('DELETEapi-admin-categories--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-DELETEapi-admin-categories--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-red">DELETE</small>
            <b><code>api/admin/categories/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="DELETEapi-admin-categories--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="DELETEapi-admin-categories--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="DELETEapi-admin-categories--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the category. Example: <code>1</code></p>
            </div>
                    </form>

                <h1 id="donasi">Donasi</h1>

    <p>Endpoint checkout donasi, status pembayaran, dan simulasi webhook.</p>

                                <h2 id="donasi-POSTapi-donations">Pencatatan Transaksi Donasi Nyata / QRIS (POST /api/donations)</h2>

<p>
</p>

<p>Menyimpan transaksi donasi langsung ke database PostgreSQL
dengan pembaruan atomic saldo kampanye (ACID).</p>

<span id="example-requests-POSTapi-donations">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost:8000/api/donations" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"campaign_id\": \"architecto\",
    \"amount\": 3357,
    \"payment_method\": \"architecto\",
    \"payment_channel\": \"architecto\",
    \"donor_name\": \"n\",
    \"donor_email\": \"ashly64@example.com\",
    \"is_anonymous\": false,
    \"status\": \"architecto\"
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/donations"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "campaign_id": "architecto",
    "amount": 3357,
    "payment_method": "architecto",
    "payment_channel": "architecto",
    "donor_name": "n",
    "donor_email": "ashly64@example.com",
    "is_anonymous": false,
    "status": "architecto"
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/donations';
$response = $client-&gt;post(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'campaign_id' =&gt; 'architecto',
            'amount' =&gt; 3357,
            'payment_method' =&gt; 'architecto',
            'payment_channel' =&gt; 'architecto',
            'donor_name' =&gt; 'n',
            'donor_email' =&gt; 'ashly64@example.com',
            'is_anonymous' =&gt; false,
            'status' =&gt; 'architecto',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-POSTapi-donations">
</span>
<span id="execution-results-POSTapi-donations" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-donations"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-donations"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-donations" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-donations">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-donations" data-method="POST"
      data-path="api/donations"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-donations', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-donations"
                    onclick="tryItOut('POSTapi-donations');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-donations"
                    onclick="cancelTryOut('POSTapi-donations');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-donations"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/donations</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-donations"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-donations"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>campaign_id</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="campaign_id"                data-endpoint="POSTapi-donations"
               value="architecto"
               data-component="body">
    <br>
<p>Example: <code>architecto</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>amount</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="amount"                data-endpoint="POSTapi-donations"
               value="3357"
               data-component="body">
    <br>
<p>Must be at least 10000. Example: <code>3357</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>payment_method</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="payment_method"                data-endpoint="POSTapi-donations"
               value="architecto"
               data-component="body">
    <br>
<p>Example: <code>architecto</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>payment_channel</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="payment_channel"                data-endpoint="POSTapi-donations"
               value="architecto"
               data-component="body">
    <br>
<p>Example: <code>architecto</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>donor_name</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="donor_name"                data-endpoint="POSTapi-donations"
               value="n"
               data-component="body">
    <br>
<p>Must not be greater than 255 characters. Example: <code>n</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>donor_email</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="donor_email"                data-endpoint="POSTapi-donations"
               value="ashly64@example.com"
               data-component="body">
    <br>
<p>Must be a valid email address. Must not be greater than 255 characters. Example: <code>ashly64@example.com</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>is_anonymous</code></b>&nbsp;&nbsp;
<small>boolean</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <label data-endpoint="POSTapi-donations" style="display: none">
            <input type="radio" name="is_anonymous"
                   value="true"
                   data-endpoint="POSTapi-donations"
                   data-component="body"             >
            <code>true</code>
        </label>
        <label data-endpoint="POSTapi-donations" style="display: none">
            <input type="radio" name="is_anonymous"
                   value="false"
                   data-endpoint="POSTapi-donations"
                   data-component="body"             >
            <code>false</code>
        </label>
    <br>
<p>Example: <code>false</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>status</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="status"                data-endpoint="POSTapi-donations"
               value="architecto"
               data-component="body">
    <br>
<p>Example: <code>architecto</code></p>
        </div>
        </form>

                    <h2 id="donasi-GETapi-donations">Audit Transaksi Donasi Moneter (Admin / Sandbox)</h2>

<p>
</p>



<span id="example-requests-GETapi-donations">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/donations" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/donations"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/donations';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-donations">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;success&quot;: true,
    &quot;data&quot;: [
        {
            &quot;id&quot;: 7,
            &quot;campaign_id&quot;: 2,
            &quot;user_id&quot;: 4,
            &quot;amount&quot;: &quot;10000000.00&quot;,
            &quot;donor_name&quot;: &quot;fadhilah azzahra&quot;,
            &quot;donor_email&quot;: &quot;azzahra@actgiving.com&quot;,
            &quot;is_anonymous&quot;: false,
            &quot;payment_channel&quot;: &quot;qris&quot;,
            &quot;reference_code&quot;: &quot;INV-QRIS-20261028-CSGKCQ&quot;,
            &quot;status&quot;: &quot;paid&quot;,
            &quot;expires_at&quot;: &quot;2026-10-29T13:50:11.000000Z&quot;,
            &quot;created_at&quot;: &quot;2026-10-28T13:50:11.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-28T13:50:11.000000Z&quot;,
            &quot;is_approved_by_initiator&quot;: null,
            &quot;campaign&quot;: {
                &quot;id&quot;: 2,
                &quot;title&quot;: &quot;Bantuan Darurat Medis &amp; Masker untuk Korban Kabut Asap Karhutla Kalimantan&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;
            }
        },
        {
            &quot;id&quot;: 6,
            &quot;campaign_id&quot;: 2,
            &quot;user_id&quot;: null,
            &quot;amount&quot;: &quot;10000000.00&quot;,
            &quot;donor_name&quot;: &quot;fadhilah azzahra&quot;,
            &quot;donor_email&quot;: &quot;azzahra@actgiving.com&quot;,
            &quot;is_anonymous&quot;: false,
            &quot;payment_channel&quot;: &quot;qris&quot;,
            &quot;reference_code&quot;: &quot;INV-GST-20261028-DIHA5G&quot;,
            &quot;status&quot;: &quot;pending&quot;,
            &quot;expires_at&quot;: &quot;2026-10-29T13:50:09.000000Z&quot;,
            &quot;created_at&quot;: &quot;2026-10-28T13:50:09.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-28T13:50:09.000000Z&quot;,
            &quot;is_approved_by_initiator&quot;: null,
            &quot;campaign&quot;: {
                &quot;id&quot;: 2,
                &quot;title&quot;: &quot;Bantuan Darurat Medis &amp; Masker untuk Korban Kabut Asap Karhutla Kalimantan&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;
            }
        },
        {
            &quot;id&quot;: 5,
            &quot;campaign_id&quot;: 1,
            &quot;user_id&quot;: null,
            &quot;amount&quot;: &quot;250000.00&quot;,
            &quot;donor_name&quot;: &quot;Donatur QRIS Live&quot;,
            &quot;donor_email&quot;: &quot;donatur.live@example.com&quot;,
            &quot;is_anonymous&quot;: false,
            &quot;payment_channel&quot;: &quot;qris&quot;,
            &quot;reference_code&quot;: &quot;INV-QRIS-20261024-3MF5PX&quot;,
            &quot;status&quot;: &quot;paid&quot;,
            &quot;expires_at&quot;: &quot;2026-10-25T17:15:28.000000Z&quot;,
            &quot;created_at&quot;: &quot;2026-10-24T17:15:28.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-24T17:15:28.000000Z&quot;,
            &quot;is_approved_by_initiator&quot;: null,
            &quot;campaign&quot;: {
                &quot;id&quot;: 1,
                &quot;title&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;
            }
        },
        {
            &quot;id&quot;: 4,
            &quot;campaign_id&quot;: 1,
            &quot;user_id&quot;: null,
            &quot;amount&quot;: &quot;150000.00&quot;,
            &quot;donor_name&quot;: &quot;Budi Santoso QRIS&quot;,
            &quot;donor_email&quot;: &quot;budi.santoso@example.com&quot;,
            &quot;is_anonymous&quot;: false,
            &quot;payment_channel&quot;: &quot;qris&quot;,
            &quot;reference_code&quot;: &quot;INV-QRIS-20261024-OK9F6L&quot;,
            &quot;status&quot;: &quot;paid&quot;,
            &quot;expires_at&quot;: &quot;2026-10-25T17:14:34.000000Z&quot;,
            &quot;created_at&quot;: &quot;2026-10-24T17:14:34.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-24T17:14:34.000000Z&quot;,
            &quot;is_approved_by_initiator&quot;: null,
            &quot;campaign&quot;: {
                &quot;id&quot;: 1,
                &quot;title&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;
            }
        },
        {
            &quot;id&quot;: 3,
            &quot;campaign_id&quot;: 1,
            &quot;user_id&quot;: null,
            &quot;amount&quot;: &quot;150000.00&quot;,
            &quot;donor_name&quot;: &quot;Budi Santoso QRIS&quot;,
            &quot;donor_email&quot;: &quot;budi.santoso@example.com&quot;,
            &quot;is_anonymous&quot;: false,
            &quot;payment_channel&quot;: &quot;qris&quot;,
            &quot;reference_code&quot;: &quot;INV-QRIS-20261024-YOSHOF&quot;,
            &quot;status&quot;: &quot;paid&quot;,
            &quot;expires_at&quot;: &quot;2026-10-25T17:14:27.000000Z&quot;,
            &quot;created_at&quot;: &quot;2026-10-24T17:14:27.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-24T17:14:27.000000Z&quot;,
            &quot;is_approved_by_initiator&quot;: null,
            &quot;campaign&quot;: {
                &quot;id&quot;: 1,
                &quot;title&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;
            }
        },
        {
            &quot;id&quot;: 2,
            &quot;campaign_id&quot;: 1,
            &quot;user_id&quot;: null,
            &quot;amount&quot;: &quot;25000.00&quot;,
            &quot;donor_name&quot;: &quot;Donatur Test&quot;,
            &quot;donor_email&quot;: &quot;test@example.com&quot;,
            &quot;is_anonymous&quot;: false,
            &quot;payment_channel&quot;: &quot;qris&quot;,
            &quot;reference_code&quot;: &quot;INV-QRIS-20261024-IIRYY7&quot;,
            &quot;status&quot;: &quot;paid&quot;,
            &quot;expires_at&quot;: &quot;2026-10-25T17:02:56.000000Z&quot;,
            &quot;created_at&quot;: &quot;2026-10-24T17:02:56.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-24T17:02:56.000000Z&quot;,
            &quot;is_approved_by_initiator&quot;: null,
            &quot;campaign&quot;: {
                &quot;id&quot;: 1,
                &quot;title&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;
            }
        },
        {
            &quot;id&quot;: 1,
            &quot;campaign_id&quot;: 2,
            &quot;user_id&quot;: null,
            &quot;amount&quot;: &quot;10000.00&quot;,
            &quot;donor_name&quot;: &quot;Hamba Allah&quot;,
            &quot;donor_email&quot;: &quot;azzahra@actgiving.com&quot;,
            &quot;is_anonymous&quot;: true,
            &quot;payment_channel&quot;: &quot;qris&quot;,
            &quot;reference_code&quot;: &quot;INV-GST-20261022-T91VFA&quot;,
            &quot;status&quot;: &quot;paid&quot;,
            &quot;expires_at&quot;: &quot;2026-10-23T05:32:31.000000Z&quot;,
            &quot;created_at&quot;: &quot;2026-10-22T05:32:31.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-22T05:32:37.000000Z&quot;,
            &quot;is_approved_by_initiator&quot;: null,
            &quot;campaign&quot;: {
                &quot;id&quot;: 2,
                &quot;title&quot;: &quot;Bantuan Darurat Medis &amp; Masker untuk Korban Kabut Asap Karhutla Kalimantan&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;
            }
        }
    ]
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-donations" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-donations"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-donations"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-donations" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-donations">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-donations" data-method="GET"
      data-path="api/donations"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-donations', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-donations"
                    onclick="tryItOut('GETapi-donations');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-donations"
                    onclick="cancelTryOut('GETapi-donations');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-donations"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/donations</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-donations"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-donations"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                    <h2 id="donasi-GETapi-admin-donations">Audit Transaksi Donasi Moneter (Admin / Sandbox)</h2>

<p>
</p>



<span id="example-requests-GETapi-admin-donations">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/admin/donations" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/admin/donations"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/admin/donations';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-admin-donations">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;success&quot;: true,
    &quot;data&quot;: [
        {
            &quot;id&quot;: 7,
            &quot;campaign_id&quot;: 2,
            &quot;user_id&quot;: 4,
            &quot;amount&quot;: &quot;10000000.00&quot;,
            &quot;donor_name&quot;: &quot;fadhilah azzahra&quot;,
            &quot;donor_email&quot;: &quot;azzahra@actgiving.com&quot;,
            &quot;is_anonymous&quot;: false,
            &quot;payment_channel&quot;: &quot;qris&quot;,
            &quot;reference_code&quot;: &quot;INV-QRIS-20261028-CSGKCQ&quot;,
            &quot;status&quot;: &quot;paid&quot;,
            &quot;expires_at&quot;: &quot;2026-10-29T13:50:11.000000Z&quot;,
            &quot;created_at&quot;: &quot;2026-10-28T13:50:11.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-28T13:50:11.000000Z&quot;,
            &quot;is_approved_by_initiator&quot;: null,
            &quot;campaign&quot;: {
                &quot;id&quot;: 2,
                &quot;title&quot;: &quot;Bantuan Darurat Medis &amp; Masker untuk Korban Kabut Asap Karhutla Kalimantan&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;
            }
        },
        {
            &quot;id&quot;: 6,
            &quot;campaign_id&quot;: 2,
            &quot;user_id&quot;: null,
            &quot;amount&quot;: &quot;10000000.00&quot;,
            &quot;donor_name&quot;: &quot;fadhilah azzahra&quot;,
            &quot;donor_email&quot;: &quot;azzahra@actgiving.com&quot;,
            &quot;is_anonymous&quot;: false,
            &quot;payment_channel&quot;: &quot;qris&quot;,
            &quot;reference_code&quot;: &quot;INV-GST-20261028-DIHA5G&quot;,
            &quot;status&quot;: &quot;pending&quot;,
            &quot;expires_at&quot;: &quot;2026-10-29T13:50:09.000000Z&quot;,
            &quot;created_at&quot;: &quot;2026-10-28T13:50:09.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-28T13:50:09.000000Z&quot;,
            &quot;is_approved_by_initiator&quot;: null,
            &quot;campaign&quot;: {
                &quot;id&quot;: 2,
                &quot;title&quot;: &quot;Bantuan Darurat Medis &amp; Masker untuk Korban Kabut Asap Karhutla Kalimantan&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;
            }
        },
        {
            &quot;id&quot;: 5,
            &quot;campaign_id&quot;: 1,
            &quot;user_id&quot;: null,
            &quot;amount&quot;: &quot;250000.00&quot;,
            &quot;donor_name&quot;: &quot;Donatur QRIS Live&quot;,
            &quot;donor_email&quot;: &quot;donatur.live@example.com&quot;,
            &quot;is_anonymous&quot;: false,
            &quot;payment_channel&quot;: &quot;qris&quot;,
            &quot;reference_code&quot;: &quot;INV-QRIS-20261024-3MF5PX&quot;,
            &quot;status&quot;: &quot;paid&quot;,
            &quot;expires_at&quot;: &quot;2026-10-25T17:15:28.000000Z&quot;,
            &quot;created_at&quot;: &quot;2026-10-24T17:15:28.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-24T17:15:28.000000Z&quot;,
            &quot;is_approved_by_initiator&quot;: null,
            &quot;campaign&quot;: {
                &quot;id&quot;: 1,
                &quot;title&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;
            }
        },
        {
            &quot;id&quot;: 4,
            &quot;campaign_id&quot;: 1,
            &quot;user_id&quot;: null,
            &quot;amount&quot;: &quot;150000.00&quot;,
            &quot;donor_name&quot;: &quot;Budi Santoso QRIS&quot;,
            &quot;donor_email&quot;: &quot;budi.santoso@example.com&quot;,
            &quot;is_anonymous&quot;: false,
            &quot;payment_channel&quot;: &quot;qris&quot;,
            &quot;reference_code&quot;: &quot;INV-QRIS-20261024-OK9F6L&quot;,
            &quot;status&quot;: &quot;paid&quot;,
            &quot;expires_at&quot;: &quot;2026-10-25T17:14:34.000000Z&quot;,
            &quot;created_at&quot;: &quot;2026-10-24T17:14:34.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-24T17:14:34.000000Z&quot;,
            &quot;is_approved_by_initiator&quot;: null,
            &quot;campaign&quot;: {
                &quot;id&quot;: 1,
                &quot;title&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;
            }
        },
        {
            &quot;id&quot;: 3,
            &quot;campaign_id&quot;: 1,
            &quot;user_id&quot;: null,
            &quot;amount&quot;: &quot;150000.00&quot;,
            &quot;donor_name&quot;: &quot;Budi Santoso QRIS&quot;,
            &quot;donor_email&quot;: &quot;budi.santoso@example.com&quot;,
            &quot;is_anonymous&quot;: false,
            &quot;payment_channel&quot;: &quot;qris&quot;,
            &quot;reference_code&quot;: &quot;INV-QRIS-20261024-YOSHOF&quot;,
            &quot;status&quot;: &quot;paid&quot;,
            &quot;expires_at&quot;: &quot;2026-10-25T17:14:27.000000Z&quot;,
            &quot;created_at&quot;: &quot;2026-10-24T17:14:27.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-24T17:14:27.000000Z&quot;,
            &quot;is_approved_by_initiator&quot;: null,
            &quot;campaign&quot;: {
                &quot;id&quot;: 1,
                &quot;title&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;
            }
        },
        {
            &quot;id&quot;: 2,
            &quot;campaign_id&quot;: 1,
            &quot;user_id&quot;: null,
            &quot;amount&quot;: &quot;25000.00&quot;,
            &quot;donor_name&quot;: &quot;Donatur Test&quot;,
            &quot;donor_email&quot;: &quot;test@example.com&quot;,
            &quot;is_anonymous&quot;: false,
            &quot;payment_channel&quot;: &quot;qris&quot;,
            &quot;reference_code&quot;: &quot;INV-QRIS-20261024-IIRYY7&quot;,
            &quot;status&quot;: &quot;paid&quot;,
            &quot;expires_at&quot;: &quot;2026-10-25T17:02:56.000000Z&quot;,
            &quot;created_at&quot;: &quot;2026-10-24T17:02:56.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-24T17:02:56.000000Z&quot;,
            &quot;is_approved_by_initiator&quot;: null,
            &quot;campaign&quot;: {
                &quot;id&quot;: 1,
                &quot;title&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;
            }
        },
        {
            &quot;id&quot;: 1,
            &quot;campaign_id&quot;: 2,
            &quot;user_id&quot;: null,
            &quot;amount&quot;: &quot;10000.00&quot;,
            &quot;donor_name&quot;: &quot;Hamba Allah&quot;,
            &quot;donor_email&quot;: &quot;azzahra@actgiving.com&quot;,
            &quot;is_anonymous&quot;: true,
            &quot;payment_channel&quot;: &quot;qris&quot;,
            &quot;reference_code&quot;: &quot;INV-GST-20261022-T91VFA&quot;,
            &quot;status&quot;: &quot;paid&quot;,
            &quot;expires_at&quot;: &quot;2026-10-23T05:32:31.000000Z&quot;,
            &quot;created_at&quot;: &quot;2026-10-22T05:32:31.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-22T05:32:37.000000Z&quot;,
            &quot;is_approved_by_initiator&quot;: null,
            &quot;campaign&quot;: {
                &quot;id&quot;: 2,
                &quot;title&quot;: &quot;Bantuan Darurat Medis &amp; Masker untuk Korban Kabut Asap Karhutla Kalimantan&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;
            }
        }
    ]
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-admin-donations" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-admin-donations"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-admin-donations"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-admin-donations" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-admin-donations">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-admin-donations" data-method="GET"
      data-path="api/admin/donations"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-admin-donations', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-admin-donations"
                    onclick="tryItOut('GETapi-admin-donations');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-admin-donations"
                    onclick="cancelTryOut('GETapi-admin-donations');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-admin-donations"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/admin/donations</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-admin-donations"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-admin-donations"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                    <h2 id="donasi-POSTapi-donations-guest-checkout">Guest Checkout (Tanpa Login)</h2>

<p>
</p>

<ol>
<li>Guest Checkout (Donasi Tamu tanpa Login).
Return dummy QRIS / Virtual Account info.</li>
</ol>

<span id="example-requests-POSTapi-donations-guest-checkout">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost:8000/api/donations/guest-checkout" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"campaign_id\": \"architecto\",
    \"amount\": 3357,
    \"donor_name\": \"g\",
    \"donor_email\": \"rowan.gulgowski@example.com\",
    \"is_anonymous\": true,
    \"payment_channel\": \"qris\"
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/donations/guest-checkout"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "campaign_id": "architecto",
    "amount": 3357,
    "donor_name": "g",
    "donor_email": "rowan.gulgowski@example.com",
    "is_anonymous": true,
    "payment_channel": "qris"
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/donations/guest-checkout';
$response = $client-&gt;post(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'campaign_id' =&gt; 'architecto',
            'amount' =&gt; 3357,
            'donor_name' =&gt; 'g',
            'donor_email' =&gt; 'rowan.gulgowski@example.com',
            'is_anonymous' =&gt; true,
            'payment_channel' =&gt; 'qris',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-POSTapi-donations-guest-checkout">
</span>
<span id="execution-results-POSTapi-donations-guest-checkout" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-donations-guest-checkout"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-donations-guest-checkout"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-donations-guest-checkout" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-donations-guest-checkout">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-donations-guest-checkout" data-method="POST"
      data-path="api/donations/guest-checkout"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-donations-guest-checkout', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-donations-guest-checkout"
                    onclick="tryItOut('POSTapi-donations-guest-checkout');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-donations-guest-checkout"
                    onclick="cancelTryOut('POSTapi-donations-guest-checkout');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-donations-guest-checkout"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/donations/guest-checkout</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-donations-guest-checkout"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-donations-guest-checkout"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>campaign_id</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="campaign_id"                data-endpoint="POSTapi-donations-guest-checkout"
               value="architecto"
               data-component="body">
    <br>
<p>Must match an existing stored value. Example: <code>architecto</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>amount</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="amount"                data-endpoint="POSTapi-donations-guest-checkout"
               value="3357"
               data-component="body">
    <br>
<p>Must be at least 10000. Example: <code>3357</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>donor_name</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="donor_name"                data-endpoint="POSTapi-donations-guest-checkout"
               value="g"
               data-component="body">
    <br>
<p>Must not be greater than 255 characters. Example: <code>g</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>donor_email</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="donor_email"                data-endpoint="POSTapi-donations-guest-checkout"
               value="rowan.gulgowski@example.com"
               data-component="body">
    <br>
<p>Must be a valid email address. Must not be greater than 255 characters. Example: <code>rowan.gulgowski@example.com</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>is_anonymous</code></b>&nbsp;&nbsp;
<small>boolean</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <label data-endpoint="POSTapi-donations-guest-checkout" style="display: none">
            <input type="radio" name="is_anonymous"
                   value="true"
                   data-endpoint="POSTapi-donations-guest-checkout"
                   data-component="body"             >
            <code>true</code>
        </label>
        <label data-endpoint="POSTapi-donations-guest-checkout" style="display: none">
            <input type="radio" name="is_anonymous"
                   value="false"
                   data-endpoint="POSTapi-donations-guest-checkout"
                   data-component="body"             >
            <code>false</code>
        </label>
    <br>
<p>Example: <code>true</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>payment_channel</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="payment_channel"                data-endpoint="POSTapi-donations-guest-checkout"
               value="qris"
               data-component="body">
    <br>
<p>Example: <code>qris</code></p>
Must be one of:
<ul style="list-style-type: square;"><li><code>qris</code></li> <li><code>bca_va</code></li> <li><code>mandiri_va</code></li> <li><code>bni_va</code></li> <li><code>bri_va</code></li></ul>
        </div>
        </form>

                    <h2 id="donasi-GETapi-donations--reference_code--status">Cek Status Pembayaran</h2>

<p>
</p>

<p>Cek Status Donasi Berdasarkan Reference Code (Publik).</p>

<span id="example-requests-GETapi-donations--reference_code--status">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/donations/1/status" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/donations/1/status"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/donations/1/status';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-donations--reference_code--status">
            <blockquote>
            <p>Example response (404):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;message&quot;: &quot;No query results for model [App\\Models\\Donation].&quot;
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-donations--reference_code--status" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-donations--reference_code--status"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-donations--reference_code--status"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-donations--reference_code--status" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-donations--reference_code--status">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-donations--reference_code--status" data-method="GET"
      data-path="api/donations/{reference_code}/status"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-donations--reference_code--status', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-donations--reference_code--status"
                    onclick="tryItOut('GETapi-donations--reference_code--status');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-donations--reference_code--status"
                    onclick="cancelTryOut('GETapi-donations--reference_code--status');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-donations--reference_code--status"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/donations/{reference_code}/status</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-donations--reference_code--status"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-donations--reference_code--status"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>reference_code</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="reference_code"                data-endpoint="GETapi-donations--reference_code--status"
               value="1"
               data-component="url">
    <br>
<p>Example: <code>1</code></p>
            </div>
                    </form>

                    <h2 id="donasi-POSTapi-donations-webhook-simulate">Simulasi Webhook Pembayaran (ACID)</h2>

<p>
</p>

<p>Webhook Simulasi Bayar Payment Gateway.
WAJIB ACID Transaction &amp; lockForUpdate() untuk Update current_amount secara aman.</p>

<span id="example-requests-POSTapi-donations-webhook-simulate">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost:8000/api/donations/webhook-simulate" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"reference_code\": \"architecto\",
    \"status\": \"expired\"
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/donations/webhook-simulate"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "reference_code": "architecto",
    "status": "expired"
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/donations/webhook-simulate';
$response = $client-&gt;post(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'reference_code' =&gt; 'architecto',
            'status' =&gt; 'expired',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-POSTapi-donations-webhook-simulate">
</span>
<span id="execution-results-POSTapi-donations-webhook-simulate" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-donations-webhook-simulate"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-donations-webhook-simulate"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-donations-webhook-simulate" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-donations-webhook-simulate">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-donations-webhook-simulate" data-method="POST"
      data-path="api/donations/webhook-simulate"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-donations-webhook-simulate', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-donations-webhook-simulate"
                    onclick="tryItOut('POSTapi-donations-webhook-simulate');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-donations-webhook-simulate"
                    onclick="cancelTryOut('POSTapi-donations-webhook-simulate');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-donations-webhook-simulate"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/donations/webhook-simulate</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-donations-webhook-simulate"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-donations-webhook-simulate"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>reference_code</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="reference_code"                data-endpoint="POSTapi-donations-webhook-simulate"
               value="architecto"
               data-component="body">
    <br>
<p>Example: <code>architecto</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>status</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="status"                data-endpoint="POSTapi-donations-webhook-simulate"
               value="expired"
               data-component="body">
    <br>
<p>Example: <code>expired</code></p>
Must be one of:
<ul style="list-style-type: square;"><li><code>paid</code></li> <li><code>expired</code></li></ul>
        </div>
        </form>

                    <h2 id="donasi-POSTapi-donations-user-checkout">Donasi User Terdaftar</h2>

<p>
</p>

<p>Checkout Donasi oleh Pengguna Terdaftar (Dual-Role User).</p>

<span id="example-requests-POSTapi-donations-user-checkout">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost:8000/api/donations/user-checkout" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"campaign_id\": \"architecto\",
    \"amount\": 3357,
    \"is_anonymous\": false,
    \"payment_channel\": \"bni_va\"
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/donations/user-checkout"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "campaign_id": "architecto",
    "amount": 3357,
    "is_anonymous": false,
    "payment_channel": "bni_va"
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/donations/user-checkout';
$response = $client-&gt;post(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'campaign_id' =&gt; 'architecto',
            'amount' =&gt; 3357,
            'is_anonymous' =&gt; false,
            'payment_channel' =&gt; 'bni_va',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-POSTapi-donations-user-checkout">
</span>
<span id="execution-results-POSTapi-donations-user-checkout" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-donations-user-checkout"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-donations-user-checkout"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-donations-user-checkout" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-donations-user-checkout">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-donations-user-checkout" data-method="POST"
      data-path="api/donations/user-checkout"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-donations-user-checkout', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-donations-user-checkout"
                    onclick="tryItOut('POSTapi-donations-user-checkout');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-donations-user-checkout"
                    onclick="cancelTryOut('POSTapi-donations-user-checkout');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-donations-user-checkout"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/donations/user-checkout</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-donations-user-checkout"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-donations-user-checkout"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>campaign_id</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="campaign_id"                data-endpoint="POSTapi-donations-user-checkout"
               value="architecto"
               data-component="body">
    <br>
<p>Must match an existing stored value. Example: <code>architecto</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>amount</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="amount"                data-endpoint="POSTapi-donations-user-checkout"
               value="3357"
               data-component="body">
    <br>
<p>Must be at least 10000. Example: <code>3357</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>is_anonymous</code></b>&nbsp;&nbsp;
<small>boolean</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <label data-endpoint="POSTapi-donations-user-checkout" style="display: none">
            <input type="radio" name="is_anonymous"
                   value="true"
                   data-endpoint="POSTapi-donations-user-checkout"
                   data-component="body"             >
            <code>true</code>
        </label>
        <label data-endpoint="POSTapi-donations-user-checkout" style="display: none">
            <input type="radio" name="is_anonymous"
                   value="false"
                   data-endpoint="POSTapi-donations-user-checkout"
                   data-component="body"             >
            <code>false</code>
        </label>
    <br>
<p>Example: <code>false</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>payment_channel</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="payment_channel"                data-endpoint="POSTapi-donations-user-checkout"
               value="bni_va"
               data-component="body">
    <br>
<p>Example: <code>bni_va</code></p>
Must be one of:
<ul style="list-style-type: square;"><li><code>qris</code></li> <li><code>bca_va</code></li> <li><code>mandiri_va</code></li> <li><code>bni_va</code></li> <li><code>bri_va</code></li></ul>
        </div>
        </form>

                    <h2 id="donasi-GETapi-my-donations">Riwayat Donasi Saya</h2>

<p>
</p>

<p>Riwayat Donasi Pengguna Terdaftar.</p>

<span id="example-requests-GETapi-my-donations">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/my-donations" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/my-donations"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/my-donations';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-my-donations">
            <blockquote>
            <p>Example response (401):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;message&quot;: &quot;Unauthenticated.&quot;
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-my-donations" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-my-donations"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-my-donations"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-my-donations" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-my-donations">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-my-donations" data-method="GET"
      data-path="api/my-donations"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-my-donations', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-my-donations"
                    onclick="tryItOut('GETapi-my-donations');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-my-donations"
                    onclick="cancelTryOut('GETapi-my-donations');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-my-donations"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/my-donations</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-my-donations"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-my-donations"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                    <h2 id="donasi-PATCHapi-donations--id--approval">Approval Donasi oleh Inisiator (ACID)</h2>

<p>
</p>

<p>Manajemen Izin Donasi oleh Inisiator (Approve / Reject).
WAJIB ACID Transaction &amp; lockForUpdate().</p>

<span id="example-requests-PATCHapi-donations--id--approval">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request PATCH \
    "http://localhost:8000/api/donations/1/approval" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"approval\": true
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/donations/1/approval"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "approval": true
};

fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/donations/1/approval';
$response = $client-&gt;patch(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'approval' =&gt; true,
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-PATCHapi-donations--id--approval">
</span>
<span id="execution-results-PATCHapi-donations--id--approval" hidden>
    <blockquote>Received response<span
                id="execution-response-status-PATCHapi-donations--id--approval"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-PATCHapi-donations--id--approval"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-PATCHapi-donations--id--approval" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-PATCHapi-donations--id--approval">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-PATCHapi-donations--id--approval" data-method="PATCH"
      data-path="api/donations/{id}/approval"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('PATCHapi-donations--id--approval', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-PATCHapi-donations--id--approval"
                    onclick="tryItOut('PATCHapi-donations--id--approval');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-PATCHapi-donations--id--approval"
                    onclick="cancelTryOut('PATCHapi-donations--id--approval');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-PATCHapi-donations--id--approval"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-purple">PATCH</small>
            <b><code>api/donations/{id}/approval</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="PATCHapi-donations--id--approval"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="PATCHapi-donations--id--approval"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="PATCHapi-donations--id--approval"
               value="1"
               data-component="url">
    <br>
<p>The ID of the donation. Example: <code>1</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>approval</code></b>&nbsp;&nbsp;
<small>boolean</small>&nbsp;
 &nbsp;
 &nbsp;
                <label data-endpoint="PATCHapi-donations--id--approval" style="display: none">
            <input type="radio" name="approval"
                   value="true"
                   data-endpoint="PATCHapi-donations--id--approval"
                   data-component="body"             >
            <code>true</code>
        </label>
        <label data-endpoint="PATCHapi-donations--id--approval" style="display: none">
            <input type="radio" name="approval"
                   value="false"
                   data-endpoint="PATCHapi-donations--id--approval"
                   data-component="body"             >
            <code>false</code>
        </label>
    <br>
<p>Example: <code>true</code></p>
        </div>
        </form>

                <h1 id="pendaftaran-relawan">Pendaftaran Relawan</h1>

    <p>Pendaftaran dan seleksi relawan kegiatan kampanye.</p>

                                <h2 id="pendaftaran-relawan-POSTapi-campaigns--id--volunteer-register">Daftar sebagai Relawan &amp; Pembuatan Akun Relawan Otomatis</h2>

<p>
</p>

<p>Jika user belum login, endpoint ini sekaligus membuat record User baru
dengan password yang di-hash, mencatat pendaftaran relawan ke kampanye,
dan mengembalikan Sanctum token untuk auto-login ke Dashboard Relawan.</p>

<span id="example-requests-POSTapi-campaigns--id--volunteer-register">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost:8000/api/campaigns/1/volunteer-register" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/campaigns/1/volunteer-register"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "POST",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/campaigns/1/volunteer-register';
$response = $client-&gt;post(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-POSTapi-campaigns--id--volunteer-register">
</span>
<span id="execution-results-POSTapi-campaigns--id--volunteer-register" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-campaigns--id--volunteer-register"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-campaigns--id--volunteer-register"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-campaigns--id--volunteer-register" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-campaigns--id--volunteer-register">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-campaigns--id--volunteer-register" data-method="POST"
      data-path="api/campaigns/{id}/volunteer-register"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-campaigns--id--volunteer-register', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-campaigns--id--volunteer-register"
                    onclick="tryItOut('POSTapi-campaigns--id--volunteer-register');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-campaigns--id--volunteer-register"
                    onclick="cancelTryOut('POSTapi-campaigns--id--volunteer-register');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-campaigns--id--volunteer-register"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/campaigns/{id}/volunteer-register</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-campaigns--id--volunteer-register"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-campaigns--id--volunteer-register"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="POSTapi-campaigns--id--volunteer-register"
               value="1"
               data-component="url">
    <br>
<p>The ID of the campaign. Example: <code>1</code></p>
            </div>
                    </form>

                    <h2 id="pendaftaran-relawan-GETapi-initiator-volunteers">Daftar Semua Pendaftar Relawan untuk Inisiator (FR Inisiator)</h2>

<p>
</p>

<p>Inisiator: Mendapatkan daftar seluruh relawan yang mendaftar ke kampanye miliknya.</p>

<span id="example-requests-GETapi-initiator-volunteers">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/initiator/volunteers" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/initiator/volunteers"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/initiator/volunteers';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-initiator-volunteers">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;success&quot;: true,
    &quot;data&quot;: [
        {
            &quot;id&quot;: 2,
            &quot;campaign_id&quot;: 2,
            &quot;campaignTitle&quot;: &quot;Bantuan Darurat Medis &amp; Masker untuk Korban Kabut Asap Karhutla Kalimantan&quot;,
            &quot;user_id&quot;: 6,
            &quot;name&quot;: &quot;nurfadhilah&quot;,
            &quot;email&quot;: &quot;fadhilah@actgiving.com&quot;,
            &quot;phone&quot;: &quot;081234567890&quot;,
            &quot;city&quot;: &quot;Makassar&quot;,
            &quot;skills&quot;: &quot;Relawan aktif terverifikasi ActGiving siap diterjunkan ke lapangan.&quot;,
            &quot;status&quot;: &quot;accepted&quot;,
            &quot;created_at&quot;: &quot;2026-10-25T12:36:15.000000Z&quot;,
            &quot;user&quot;: {
                &quot;id&quot;: 6,
                &quot;name&quot;: &quot;nurfadhilah&quot;,
                &quot;email&quot;: &quot;fadhilah@actgiving.com&quot;,
                &quot;phone_whatsapp&quot;: &quot;081234567890&quot;,
                &quot;city_domicile&quot;: &quot;Makassar&quot;
            },
            &quot;campaign&quot;: {
                &quot;id&quot;: 2,
                &quot;title&quot;: &quot;Bantuan Darurat Medis &amp; Masker untuk Korban Kabut Asap Karhutla Kalimantan&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;,
                &quot;activity_date&quot;: &quot;2026-10-29T00:00:00.000000Z&quot;,
                &quot;status&quot;: &quot;active&quot;,
                &quot;user_id&quot;: 4
            }
        },
        {
            &quot;id&quot;: 1,
            &quot;campaign_id&quot;: 1,
            &quot;campaignTitle&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
            &quot;user_id&quot;: 5,
            &quot;name&quot;: &quot;Test Relawan Baru&quot;,
            &quot;email&quot;: &quot;test_relawan_1792931329927@example.com&quot;,
            &quot;phone&quot;: &quot;081299998888&quot;,
            &quot;city&quot;: &quot;Indonesia&quot;,
            &quot;skills&quot;: &quot;Pengalaman medis lapangan dan dapur umum&quot;,
            &quot;status&quot;: &quot;pending&quot;,
            &quot;created_at&quot;: &quot;2026-10-25T12:28:50.000000Z&quot;,
            &quot;user&quot;: {
                &quot;id&quot;: 5,
                &quot;name&quot;: &quot;Test Relawan Baru&quot;,
                &quot;email&quot;: &quot;test_relawan_1792931329927@example.com&quot;,
                &quot;phone_whatsapp&quot;: &quot;081299998888&quot;,
                &quot;city_domicile&quot;: null
            },
            &quot;campaign&quot;: {
                &quot;id&quot;: 1,
                &quot;title&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;,
                &quot;activity_date&quot;: &quot;2026-10-28T00:00:00.000000Z&quot;,
                &quot;status&quot;: &quot;active&quot;,
                &quot;user_id&quot;: 2
            }
        }
    ]
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-initiator-volunteers" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-initiator-volunteers"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-initiator-volunteers"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-initiator-volunteers" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-initiator-volunteers">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-initiator-volunteers" data-method="GET"
      data-path="api/initiator/volunteers"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-initiator-volunteers', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-initiator-volunteers"
                    onclick="tryItOut('GETapi-initiator-volunteers');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-initiator-volunteers"
                    onclick="cancelTryOut('GETapi-initiator-volunteers');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-initiator-volunteers"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/initiator/volunteers</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-initiator-volunteers"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-initiator-volunteers"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                    <h2 id="pendaftaran-relawan-GETapi-campaigns--id--registrations">Daftar Pelamar Relawan per Kampanye (Inisiator)</h2>

<p>
</p>

<p>Inisiator: Melihat daftar pelamar relawan pada kampanyenya.</p>

<span id="example-requests-GETapi-campaigns--id--registrations">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/campaigns/1/registrations" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/campaigns/1/registrations"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/campaigns/1/registrations';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-campaigns--id--registrations">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;success&quot;: true,
    &quot;data&quot;: {
        &quot;campaign&quot;: {
            &quot;id&quot;: 1,
            &quot;title&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
            &quot;current_volunteers&quot;: 4,
            &quot;target_volunteers&quot;: 10
        },
        &quot;registrations&quot;: [
            {
                &quot;id&quot;: 1,
                &quot;campaign_id&quot;: 1,
                &quot;campaignTitle&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
                &quot;user_id&quot;: 5,
                &quot;name&quot;: &quot;Test Relawan Baru&quot;,
                &quot;email&quot;: &quot;test_relawan_1792931329927@example.com&quot;,
                &quot;phone&quot;: &quot;081299998888&quot;,
                &quot;city&quot;: &quot;-&quot;,
                &quot;skills&quot;: &quot;Pengalaman medis lapangan dan dapur umum&quot;,
                &quot;status&quot;: &quot;pending&quot;,
                &quot;created_at&quot;: &quot;2026-10-25T12:28:50.000000Z&quot;,
                &quot;user&quot;: {
                    &quot;id&quot;: 5,
                    &quot;name&quot;: &quot;Test Relawan Baru&quot;,
                    &quot;email&quot;: &quot;test_relawan_1792931329927@example.com&quot;,
                    &quot;phone_whatsapp&quot;: &quot;081299998888&quot;,
                    &quot;city_domicile&quot;: null
                }
            }
        ]
    }
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-campaigns--id--registrations" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-campaigns--id--registrations"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-campaigns--id--registrations"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-campaigns--id--registrations" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-campaigns--id--registrations">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-campaigns--id--registrations" data-method="GET"
      data-path="api/campaigns/{id}/registrations"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-campaigns--id--registrations', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-campaigns--id--registrations"
                    onclick="tryItOut('GETapi-campaigns--id--registrations');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-campaigns--id--registrations"
                    onclick="cancelTryOut('GETapi-campaigns--id--registrations');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-campaigns--id--registrations"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/campaigns/{id}/registrations</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-campaigns--id--registrations"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-campaigns--id--registrations"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="GETapi-campaigns--id--registrations"
               value="1"
               data-component="url">
    <br>
<p>The ID of the campaign. Example: <code>1</code></p>
            </div>
                    </form>

                    <h2 id="pendaftaran-relawan-PATCHapi-volunteer-registrations--id--status">Seleksi Relawan - Accept/Reject (Inisiator, ACID)</h2>

<p>
</p>

<p>Inisiator: Seleksi Status Relawan (accepted / rejected).
WAJIB ACID Transaction &amp; lockForUpdate() untuk mencegah over-capacity.</p>

<span id="example-requests-PATCHapi-volunteer-registrations--id--status">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request PATCH \
    "http://localhost:8000/api/volunteer-registrations/1/status" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"status\": \"rejected\"
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/volunteer-registrations/1/status"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "status": "rejected"
};

fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/volunteer-registrations/1/status';
$response = $client-&gt;patch(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'status' =&gt; 'rejected',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-PATCHapi-volunteer-registrations--id--status">
</span>
<span id="execution-results-PATCHapi-volunteer-registrations--id--status" hidden>
    <blockquote>Received response<span
                id="execution-response-status-PATCHapi-volunteer-registrations--id--status"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-PATCHapi-volunteer-registrations--id--status"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-PATCHapi-volunteer-registrations--id--status" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-PATCHapi-volunteer-registrations--id--status">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-PATCHapi-volunteer-registrations--id--status" data-method="PATCH"
      data-path="api/volunteer-registrations/{id}/status"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('PATCHapi-volunteer-registrations--id--status', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-PATCHapi-volunteer-registrations--id--status"
                    onclick="tryItOut('PATCHapi-volunteer-registrations--id--status');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-PATCHapi-volunteer-registrations--id--status"
                    onclick="cancelTryOut('PATCHapi-volunteer-registrations--id--status');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-PATCHapi-volunteer-registrations--id--status"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-purple">PATCH</small>
            <b><code>api/volunteer-registrations/{id}/status</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="PATCHapi-volunteer-registrations--id--status"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="PATCHapi-volunteer-registrations--id--status"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="PATCHapi-volunteer-registrations--id--status"
               value="1"
               data-component="url">
    <br>
<p>The ID of the volunteer registration. Example: <code>1</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>status</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="status"                data-endpoint="PATCHapi-volunteer-registrations--id--status"
               value="rejected"
               data-component="body">
    <br>
<p>Example: <code>rejected</code></p>
Must be one of:
<ul style="list-style-type: square;"><li><code>accepted</code></li> <li><code>rejected</code></li> <li><code>pending</code></li></ul>
        </div>
        </form>

                    <h2 id="pendaftaran-relawan-GETapi-my-volunteer-registrations">Riwayat Pendaftaran Relawan Saya</h2>

<p>
</p>

<p>Relawan: Melihat daftar kegiatan kerelawanan yang pernah didaftar.</p>

<span id="example-requests-GETapi-my-volunteer-registrations">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/my-volunteer-registrations" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/my-volunteer-registrations"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/my-volunteer-registrations';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-my-volunteer-registrations">
            <blockquote>
            <p>Example response (401):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;message&quot;: &quot;Unauthenticated.&quot;
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-my-volunteer-registrations" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-my-volunteer-registrations"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-my-volunteer-registrations"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-my-volunteer-registrations" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-my-volunteer-registrations">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-my-volunteer-registrations" data-method="GET"
      data-path="api/my-volunteer-registrations"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-my-volunteer-registrations', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-my-volunteer-registrations"
                    onclick="tryItOut('GETapi-my-volunteer-registrations');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-my-volunteer-registrations"
                    onclick="cancelTryOut('GETapi-my-volunteer-registrations');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-my-volunteer-registrations"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/my-volunteer-registrations</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-my-volunteer-registrations"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-my-volunteer-registrations"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                <h1 id="pencairan-dana">Pencairan Dana</h1>

    <p>Pengajuan dan persetujuan pencairan dana kampanye (FR-11).</p>

                                <h2 id="pencairan-dana-POSTapi-campaigns--id--disbursements">Ajukan Pencairan Dana (Inisiator)</h2>

<p>
</p>

<p>Inisiator: Mengajukan Pencairan Dana (FR-11).</p>

<span id="example-requests-POSTapi-campaigns--id--disbursements">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost:8000/api/campaigns/1/disbursements" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"amount\": 6420,
    \"bank_name\": \"n\",
    \"bank_account\": \"g\"
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/campaigns/1/disbursements"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "amount": 6420,
    "bank_name": "n",
    "bank_account": "g"
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/campaigns/1/disbursements';
$response = $client-&gt;post(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'amount' =&gt; 6420,
            'bank_name' =&gt; 'n',
            'bank_account' =&gt; 'g',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-POSTapi-campaigns--id--disbursements">
</span>
<span id="execution-results-POSTapi-campaigns--id--disbursements" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-campaigns--id--disbursements"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-campaigns--id--disbursements"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-campaigns--id--disbursements" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-campaigns--id--disbursements">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-campaigns--id--disbursements" data-method="POST"
      data-path="api/campaigns/{id}/disbursements"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-campaigns--id--disbursements', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-campaigns--id--disbursements"
                    onclick="tryItOut('POSTapi-campaigns--id--disbursements');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-campaigns--id--disbursements"
                    onclick="cancelTryOut('POSTapi-campaigns--id--disbursements');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-campaigns--id--disbursements"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/campaigns/{id}/disbursements</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-campaigns--id--disbursements"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-campaigns--id--disbursements"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="POSTapi-campaigns--id--disbursements"
               value="1"
               data-component="url">
    <br>
<p>The ID of the campaign. Example: <code>1</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>amount</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="amount"                data-endpoint="POSTapi-campaigns--id--disbursements"
               value="6420"
               data-component="body">
    <br>
<p>Must be at least 10000. Example: <code>6420</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>bank_name</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="bank_name"                data-endpoint="POSTapi-campaigns--id--disbursements"
               value="n"
               data-component="body">
    <br>
<p>Must not be greater than 100 characters. Example: <code>n</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>bank_account</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="bank_account"                data-endpoint="POSTapi-campaigns--id--disbursements"
               value="g"
               data-component="body">
    <br>
<p>Must not be greater than 50 characters. Example: <code>g</code></p>
        </div>
        </form>

                    <h2 id="pencairan-dana-GETapi-campaigns--id--disbursements">Riwayat Pencairan Kampanye (Inisiator)</h2>

<p>
</p>

<p>Inisiator: Melihat Riwayat Pencairan Dana Kampanye Miliknya.</p>

<span id="example-requests-GETapi-campaigns--id--disbursements">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/campaigns/1/disbursements" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/campaigns/1/disbursements"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/campaigns/1/disbursements';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-campaigns--id--disbursements">
            <blockquote>
            <p>Example response (401):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;message&quot;: &quot;Unauthenticated.&quot;
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-campaigns--id--disbursements" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-campaigns--id--disbursements"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-campaigns--id--disbursements"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-campaigns--id--disbursements" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-campaigns--id--disbursements">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-campaigns--id--disbursements" data-method="GET"
      data-path="api/campaigns/{id}/disbursements"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-campaigns--id--disbursements', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-campaigns--id--disbursements"
                    onclick="tryItOut('GETapi-campaigns--id--disbursements');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-campaigns--id--disbursements"
                    onclick="cancelTryOut('GETapi-campaigns--id--disbursements');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-campaigns--id--disbursements"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/campaigns/{id}/disbursements</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-campaigns--id--disbursements"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-campaigns--id--disbursements"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="GETapi-campaigns--id--disbursements"
               value="1"
               data-component="url">
    <br>
<p>The ID of the campaign. Example: <code>1</code></p>
            </div>
                    </form>

                    <h2 id="pencairan-dana-PATCHapi-admin-disbursements--id--status">Setujui / Tolak Pencairan Dana (Admin, ACID)</h2>

<p>
</p>

<p>Admin: Menyetujui atau Menolak Pencairan Dana (FR-11).
WAJIB ACID Transaction &amp; lockForUpdate() untuk mencegah double-withdraw.</p>

<span id="example-requests-PATCHapi-admin-disbursements--id--status">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request PATCH \
    "http://localhost:8000/api/admin/disbursements/architecto/status" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"status\": \"approved\",
    \"admin_notes\": \"architecto\"
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/admin/disbursements/architecto/status"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "status": "approved",
    "admin_notes": "architecto"
};

fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/admin/disbursements/architecto/status';
$response = $client-&gt;patch(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'status' =&gt; 'approved',
            'admin_notes' =&gt; 'architecto',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-PATCHapi-admin-disbursements--id--status">
</span>
<span id="execution-results-PATCHapi-admin-disbursements--id--status" hidden>
    <blockquote>Received response<span
                id="execution-response-status-PATCHapi-admin-disbursements--id--status"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-PATCHapi-admin-disbursements--id--status"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-PATCHapi-admin-disbursements--id--status" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-PATCHapi-admin-disbursements--id--status">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-PATCHapi-admin-disbursements--id--status" data-method="PATCH"
      data-path="api/admin/disbursements/{id}/status"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('PATCHapi-admin-disbursements--id--status', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-PATCHapi-admin-disbursements--id--status"
                    onclick="tryItOut('PATCHapi-admin-disbursements--id--status');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-PATCHapi-admin-disbursements--id--status"
                    onclick="cancelTryOut('PATCHapi-admin-disbursements--id--status');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-PATCHapi-admin-disbursements--id--status"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-purple">PATCH</small>
            <b><code>api/admin/disbursements/{id}/status</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="PATCHapi-admin-disbursements--id--status"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="PATCHapi-admin-disbursements--id--status"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="id"                data-endpoint="PATCHapi-admin-disbursements--id--status"
               value="architecto"
               data-component="url">
    <br>
<p>The ID of the disbursement. Example: <code>architecto</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>status</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="status"                data-endpoint="PATCHapi-admin-disbursements--id--status"
               value="approved"
               data-component="body">
    <br>
<p>Example: <code>approved</code></p>
Must be one of:
<ul style="list-style-type: square;"><li><code>approved</code></li> <li><code>rejected</code></li></ul>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>admin_notes</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="admin_notes"                data-endpoint="PATCHapi-admin-disbursements--id--status"
               value="architecto"
               data-component="body">
    <br>
<p>Example: <code>architecto</code></p>
        </div>
        </form>

                <h1 id="laporan-aduan">Laporan Aduan</h1>

    <p>Pelaporan kampanye fiktif oleh publik (FR-13).</p>

                                <h2 id="laporan-aduan-POSTapi-campaigns--id--reports">Kirim Laporan Aduan Kampanye</h2>

<p>
</p>

<p>Publik / User: Mengirimkan form aduan kampanye fiktif/penipuan (FR-13).</p>

<span id="example-requests-POSTapi-campaigns--id--reports">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost:8000/api/campaigns/1/reports" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"reporter_email\": \"gbailey@example.net\",
    \"reason_category\": \"m\",
    \"description\": \"Eius et animi quos velit et.\"
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/campaigns/1/reports"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "reporter_email": "gbailey@example.net",
    "reason_category": "m",
    "description": "Eius et animi quos velit et."
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/campaigns/1/reports';
$response = $client-&gt;post(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'reporter_email' =&gt; 'gbailey@example.net',
            'reason_category' =&gt; 'm',
            'description' =&gt; 'Eius et animi quos velit et.',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-POSTapi-campaigns--id--reports">
</span>
<span id="execution-results-POSTapi-campaigns--id--reports" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-campaigns--id--reports"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-campaigns--id--reports"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-campaigns--id--reports" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-campaigns--id--reports">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-campaigns--id--reports" data-method="POST"
      data-path="api/campaigns/{id}/reports"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-campaigns--id--reports', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-campaigns--id--reports"
                    onclick="tryItOut('POSTapi-campaigns--id--reports');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-campaigns--id--reports"
                    onclick="cancelTryOut('POSTapi-campaigns--id--reports');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-campaigns--id--reports"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/campaigns/{id}/reports</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-campaigns--id--reports"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-campaigns--id--reports"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="POSTapi-campaigns--id--reports"
               value="1"
               data-component="url">
    <br>
<p>The ID of the campaign. Example: <code>1</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>reporter_email</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="reporter_email"                data-endpoint="POSTapi-campaigns--id--reports"
               value="gbailey@example.net"
               data-component="body">
    <br>
<p>Must be a valid email address. Must not be greater than 255 characters. Example: <code>gbailey@example.net</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>reason_category</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="reason_category"                data-endpoint="POSTapi-campaigns--id--reports"
               value="m"
               data-component="body">
    <br>
<p>Must not be greater than 100 characters. Example: <code>m</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>description</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="description"                data-endpoint="POSTapi-campaigns--id--reports"
               value="Eius et animi quos velit et."
               data-component="body">
    <br>
<p>Example: <code>Eius et animi quos velit et.</code></p>
        </div>
        </form>

                    <h2 id="laporan-aduan-GETapi-admin-reports">Daftar Laporan Aduan (Admin)</h2>

<p>
</p>

<p>Admin: Melihat daftar laporan/aduan kampanye masuk (FR-13).</p>

<span id="example-requests-GETapi-admin-reports">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/admin/reports" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/admin/reports"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/admin/reports';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-admin-reports">
            <blockquote>
            <p>Example response (401):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;message&quot;: &quot;Unauthenticated.&quot;
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-admin-reports" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-admin-reports"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-admin-reports"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-admin-reports" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-admin-reports">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-admin-reports" data-method="GET"
      data-path="api/admin/reports"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-admin-reports', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-admin-reports"
                    onclick="tryItOut('GETapi-admin-reports');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-admin-reports"
                    onclick="cancelTryOut('GETapi-admin-reports');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-admin-reports"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/admin/reports</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-admin-reports"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-admin-reports"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                <h1 id="administrator">Administrator</h1>

    <p>Endpoint moderasi kampanye dan verifikasi pengguna khusus Admin.</p>

                                <h2 id="administrator-GETapi-admin-campaigns">Semua Kampanye (Moderasi Admin)</h2>

<p>
</p>

<p>Admin: Melihat daftar semua kampanye untuk moderasi.</p>

<span id="example-requests-GETapi-admin-campaigns">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/admin/campaigns" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/admin/campaigns"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/admin/campaigns';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-admin-campaigns">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;success&quot;: true,
    &quot;data&quot;: [
        {
            &quot;id&quot;: 10,
            &quot;user_id&quot;: 2,
            &quot;category_id&quot;: 1,
            &quot;title&quot;: &quot;Uji Coba Moderasi Kampanye Baru 1792862057985&quot;,
            &quot;description&quot;: &quot;Deskripsi lengkap uji coba kampanye baru agar masuk ke antrean moderasi admin.&quot;,
            &quot;target_amount&quot;: &quot;10000000.00&quot;,
            &quot;current_amount&quot;: &quot;0.00&quot;,
            &quot;target_volunteers&quot;: 5,
            &quot;current_volunteers&quot;: 0,
            &quot;location&quot;: &quot;Bandung, Jawa Barat&quot;,
            &quot;activity_date&quot;: null,
            &quot;status&quot;: &quot;active&quot;,
            &quot;campaign_mode&quot;: &quot;both&quot;,
            &quot;created_at&quot;: &quot;2026-10-24T17:14:18.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-25T11:45:13.000000Z&quot;,
            &quot;image_url&quot;: null,
            &quot;category&quot;: {
                &quot;id&quot;: 1,
                &quot;category_name&quot;: &quot;Bencana Alam&quot;,
                &quot;created_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;,
                &quot;updated_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;
            },
            &quot;user&quot;: {
                &quot;id&quot;: 2,
                &quot;name&quot;: &quot;Yayasan Peduli Bersama&quot;,
                &quot;email&quot;: &quot;inisiator@actgiving.com&quot;,
                &quot;is_verified&quot;: true
            },
            &quot;lpj_reports&quot;: []
        },
        {
            &quot;id&quot;: 2,
            &quot;user_id&quot;: 4,
            &quot;category_id&quot;: 1,
            &quot;title&quot;: &quot;Bantuan Darurat Medis &amp; Masker untuk Korban Kabut Asap Karhutla Kalimantan&quot;,
            &quot;description&quot;: &quot;Kebakaran hutan dan lahan (Karhutla) di Kalimantan semakin meluas, menyebabkan kabut asap pekat yang menyelimuti pemukiman. Jarak pandang menurun drastis dan ribuan warga, terutama balita dan lansia, mulai berjatuhan sakit akibat ISPA (Infeksi Saluran Pernapasan Akut). Kami sangat membutuhkan dana darurat untuk pengadaan masker N95, tabung oksigen portabel, obat-obatan pernapasan, dan vitamin. Kami juga memanggil relawan untuk turun langsung membantu evakuasi warga rentan dan mendistribusikan bantuan medis dari rumah ke rumah. Mari bergerak cepat selamatkan napas saudara kita!&quot;,
            &quot;target_amount&quot;: &quot;10000000.00&quot;,
            &quot;current_amount&quot;: &quot;10010000.00&quot;,
            &quot;target_volunteers&quot;: 20,
            &quot;current_volunteers&quot;: 1,
            &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;,
            &quot;activity_date&quot;: &quot;2026-10-29T00:00:00.000000Z&quot;,
            &quot;status&quot;: &quot;active&quot;,
            &quot;campaign_mode&quot;: &quot;both&quot;,
            &quot;created_at&quot;: &quot;2026-10-21T16:43:14.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-28T13:50:11.000000Z&quot;,
            &quot;image_url&quot;: &quot;http://127.0.0.1:8000/storage/campaigns/ff131484-5b78-4db8-a1f9-beb8cac09a76_1792647116.jpeg&quot;,
            &quot;category&quot;: {
                &quot;id&quot;: 1,
                &quot;category_name&quot;: &quot;Bencana Alam&quot;,
                &quot;created_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;,
                &quot;updated_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;
            },
            &quot;user&quot;: {
                &quot;id&quot;: 4,
                &quot;name&quot;: &quot;fadhilah azzahra&quot;,
                &quot;email&quot;: &quot;azzahra@actgiving.com&quot;,
                &quot;is_verified&quot;: false
            },
            &quot;lpj_reports&quot;: [
                {
                    &quot;id&quot;: 3,
                    &quot;campaign_id&quot;: 2,
                    &quot;description&quot;: &quot;Puji syukur, distribusi bantuan tahap pertama berjalan lancar meski jarak pandang sangat terbatas akibat kabut asap pekat. Tim relawan berhasil mendistribusikan 500 masker N95 secara door-to-door kepada warga rentan (lansia dan balita) di Kecamatan Jekan Raya. Kami juga mengaktifkan posko oksigen darurat yang langsung menangani puluhan warga dengan gejala sesak napas akut pada hari pertama. Respons warga sangat haru dan berterima kasih. Bantuan dari para donatur sangat menyelamatkan nyawa mereka hari ini. Selanjutnya, kami akan memperluas area distribusi logistik medis ke kecamatan tetangga.&quot;,
                    &quot;proof_image_url&quot;: &quot;http://127.0.0.1:8000/storage/lpj_proofs/bb5d4029-cdc9-458a-ae47-45e5721ef7a6_1793199218.jpeg&quot;,
                    &quot;created_at&quot;: &quot;2026-10-28T14:53:38.000000Z&quot;,
                    &quot;updated_at&quot;: &quot;2026-10-28T14:53:38.000000Z&quot;,
                    &quot;activity_photos&quot;: [
                        &quot;http://127.0.0.1:8000/storage/lpj_proofs/bb5d4029-cdc9-458a-ae47-45e5721ef7a6_1793199218.jpeg&quot;,
                        &quot;http://127.0.0.1:8000/storage/lpj_proofs/71d19770-0b75-4aed-bb64-91bbbef8a305_1793199218.jpeg&quot;
                    ],
                    &quot;status&quot;: &quot;pending&quot;,
                    &quot;title&quot;: &quot;Laporan Penggunaan Dana&quot;,
                    &quot;amount_spent&quot;: &quot;1000000.00&quot;,
                    &quot;budget_items&quot;: [
                        {
                            &quot;name&quot;: &quot;Masker&quot;,
                            &quot;amount&quot;: 1000000
                        }
                    ],
                    &quot;beneficiaries_count&quot;: 100,
                    &quot;volunteers_involved&quot;: 20,
                    &quot;field_location&quot;: &quot;Kalimantan&quot;,
                    &quot;verified_at&quot;: null,
                    &quot;is_final&quot;: false,
                    &quot;report_type&quot;: &quot;progress&quot;,
                    &quot;total_realisasi&quot;: 1000000,
                    &quot;realized_amount&quot;: 1000000
                }
            ]
        },
        {
            &quot;id&quot;: 1,
            &quot;user_id&quot;: 2,
            &quot;category_id&quot;: 1,
            &quot;title&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
            &quot;description&quot;: &quot;Penyaluran logistik darurat, masker, makanan siap saji, dan posko medis untuk warga terdampak erupsi Semeru.&quot;,
            &quot;target_amount&quot;: &quot;50000000.00&quot;,
            &quot;current_amount&quot;: &quot;15575000.00&quot;,
            &quot;target_volunteers&quot;: 10,
            &quot;current_volunteers&quot;: 4,
            &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;,
            &quot;activity_date&quot;: &quot;2026-10-28T00:00:00.000000Z&quot;,
            &quot;status&quot;: &quot;active&quot;,
            &quot;campaign_mode&quot;: &quot;both&quot;,
            &quot;created_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-24T17:15:28.000000Z&quot;,
            &quot;image_url&quot;: null,
            &quot;category&quot;: {
                &quot;id&quot;: 1,
                &quot;category_name&quot;: &quot;Bencana Alam&quot;,
                &quot;created_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;,
                &quot;updated_at&quot;: &quot;2026-10-14T02:54:38.000000Z&quot;
            },
            &quot;user&quot;: {
                &quot;id&quot;: 2,
                &quot;name&quot;: &quot;Yayasan Peduli Bersama&quot;,
                &quot;email&quot;: &quot;inisiator@actgiving.com&quot;,
                &quot;is_verified&quot;: true
            },
            &quot;lpj_reports&quot;: [
                {
                    &quot;id&quot;: 2,
                    &quot;campaign_id&quot;: 1,
                    &quot;description&quot;: &quot;Distribusi sembako dan obat-obatan tahap dua kepada 150 KK warga terdampak bencana.&quot;,
                    &quot;proof_image_url&quot;: &quot;http://127.0.0.1:8000/storage/lpj_proofs/753a91e5-a2dc-42a9-b2dc-472b3b9b7997_1792862266.png&quot;,
                    &quot;created_at&quot;: &quot;2026-10-24T17:17:46.000000Z&quot;,
                    &quot;updated_at&quot;: &quot;2026-10-28T13:51:07.000000Z&quot;,
                    &quot;activity_photos&quot;: [
                        &quot;http://127.0.0.1:8000/storage/lpj_proofs/753a91e5-a2dc-42a9-b2dc-472b3b9b7997_1792862266.png&quot;
                    ],
                    &quot;status&quot;: &quot;pending_audit&quot;,
                    &quot;title&quot;: &quot;LPJ Pengadaan Logistik Tahap 2&quot;,
                    &quot;amount_spent&quot;: &quot;12500000.00&quot;,
                    &quot;budget_items&quot;: null,
                    &quot;beneficiaries_count&quot;: 0,
                    &quot;volunteers_involved&quot;: 0,
                    &quot;field_location&quot;: &quot;Posko Tanggap Darurat Bencana&quot;,
                    &quot;verified_at&quot;: null,
                    &quot;is_final&quot;: false,
                    &quot;report_type&quot;: &quot;progress&quot;,
                    &quot;total_realisasi&quot;: 12500000,
                    &quot;realized_amount&quot;: 12500000
                }
            ]
        }
    ]
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-admin-campaigns" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-admin-campaigns"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-admin-campaigns"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-admin-campaigns" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-admin-campaigns">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-admin-campaigns" data-method="GET"
      data-path="api/admin/campaigns"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-admin-campaigns', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-admin-campaigns"
                    onclick="tryItOut('GETapi-admin-campaigns');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-admin-campaigns"
                    onclick="cancelTryOut('GETapi-admin-campaigns');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-admin-campaigns"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/admin/campaigns</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-admin-campaigns"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-admin-campaigns"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                    <h2 id="administrator-PATCHapi-admin-campaigns--id--status">Ubah Status Kampanye (Admin)</h2>

<p>
</p>

<p>Admin: Moderasi status kampanye (active / rejected / closed).</p>

<span id="example-requests-PATCHapi-admin-campaigns--id--status">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request PATCH \
    "http://localhost:8000/api/admin/campaigns/1/status" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"status\": \"rejected\"
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/admin/campaigns/1/status"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "status": "rejected"
};

fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/admin/campaigns/1/status';
$response = $client-&gt;patch(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'status' =&gt; 'rejected',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-PATCHapi-admin-campaigns--id--status">
</span>
<span id="execution-results-PATCHapi-admin-campaigns--id--status" hidden>
    <blockquote>Received response<span
                id="execution-response-status-PATCHapi-admin-campaigns--id--status"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-PATCHapi-admin-campaigns--id--status"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-PATCHapi-admin-campaigns--id--status" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-PATCHapi-admin-campaigns--id--status">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-PATCHapi-admin-campaigns--id--status" data-method="PATCH"
      data-path="api/admin/campaigns/{id}/status"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('PATCHapi-admin-campaigns--id--status', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-PATCHapi-admin-campaigns--id--status"
                    onclick="tryItOut('PATCHapi-admin-campaigns--id--status');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-PATCHapi-admin-campaigns--id--status"
                    onclick="cancelTryOut('PATCHapi-admin-campaigns--id--status');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-PATCHapi-admin-campaigns--id--status"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-purple">PATCH</small>
            <b><code>api/admin/campaigns/{id}/status</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="PATCHapi-admin-campaigns--id--status"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="PATCHapi-admin-campaigns--id--status"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="PATCHapi-admin-campaigns--id--status"
               value="1"
               data-component="url">
    <br>
<p>The ID of the campaign. Example: <code>1</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>status</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="status"                data-endpoint="PATCHapi-admin-campaigns--id--status"
               value="rejected"
               data-component="body">
    <br>
<p>Example: <code>rejected</code></p>
Must be one of:
<ul style="list-style-type: square;"><li><code>active</code></li> <li><code>rejected</code></li> <li><code>closed</code></li></ul>
        </div>
        </form>

                    <h2 id="administrator-GETapi-admin-users">Daftar Pengguna (Admin)</h2>

<p>
</p>

<p>Admin: Melihat daftar pengguna sistem.</p>

<span id="example-requests-GETapi-admin-users">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/admin/users" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/admin/users"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/admin/users';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-admin-users">
            <blockquote>
            <p>Example response (401):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;message&quot;: &quot;Unauthenticated.&quot;
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-admin-users" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-admin-users"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-admin-users"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-admin-users" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-admin-users">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-admin-users" data-method="GET"
      data-path="api/admin/users"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-admin-users', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-admin-users"
                    onclick="tryItOut('GETapi-admin-users');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-admin-users"
                    onclick="cancelTryOut('GETapi-admin-users');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-admin-users"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/admin/users</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-admin-users"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-admin-users"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                    <h2 id="administrator-PATCHapi-admin-users--id--verify">Verifikasi Pengguna / Inisiator (Admin)</h2>

<p>
</p>

<p>Admin: Verifikasi dokumen identitas pengguna/inisiator.</p>

<span id="example-requests-PATCHapi-admin-users--id--verify">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request PATCH \
    "http://localhost:8000/api/admin/users/1/verify" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"is_verified\": false
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/admin/users/1/verify"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "is_verified": false
};

fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/admin/users/1/verify';
$response = $client-&gt;patch(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'is_verified' =&gt; false,
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-PATCHapi-admin-users--id--verify">
</span>
<span id="execution-results-PATCHapi-admin-users--id--verify" hidden>
    <blockquote>Received response<span
                id="execution-response-status-PATCHapi-admin-users--id--verify"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-PATCHapi-admin-users--id--verify"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-PATCHapi-admin-users--id--verify" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-PATCHapi-admin-users--id--verify">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-PATCHapi-admin-users--id--verify" data-method="PATCH"
      data-path="api/admin/users/{id}/verify"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('PATCHapi-admin-users--id--verify', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-PATCHapi-admin-users--id--verify"
                    onclick="tryItOut('PATCHapi-admin-users--id--verify');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-PATCHapi-admin-users--id--verify"
                    onclick="cancelTryOut('PATCHapi-admin-users--id--verify');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-PATCHapi-admin-users--id--verify"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-purple">PATCH</small>
            <b><code>api/admin/users/{id}/verify</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="PATCHapi-admin-users--id--verify"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="PATCHapi-admin-users--id--verify"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="PATCHapi-admin-users--id--verify"
               value="1"
               data-component="url">
    <br>
<p>The ID of the user. Example: <code>1</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>is_verified</code></b>&nbsp;&nbsp;
<small>boolean</small>&nbsp;
 &nbsp;
 &nbsp;
                <label data-endpoint="PATCHapi-admin-users--id--verify" style="display: none">
            <input type="radio" name="is_verified"
                   value="true"
                   data-endpoint="PATCHapi-admin-users--id--verify"
                   data-component="body"             >
            <code>true</code>
        </label>
        <label data-endpoint="PATCHapi-admin-users--id--verify" style="display: none">
            <input type="radio" name="is_verified"
                   value="false"
                   data-endpoint="PATCHapi-admin-users--id--verify"
                   data-component="body"             >
            <code>false</code>
        </label>
    <br>
<p>Example: <code>false</code></p>
        </div>
        </form>

                <h1 id="laporan-pertanggungjawaban-lpj">Laporan Pertanggungjawaban (LPJ)</h1>

    <p>Endpoint pengelolaan LPJ digital, verifikasi audit admin, dan kontrol status.</p>

                                <h2 id="laporan-pertanggungjawaban-lpj-GETapi-campaigns--id--lpj">Daftar LPJ Publik Suatu Kampanye</h2>

<p>
</p>

<p>HANYA menampilkan LPJ yang berstatus 'verified' atau 'sah' untuk konsumsi publik.
Inisiator pemilik kampanye atau Admin dapat melihat seluruh status bila diminta.</p>

<span id="example-requests-GETapi-campaigns--id--lpj">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/campaigns/1/lpj" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/campaigns/1/lpj"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/campaigns/1/lpj';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-campaigns--id--lpj">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;success&quot;: true,
    &quot;data&quot;: {
        &quot;campaign_id&quot;: 1,
        &quot;campaign_title&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
        &quot;lpj_reports&quot;: []
    }
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-campaigns--id--lpj" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-campaigns--id--lpj"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-campaigns--id--lpj"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-campaigns--id--lpj" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-campaigns--id--lpj">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-campaigns--id--lpj" data-method="GET"
      data-path="api/campaigns/{id}/lpj"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-campaigns--id--lpj', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-campaigns--id--lpj"
                    onclick="tryItOut('GETapi-campaigns--id--lpj');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-campaigns--id--lpj"
                    onclick="cancelTryOut('GETapi-campaigns--id--lpj');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-campaigns--id--lpj"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/campaigns/{id}/lpj</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-campaigns--id--lpj"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-campaigns--id--lpj"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="GETapi-campaigns--id--lpj"
               value="1"
               data-component="url">
    <br>
<p>The ID of the campaign. Example: <code>1</code></p>
            </div>
                    </form>

                    <h2 id="laporan-pertanggungjawaban-lpj-GETapi-admin-lpj">Daftar Seluruh LPJ untuk Audit Admin</h2>

<p>
</p>

<p>Admin: Melihat seluruh antrean LPJ beserta statusnya.</p>

<span id="example-requests-GETapi-admin-lpj">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost:8000/api/admin/lpj" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/admin/lpj"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/admin/lpj';
$response = $client-&gt;get(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-GETapi-admin-lpj">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
vary: Origin
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;success&quot;: true,
    &quot;data&quot;: [
        {
            &quot;id&quot;: 3,
            &quot;campaign_id&quot;: 2,
            &quot;description&quot;: &quot;Puji syukur, distribusi bantuan tahap pertama berjalan lancar meski jarak pandang sangat terbatas akibat kabut asap pekat. Tim relawan berhasil mendistribusikan 500 masker N95 secara door-to-door kepada warga rentan (lansia dan balita) di Kecamatan Jekan Raya. Kami juga mengaktifkan posko oksigen darurat yang langsung menangani puluhan warga dengan gejala sesak napas akut pada hari pertama. Respons warga sangat haru dan berterima kasih. Bantuan dari para donatur sangat menyelamatkan nyawa mereka hari ini. Selanjutnya, kami akan memperluas area distribusi logistik medis ke kecamatan tetangga.&quot;,
            &quot;proof_image_url&quot;: &quot;http://127.0.0.1:8000/storage/lpj_proofs/bb5d4029-cdc9-458a-ae47-45e5721ef7a6_1793199218.jpeg&quot;,
            &quot;created_at&quot;: &quot;2026-10-28T14:53:38.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-28T14:53:38.000000Z&quot;,
            &quot;activity_photos&quot;: [
                &quot;http://127.0.0.1:8000/storage/lpj_proofs/bb5d4029-cdc9-458a-ae47-45e5721ef7a6_1793199218.jpeg&quot;,
                &quot;http://127.0.0.1:8000/storage/lpj_proofs/71d19770-0b75-4aed-bb64-91bbbef8a305_1793199218.jpeg&quot;
            ],
            &quot;status&quot;: &quot;pending&quot;,
            &quot;title&quot;: &quot;Laporan Penggunaan Dana&quot;,
            &quot;amount_spent&quot;: &quot;1000000.00&quot;,
            &quot;budget_items&quot;: [
                {
                    &quot;name&quot;: &quot;Masker&quot;,
                    &quot;amount&quot;: 1000000
                }
            ],
            &quot;beneficiaries_count&quot;: 100,
            &quot;volunteers_involved&quot;: 20,
            &quot;field_location&quot;: &quot;Kalimantan&quot;,
            &quot;verified_at&quot;: null,
            &quot;is_final&quot;: false,
            &quot;report_type&quot;: &quot;progress&quot;,
            &quot;total_realisasi&quot;: 1000000,
            &quot;realized_amount&quot;: 1000000,
            &quot;campaign&quot;: {
                &quot;id&quot;: 2,
                &quot;title&quot;: &quot;Bantuan Darurat Medis &amp; Masker untuk Korban Kabut Asap Karhutla Kalimantan&quot;,
                &quot;user_id&quot;: 4,
                &quot;status&quot;: &quot;active&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;,
                &quot;user&quot;: {
                    &quot;id&quot;: 4,
                    &quot;name&quot;: &quot;fadhilah azzahra&quot;,
                    &quot;email&quot;: &quot;azzahra@actgiving.com&quot;
                }
            }
        },
        {
            &quot;id&quot;: 2,
            &quot;campaign_id&quot;: 1,
            &quot;description&quot;: &quot;Distribusi sembako dan obat-obatan tahap dua kepada 150 KK warga terdampak bencana.&quot;,
            &quot;proof_image_url&quot;: &quot;http://127.0.0.1:8000/storage/lpj_proofs/753a91e5-a2dc-42a9-b2dc-472b3b9b7997_1792862266.png&quot;,
            &quot;created_at&quot;: &quot;2026-10-24T17:17:46.000000Z&quot;,
            &quot;updated_at&quot;: &quot;2026-10-28T13:51:07.000000Z&quot;,
            &quot;activity_photos&quot;: [
                &quot;http://127.0.0.1:8000/storage/lpj_proofs/753a91e5-a2dc-42a9-b2dc-472b3b9b7997_1792862266.png&quot;
            ],
            &quot;status&quot;: &quot;pending_audit&quot;,
            &quot;title&quot;: &quot;LPJ Pengadaan Logistik Tahap 2&quot;,
            &quot;amount_spent&quot;: &quot;12500000.00&quot;,
            &quot;budget_items&quot;: null,
            &quot;beneficiaries_count&quot;: 0,
            &quot;volunteers_involved&quot;: 0,
            &quot;field_location&quot;: &quot;Posko Tanggap Darurat Bencana&quot;,
            &quot;verified_at&quot;: null,
            &quot;is_final&quot;: false,
            &quot;report_type&quot;: &quot;progress&quot;,
            &quot;total_realisasi&quot;: 12500000,
            &quot;realized_amount&quot;: 12500000,
            &quot;campaign&quot;: {
                &quot;id&quot;: 1,
                &quot;title&quot;: &quot;Tanggap Darurat Erupsi Gunung Semeru&quot;,
                &quot;user_id&quot;: 2,
                &quot;status&quot;: &quot;active&quot;,
                &quot;location&quot;: &quot;Lumajang, Jawa Timur&quot;,
                &quot;user&quot;: {
                    &quot;id&quot;: 2,
                    &quot;name&quot;: &quot;Yayasan Peduli Bersama&quot;,
                    &quot;email&quot;: &quot;inisiator@actgiving.com&quot;
                }
            }
        }
    ]
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-admin-lpj" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-admin-lpj"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-admin-lpj"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-admin-lpj" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-admin-lpj">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-admin-lpj" data-method="GET"
      data-path="api/admin/lpj"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-admin-lpj', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-admin-lpj"
                    onclick="tryItOut('GETapi-admin-lpj');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-admin-lpj"
                    onclick="cancelTryOut('GETapi-admin-lpj');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-admin-lpj"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/admin/lpj</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-admin-lpj"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-admin-lpj"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                    <h2 id="laporan-pertanggungjawaban-lpj-PATCHapi-admin-lpj--id--status">Ubah Status LPJ oleh Admin (Verifikasi Sah / Batal)</h2>

<p>
</p>

<p>Endpoint: PATCH/PUT /api/admin/lpj/{id}/status atau /api/admin/lpj/{id}</p>

<span id="example-requests-PATCHapi-admin-lpj--id--status">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request PATCH \
    "http://localhost:8000/api/admin/lpj/architecto/status" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"status\": \"pending_audit\"
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/admin/lpj/architecto/status"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "status": "pending_audit"
};

fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/admin/lpj/architecto/status';
$response = $client-&gt;patch(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
        'json' =&gt; [
            'status' =&gt; 'pending_audit',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-PATCHapi-admin-lpj--id--status">
</span>
<span id="execution-results-PATCHapi-admin-lpj--id--status" hidden>
    <blockquote>Received response<span
                id="execution-response-status-PATCHapi-admin-lpj--id--status"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-PATCHapi-admin-lpj--id--status"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-PATCHapi-admin-lpj--id--status" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-PATCHapi-admin-lpj--id--status">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-PATCHapi-admin-lpj--id--status" data-method="PATCH"
      data-path="api/admin/lpj/{id}/status"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('PATCHapi-admin-lpj--id--status', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-PATCHapi-admin-lpj--id--status"
                    onclick="tryItOut('PATCHapi-admin-lpj--id--status');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-PATCHapi-admin-lpj--id--status"
                    onclick="cancelTryOut('PATCHapi-admin-lpj--id--status');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-PATCHapi-admin-lpj--id--status"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-purple">PATCH</small>
            <b><code>api/admin/lpj/{id}/status</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="PATCHapi-admin-lpj--id--status"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="PATCHapi-admin-lpj--id--status"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="id"                data-endpoint="PATCHapi-admin-lpj--id--status"
               value="architecto"
               data-component="url">
    <br>
<p>The ID of the lpj. Example: <code>architecto</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>status</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="status"                data-endpoint="PATCHapi-admin-lpj--id--status"
               value="pending_audit"
               data-component="body">
    <br>
<p>Example: <code>pending_audit</code></p>
Must be one of:
<ul style="list-style-type: square;"><li><code>verified</code></li> <li><code>sah</code></li> <li><code>pending</code></li> <li><code>pending_audit</code></li> <li><code>needs_review</code></li> <li><code>rejected</code></li></ul>
        </div>
        </form>

                    <h2 id="laporan-pertanggungjawaban-lpj-PATCHapi-admin-lpj--id--verify">Verifikasi Sah LPJ (Admin Shortcut)</h2>

<p>
</p>

<p>Endpoint: PATCH /api/admin/lpj/{id}/verify</p>

<span id="example-requests-PATCHapi-admin-lpj--id--verify">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request PATCH \
    "http://localhost:8000/api/admin/lpj/architecto/verify" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/admin/lpj/architecto/verify"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "PATCH",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/admin/lpj/architecto/verify';
$response = $client-&gt;patch(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-PATCHapi-admin-lpj--id--verify">
</span>
<span id="execution-results-PATCHapi-admin-lpj--id--verify" hidden>
    <blockquote>Received response<span
                id="execution-response-status-PATCHapi-admin-lpj--id--verify"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-PATCHapi-admin-lpj--id--verify"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-PATCHapi-admin-lpj--id--verify" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-PATCHapi-admin-lpj--id--verify">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-PATCHapi-admin-lpj--id--verify" data-method="PATCH"
      data-path="api/admin/lpj/{id}/verify"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('PATCHapi-admin-lpj--id--verify', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-PATCHapi-admin-lpj--id--verify"
                    onclick="tryItOut('PATCHapi-admin-lpj--id--verify');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-PATCHapi-admin-lpj--id--verify"
                    onclick="cancelTryOut('PATCHapi-admin-lpj--id--verify');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-PATCHapi-admin-lpj--id--verify"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-purple">PATCH</small>
            <b><code>api/admin/lpj/{id}/verify</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="PATCHapi-admin-lpj--id--verify"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="PATCHapi-admin-lpj--id--verify"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="id"                data-endpoint="PATCHapi-admin-lpj--id--verify"
               value="architecto"
               data-component="url">
    <br>
<p>The ID of the lpj. Example: <code>architecto</code></p>
            </div>
                    </form>

                    <h2 id="laporan-pertanggungjawaban-lpj-PATCHapi-admin-lpj--id--unverify">Batalkan Verifikasi LPJ (Admin Shortcut)</h2>

<p>
</p>

<p>Endpoint: PATCH /api/admin/lpj/{id}/unverify</p>

<span id="example-requests-PATCHapi-admin-lpj--id--unverify">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request PATCH \
    "http://localhost:8000/api/admin/lpj/architecto/unverify" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/admin/lpj/architecto/unverify"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "PATCH",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/admin/lpj/architecto/unverify';
$response = $client-&gt;patch(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-PATCHapi-admin-lpj--id--unverify">
</span>
<span id="execution-results-PATCHapi-admin-lpj--id--unverify" hidden>
    <blockquote>Received response<span
                id="execution-response-status-PATCHapi-admin-lpj--id--unverify"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-PATCHapi-admin-lpj--id--unverify"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-PATCHapi-admin-lpj--id--unverify" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-PATCHapi-admin-lpj--id--unverify">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-PATCHapi-admin-lpj--id--unverify" data-method="PATCH"
      data-path="api/admin/lpj/{id}/unverify"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('PATCHapi-admin-lpj--id--unverify', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-PATCHapi-admin-lpj--id--unverify"
                    onclick="tryItOut('PATCHapi-admin-lpj--id--unverify');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-PATCHapi-admin-lpj--id--unverify"
                    onclick="cancelTryOut('PATCHapi-admin-lpj--id--unverify');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-PATCHapi-admin-lpj--id--unverify"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-purple">PATCH</small>
            <b><code>api/admin/lpj/{id}/unverify</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="PATCHapi-admin-lpj--id--unverify"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="PATCHapi-admin-lpj--id--unverify"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="id"                data-endpoint="PATCHapi-admin-lpj--id--unverify"
               value="architecto"
               data-component="url">
    <br>
<p>The ID of the lpj. Example: <code>architecto</code></p>
            </div>
                    </form>

                    <h2 id="laporan-pertanggungjawaban-lpj-POSTapi-campaigns--id--lpj">Upload LPJ Baru (Inisiator, FR-12)</h2>

<p>
</p>

<p>Status awal: 'pending' (Menunggu Review &amp; Verifikasi Sah oleh Admin).</p>

<span id="example-requests-POSTapi-campaigns--id--lpj">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost:8000/api/campaigns/1/lpj" \
    --header "Content-Type: multipart/form-data" \
    --header "Accept: application/json" \
    --form "description=Eius et animi quos velit et."\
    --form "title=v"\
    --form "amount_spent=42"\
    --form "total_realisasi=37"\
    --form "realized_amount=9"\
    --form "field_location=n"\
    --form "beneficiaries_count=8"\
    --form "volunteers_involved=75"\
    --form "report_type=progress"\
    --form "proof_image=@C:\Users\ASUS\AppData\Local\Temp\php5156.tmp" \
    --form "activity_photos[]=@C:\Users\ASUS\AppData\Local\Temp\php5157.tmp" </code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/campaigns/1/lpj"
);

const headers = {
    "Content-Type": "multipart/form-data",
    "Accept": "application/json",
};

const body = new FormData();
body.append('description', 'Eius et animi quos velit et.');
body.append('title', 'v');
body.append('amount_spent', '42');
body.append('total_realisasi', '37');
body.append('realized_amount', '9');
body.append('field_location', 'n');
body.append('beneficiaries_count', '8');
body.append('volunteers_involved', '75');
body.append('report_type', 'progress');
body.append('proof_image', document.querySelector('input[name="proof_image"]').files[0]);
body.append('activity_photos[]', document.querySelector('input[name="activity_photos[]"]').files[0]);

fetch(url, {
    method: "POST",
    headers,
    body,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/campaigns/1/lpj';
$response = $client-&gt;post(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'multipart/form-data',
            'Accept' =&gt; 'application/json',
        ],
        'multipart' =&gt; [
            [
                'name' =&gt; 'description',
                'contents' =&gt; 'Eius et animi quos velit et.'
            ],
            [
                'name' =&gt; 'title',
                'contents' =&gt; 'v'
            ],
            [
                'name' =&gt; 'amount_spent',
                'contents' =&gt; '42'
            ],
            [
                'name' =&gt; 'total_realisasi',
                'contents' =&gt; '37'
            ],
            [
                'name' =&gt; 'realized_amount',
                'contents' =&gt; '9'
            ],
            [
                'name' =&gt; 'field_location',
                'contents' =&gt; 'n'
            ],
            [
                'name' =&gt; 'beneficiaries_count',
                'contents' =&gt; '8'
            ],
            [
                'name' =&gt; 'volunteers_involved',
                'contents' =&gt; '75'
            ],
            [
                'name' =&gt; 'report_type',
                'contents' =&gt; 'progress'
            ],
            [
                'name' =&gt; 'proof_image',
                'contents' =&gt; fopen('C:\Users\ASUS\AppData\Local\Temp\php5156.tmp', 'r')
            ],
            [
                'name' =&gt; 'activity_photos[]',
                'contents' =&gt; fopen('C:\Users\ASUS\AppData\Local\Temp\php5157.tmp', 'r')
            ],
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-POSTapi-campaigns--id--lpj">
</span>
<span id="execution-results-POSTapi-campaigns--id--lpj" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-campaigns--id--lpj"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-campaigns--id--lpj"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-campaigns--id--lpj" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-campaigns--id--lpj">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-campaigns--id--lpj" data-method="POST"
      data-path="api/campaigns/{id}/lpj"
      data-authed="0"
      data-hasfiles="1"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-campaigns--id--lpj', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-campaigns--id--lpj"
                    onclick="tryItOut('POSTapi-campaigns--id--lpj');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-campaigns--id--lpj"
                    onclick="cancelTryOut('POSTapi-campaigns--id--lpj');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-campaigns--id--lpj"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/campaigns/{id}/lpj</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-campaigns--id--lpj"
               value="multipart/form-data"
               data-component="header">
    <br>
<p>Example: <code>multipart/form-data</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-campaigns--id--lpj"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="POSTapi-campaigns--id--lpj"
               value="1"
               data-component="url">
    <br>
<p>The ID of the campaign. Example: <code>1</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>description</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="description"                data-endpoint="POSTapi-campaigns--id--lpj"
               value="Eius et animi quos velit et."
               data-component="body">
    <br>
<p>Must be at least 10 characters. Example: <code>Eius et animi quos velit et.</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>title</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="title"                data-endpoint="POSTapi-campaigns--id--lpj"
               value="v"
               data-component="body">
    <br>
<p>Must not be greater than 255 characters. Example: <code>v</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>amount_spent</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="amount_spent"                data-endpoint="POSTapi-campaigns--id--lpj"
               value="42"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>42</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>total_realisasi</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="total_realisasi"                data-endpoint="POSTapi-campaigns--id--lpj"
               value="37"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>37</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>realized_amount</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="realized_amount"                data-endpoint="POSTapi-campaigns--id--lpj"
               value="9"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>9</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>field_location</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="field_location"                data-endpoint="POSTapi-campaigns--id--lpj"
               value="n"
               data-component="body">
    <br>
<p>Must not be greater than 255 characters. Example: <code>n</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>beneficiaries_count</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="beneficiaries_count"                data-endpoint="POSTapi-campaigns--id--lpj"
               value="8"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>8</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>volunteers_involved</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="volunteers_involved"                data-endpoint="POSTapi-campaigns--id--lpj"
               value="75"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>75</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>budget_items</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="budget_items"                data-endpoint="POSTapi-campaigns--id--lpj"
               value=""
               data-component="body">
    <br>

        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>is_final</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="is_final"                data-endpoint="POSTapi-campaigns--id--lpj"
               value=""
               data-component="body">
    <br>

        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>report_type</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="report_type"                data-endpoint="POSTapi-campaigns--id--lpj"
               value="progress"
               data-component="body">
    <br>
<p>Example: <code>progress</code></p>
Must be one of:
<ul style="list-style-type: square;"><li><code>progress</code></li> <li><code>final</code></li></ul>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>proof_image</code></b>&nbsp;&nbsp;
<small>file</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="file" style="display: none"
                              name="proof_image"                data-endpoint="POSTapi-campaigns--id--lpj"
               value=""
               data-component="body">
    <br>
<p>Must be a file. Must be an image. Must not be greater than 5120 kilobytes. Example: <code>C:\Users\ASUS\AppData\Local\Temp\php5156.tmp</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>activity_photos</code></b>&nbsp;&nbsp;
<small>file[]</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="file" style="display: none"
                              name="activity_photos[0]"                data-endpoint="POSTapi-campaigns--id--lpj"
               data-component="body">
        <input type="file" style="display: none"
               name="activity_photos[1]"                data-endpoint="POSTapi-campaigns--id--lpj"
               data-component="body">
    <br>
<p>Must be a file. Must be an image. Must not be greater than 5120 kilobytes.</p>
        </div>
        </form>

                    <h2 id="laporan-pertanggungjawaban-lpj-PUTapi-campaigns--campaign_id--lpj--id-">Update LPJ (Inisiator)</h2>

<p>
</p>

<p>ATURAN PENGUNCIAN: Jika LPJ sudah berstatus 'verified' atau 'sah',
Inisiator DILARANG mengubah data (Read-Only / 403 Forbidden).</p>

<span id="example-requests-PUTapi-campaigns--campaign_id--lpj--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request PUT \
    "http://localhost:8000/api/campaigns/1/lpj/architecto" \
    --header "Content-Type: multipart/form-data" \
    --header "Accept: application/json" \
    --form "title=b"\
    --form "description=Et animi quos velit et fugiat."\
    --form "amount_spent=42"\
    --form "total_realisasi=37"\
    --form "realized_amount=9"\
    --form "field_location=n"\
    --form "beneficiaries_count=8"\
    --form "volunteers_involved=75"\
    --form "report_type=final"\
    --form "proof_image=@C:\Users\ASUS\AppData\Local\Temp\php5169.tmp" \
    --form "activity_photos[]=@C:\Users\ASUS\AppData\Local\Temp\php516A.tmp" </code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/campaigns/1/lpj/architecto"
);

const headers = {
    "Content-Type": "multipart/form-data",
    "Accept": "application/json",
};

const body = new FormData();
body.append('title', 'b');
body.append('description', 'Et animi quos velit et fugiat.');
body.append('amount_spent', '42');
body.append('total_realisasi', '37');
body.append('realized_amount', '9');
body.append('field_location', 'n');
body.append('beneficiaries_count', '8');
body.append('volunteers_involved', '75');
body.append('report_type', 'final');
body.append('proof_image', document.querySelector('input[name="proof_image"]').files[0]);
body.append('activity_photos[]', document.querySelector('input[name="activity_photos[]"]').files[0]);

fetch(url, {
    method: "PUT",
    headers,
    body,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/campaigns/1/lpj/architecto';
$response = $client-&gt;put(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'multipart/form-data',
            'Accept' =&gt; 'application/json',
        ],
        'multipart' =&gt; [
            [
                'name' =&gt; 'title',
                'contents' =&gt; 'b'
            ],
            [
                'name' =&gt; 'description',
                'contents' =&gt; 'Et animi quos velit et fugiat.'
            ],
            [
                'name' =&gt; 'amount_spent',
                'contents' =&gt; '42'
            ],
            [
                'name' =&gt; 'total_realisasi',
                'contents' =&gt; '37'
            ],
            [
                'name' =&gt; 'realized_amount',
                'contents' =&gt; '9'
            ],
            [
                'name' =&gt; 'field_location',
                'contents' =&gt; 'n'
            ],
            [
                'name' =&gt; 'beneficiaries_count',
                'contents' =&gt; '8'
            ],
            [
                'name' =&gt; 'volunteers_involved',
                'contents' =&gt; '75'
            ],
            [
                'name' =&gt; 'report_type',
                'contents' =&gt; 'final'
            ],
            [
                'name' =&gt; 'proof_image',
                'contents' =&gt; fopen('C:\Users\ASUS\AppData\Local\Temp\php5169.tmp', 'r')
            ],
            [
                'name' =&gt; 'activity_photos[]',
                'contents' =&gt; fopen('C:\Users\ASUS\AppData\Local\Temp\php516A.tmp', 'r')
            ],
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-PUTapi-campaigns--campaign_id--lpj--id-">
</span>
<span id="execution-results-PUTapi-campaigns--campaign_id--lpj--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-PUTapi-campaigns--campaign_id--lpj--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-PUTapi-campaigns--campaign_id--lpj--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-PUTapi-campaigns--campaign_id--lpj--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-PUTapi-campaigns--campaign_id--lpj--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-PUTapi-campaigns--campaign_id--lpj--id-" data-method="PUT"
      data-path="api/campaigns/{campaign_id}/lpj/{id}"
      data-authed="0"
      data-hasfiles="1"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('PUTapi-campaigns--campaign_id--lpj--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-PUTapi-campaigns--campaign_id--lpj--id-"
                    onclick="tryItOut('PUTapi-campaigns--campaign_id--lpj--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-PUTapi-campaigns--campaign_id--lpj--id-"
                    onclick="cancelTryOut('PUTapi-campaigns--campaign_id--lpj--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-PUTapi-campaigns--campaign_id--lpj--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-darkblue">PUT</small>
            <b><code>api/campaigns/{campaign_id}/lpj/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               value="multipart/form-data"
               data-component="header">
    <br>
<p>Example: <code>multipart/form-data</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>campaign_id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="campaign_id"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the campaign. Example: <code>1</code></p>
            </div>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="id"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               value="architecto"
               data-component="url">
    <br>
<p>The ID of the lpj. Example: <code>architecto</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>title</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="title"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               value="b"
               data-component="body">
    <br>
<p>Must not be greater than 255 characters. Example: <code>b</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>description</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="description"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               value="Et animi quos velit et fugiat."
               data-component="body">
    <br>
<p>Must be at least 10 characters. Example: <code>Et animi quos velit et fugiat.</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>amount_spent</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="amount_spent"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               value="42"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>42</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>total_realisasi</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="total_realisasi"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               value="37"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>37</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>realized_amount</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="realized_amount"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               value="9"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>9</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>field_location</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="field_location"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               value="n"
               data-component="body">
    <br>
<p>Must not be greater than 255 characters. Example: <code>n</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>beneficiaries_count</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="beneficiaries_count"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               value="8"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>8</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>volunteers_involved</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="volunteers_involved"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               value="75"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>75</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>budget_items</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="budget_items"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               value=""
               data-component="body">
    <br>

        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>is_final</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="is_final"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               value=""
               data-component="body">
    <br>

        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>report_type</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="report_type"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               value="final"
               data-component="body">
    <br>
<p>Example: <code>final</code></p>
Must be one of:
<ul style="list-style-type: square;"><li><code>progress</code></li> <li><code>final</code></li></ul>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>proof_image</code></b>&nbsp;&nbsp;
<small>file</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="file" style="display: none"
                              name="proof_image"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               value=""
               data-component="body">
    <br>
<p>Must be a file. Must be an image. Must not be greater than 5120 kilobytes. Example: <code>C:\Users\ASUS\AppData\Local\Temp\php5169.tmp</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>activity_photos</code></b>&nbsp;&nbsp;
<small>file[]</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="file" style="display: none"
                              name="activity_photos[0]"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               data-component="body">
        <input type="file" style="display: none"
               name="activity_photos[1]"                data-endpoint="PUTapi-campaigns--campaign_id--lpj--id-"
               data-component="body">
    <br>
<p>Must be a file. Must be an image. Must not be greater than 5120 kilobytes.</p>
        </div>
        </form>

                    <h2 id="laporan-pertanggungjawaban-lpj-PATCHapi-campaigns--campaign_id--lpj--id-">Update LPJ (Inisiator)</h2>

<p>
</p>

<p>ATURAN PENGUNCIAN: Jika LPJ sudah berstatus 'verified' atau 'sah',
Inisiator DILARANG mengubah data (Read-Only / 403 Forbidden).</p>

<span id="example-requests-PATCHapi-campaigns--campaign_id--lpj--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request PATCH \
    "http://localhost:8000/api/campaigns/1/lpj/architecto" \
    --header "Content-Type: multipart/form-data" \
    --header "Accept: application/json" \
    --form "title=b"\
    --form "description=Et animi quos velit et fugiat."\
    --form "amount_spent=42"\
    --form "total_realisasi=37"\
    --form "realized_amount=9"\
    --form "field_location=n"\
    --form "beneficiaries_count=8"\
    --form "volunteers_involved=75"\
    --form "report_type=final"\
    --form "proof_image=@C:\Users\ASUS\AppData\Local\Temp\php516B.tmp" \
    --form "activity_photos[]=@C:\Users\ASUS\AppData\Local\Temp\php517C.tmp" </code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/campaigns/1/lpj/architecto"
);

const headers = {
    "Content-Type": "multipart/form-data",
    "Accept": "application/json",
};

const body = new FormData();
body.append('title', 'b');
body.append('description', 'Et animi quos velit et fugiat.');
body.append('amount_spent', '42');
body.append('total_realisasi', '37');
body.append('realized_amount', '9');
body.append('field_location', 'n');
body.append('beneficiaries_count', '8');
body.append('volunteers_involved', '75');
body.append('report_type', 'final');
body.append('proof_image', document.querySelector('input[name="proof_image"]').files[0]);
body.append('activity_photos[]', document.querySelector('input[name="activity_photos[]"]').files[0]);

fetch(url, {
    method: "PATCH",
    headers,
    body,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/campaigns/1/lpj/architecto';
$response = $client-&gt;patch(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'multipart/form-data',
            'Accept' =&gt; 'application/json',
        ],
        'multipart' =&gt; [
            [
                'name' =&gt; 'title',
                'contents' =&gt; 'b'
            ],
            [
                'name' =&gt; 'description',
                'contents' =&gt; 'Et animi quos velit et fugiat.'
            ],
            [
                'name' =&gt; 'amount_spent',
                'contents' =&gt; '42'
            ],
            [
                'name' =&gt; 'total_realisasi',
                'contents' =&gt; '37'
            ],
            [
                'name' =&gt; 'realized_amount',
                'contents' =&gt; '9'
            ],
            [
                'name' =&gt; 'field_location',
                'contents' =&gt; 'n'
            ],
            [
                'name' =&gt; 'beneficiaries_count',
                'contents' =&gt; '8'
            ],
            [
                'name' =&gt; 'volunteers_involved',
                'contents' =&gt; '75'
            ],
            [
                'name' =&gt; 'report_type',
                'contents' =&gt; 'final'
            ],
            [
                'name' =&gt; 'proof_image',
                'contents' =&gt; fopen('C:\Users\ASUS\AppData\Local\Temp\php516B.tmp', 'r')
            ],
            [
                'name' =&gt; 'activity_photos[]',
                'contents' =&gt; fopen('C:\Users\ASUS\AppData\Local\Temp\php517C.tmp', 'r')
            ],
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-PATCHapi-campaigns--campaign_id--lpj--id-">
</span>
<span id="execution-results-PATCHapi-campaigns--campaign_id--lpj--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-PATCHapi-campaigns--campaign_id--lpj--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-PATCHapi-campaigns--campaign_id--lpj--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-PATCHapi-campaigns--campaign_id--lpj--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-PATCHapi-campaigns--campaign_id--lpj--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-PATCHapi-campaigns--campaign_id--lpj--id-" data-method="PATCH"
      data-path="api/campaigns/{campaign_id}/lpj/{id}"
      data-authed="0"
      data-hasfiles="1"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('PATCHapi-campaigns--campaign_id--lpj--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-PATCHapi-campaigns--campaign_id--lpj--id-"
                    onclick="tryItOut('PATCHapi-campaigns--campaign_id--lpj--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-PATCHapi-campaigns--campaign_id--lpj--id-"
                    onclick="cancelTryOut('PATCHapi-campaigns--campaign_id--lpj--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-PATCHapi-campaigns--campaign_id--lpj--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-purple">PATCH</small>
            <b><code>api/campaigns/{campaign_id}/lpj/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               value="multipart/form-data"
               data-component="header">
    <br>
<p>Example: <code>multipart/form-data</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>campaign_id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="campaign_id"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the campaign. Example: <code>1</code></p>
            </div>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="id"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               value="architecto"
               data-component="url">
    <br>
<p>The ID of the lpj. Example: <code>architecto</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>title</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="title"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               value="b"
               data-component="body">
    <br>
<p>Must not be greater than 255 characters. Example: <code>b</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>description</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="description"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               value="Et animi quos velit et fugiat."
               data-component="body">
    <br>
<p>Must be at least 10 characters. Example: <code>Et animi quos velit et fugiat.</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>amount_spent</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="amount_spent"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               value="42"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>42</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>total_realisasi</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="total_realisasi"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               value="37"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>37</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>realized_amount</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="realized_amount"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               value="9"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>9</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>field_location</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="field_location"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               value="n"
               data-component="body">
    <br>
<p>Must not be greater than 255 characters. Example: <code>n</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>beneficiaries_count</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="beneficiaries_count"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               value="8"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>8</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>volunteers_involved</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="volunteers_involved"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               value="75"
               data-component="body">
    <br>
<p>Must be at least 0. Example: <code>75</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>budget_items</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="budget_items"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               value=""
               data-component="body">
    <br>

        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>is_final</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="is_final"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               value=""
               data-component="body">
    <br>

        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>report_type</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="report_type"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               value="final"
               data-component="body">
    <br>
<p>Example: <code>final</code></p>
Must be one of:
<ul style="list-style-type: square;"><li><code>progress</code></li> <li><code>final</code></li></ul>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>proof_image</code></b>&nbsp;&nbsp;
<small>file</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="file" style="display: none"
                              name="proof_image"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               value=""
               data-component="body">
    <br>
<p>Must be a file. Must be an image. Must not be greater than 5120 kilobytes. Example: <code>C:\Users\ASUS\AppData\Local\Temp\php516B.tmp</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>activity_photos</code></b>&nbsp;&nbsp;
<small>file[]</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="file" style="display: none"
                              name="activity_photos[0]"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               data-component="body">
        <input type="file" style="display: none"
               name="activity_photos[1]"                data-endpoint="PATCHapi-campaigns--campaign_id--lpj--id-"
               data-component="body">
    <br>
<p>Must be a file. Must be an image. Must not be greater than 5120 kilobytes.</p>
        </div>
        </form>

                    <h2 id="laporan-pertanggungjawaban-lpj-DELETEapi-campaigns--campaign_id--lpj--id-">Hapus LPJ (Inisiator)</h2>

<p>
</p>

<p>ATURAN PENGUNCIAN: Jika LPJ sudah berstatus 'verified' atau 'sah',
Inisiator DILARANG menghapus data (403 Forbidden).</p>

<span id="example-requests-DELETEapi-campaigns--campaign_id--lpj--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request DELETE \
    "http://localhost:8000/api/campaigns/1/lpj/architecto" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost:8000/api/campaigns/1/lpj/architecto"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "DELETE",
    headers,
}).then(response =&gt; response.json());</code></pre></div>


<div class="php-example">
    <pre><code class="language-php">$client = new \GuzzleHttp\Client();
$url = 'http://localhost:8000/api/campaigns/1/lpj/architecto';
$response = $client-&gt;delete(
    $url,
    [
        'headers' =&gt; [
            'Content-Type' =&gt; 'application/json',
            'Accept' =&gt; 'application/json',
        ],
    ]
);
$body = $response-&gt;getBody();
print_r(json_decode((string) $body));</code></pre></div>

</span>

<span id="example-responses-DELETEapi-campaigns--campaign_id--lpj--id-">
</span>
<span id="execution-results-DELETEapi-campaigns--campaign_id--lpj--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-DELETEapi-campaigns--campaign_id--lpj--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-DELETEapi-campaigns--campaign_id--lpj--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-DELETEapi-campaigns--campaign_id--lpj--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-DELETEapi-campaigns--campaign_id--lpj--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-DELETEapi-campaigns--campaign_id--lpj--id-" data-method="DELETE"
      data-path="api/campaigns/{campaign_id}/lpj/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('DELETEapi-campaigns--campaign_id--lpj--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-DELETEapi-campaigns--campaign_id--lpj--id-"
                    onclick="tryItOut('DELETEapi-campaigns--campaign_id--lpj--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-DELETEapi-campaigns--campaign_id--lpj--id-"
                    onclick="cancelTryOut('DELETEapi-campaigns--campaign_id--lpj--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-DELETEapi-campaigns--campaign_id--lpj--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-red">DELETE</small>
            <b><code>api/campaigns/{campaign_id}/lpj/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="DELETEapi-campaigns--campaign_id--lpj--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="DELETEapi-campaigns--campaign_id--lpj--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>campaign_id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="campaign_id"                data-endpoint="DELETEapi-campaigns--campaign_id--lpj--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the campaign. Example: <code>1</code></p>
            </div>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="id"                data-endpoint="DELETEapi-campaigns--campaign_id--lpj--id-"
               value="architecto"
               data-component="url">
    <br>
<p>The ID of the lpj. Example: <code>architecto</code></p>
            </div>
                    </form>

            

        
    </div>
    <div class="dark-box">
                    <div class="lang-selector">
                                                        <button type="button" class="lang-button" data-language-name="bash">bash</button>
                                                        <button type="button" class="lang-button" data-language-name="javascript">javascript</button>
                                                        <button type="button" class="lang-button" data-language-name="php">php</button>
                            </div>
            </div>
</div>
</body>
</html>
