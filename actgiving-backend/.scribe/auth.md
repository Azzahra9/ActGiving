# Authenticating requests

To authenticate requests, include an **`Authorization`** header with the value **`"Bearer {YOUR_BEARER_TOKEN}"`**.

All authenticated endpoints are marked with a `requires authentication` badge in the documentation below.

Dapatkan token dengan memanggil endpoint <code>POST /api/auth/login</code>. Salin nilai dari field <code>data.token</code> di respons, lalu klik tombol <b>Authorize</b> di atas dan masukkan nilainya.
