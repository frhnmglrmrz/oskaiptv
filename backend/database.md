# Database Architecture: TakeOff IPTV

* **Web Admin** bertugas memasukkan dan mengedit data di database ini (contoh: tambah menu makanan).
* **Android TV** membaca data dari database ini (contoh: melihat daftar menu) dan menambah data (contoh: membuat pesanan baru dari tamu).
* **Backend (API Server)** adalah jembatan logika kelistrikannya (*gatekeeper*) yang akan memproses permintaan dari TV maupun Admin Web untuk disimpan/dibaca ke database PostgreSQL kita.

---

## Skema Tabel Relasional (PostgreSQL)

Berdasarkan bedah foto-foto fitur Panel Admin Anda sebelumnya, berikut adalah rancangan tepercaya (*schema*) untuk arsitektur database kita. Ini sudah dioptimalkan untuk bahasa pemrograman Python/Golang:

### 1. Manajemen Perangkat & Tamu (Core)

**Tabel `devices` (Perangkat TV)**
Menyimpan data fisik TV Android yang ada di hotel.

* `id` (UUID, Primary Key)
* `device_id` (String, Unique) -> Contoh: `TV-101-A` atau `MAC Address`
* `device_name` (String) -> Contoh: `Smart TV Lobby`
* `room_number` (String, Foreign Key ke `rooms`) -> Contoh: `101`
* `registered_at` (Timestamp)

**Tabel `rooms` (Manajemen Check-In)**
Menyimpan kamar dan statusnya (ada tamu atau kosong).

* `room_number` (String, Primary Key) -> Contoh: `101`, `C2`
* `guest_name` (String, Nullable) -> Contoh: `Bapak Rizal` (Kosong jika *check-out*)
* `check_in_time` (Timestamp, Nullable)

### 2. Modul Konten & Launcher TV

**Tabel `system_settings` (Pengaturan Global & Visual)**
Penyimpanan fleksibel (*Key-Value Pair*) untuk banner, teks, dsb.

* `key` (String, Primary Key) -> Contoh: `marquee_text`, `flashscreen_video_url`, `background_image_url`
* `value` (Text) -> Contoh: `Please Welcome TakeOff`

**Tabel `entertainment_apps` (Aplikasi Hiburan/Menu Utama)**
Daftar kotak-kotak menu yang muncul di *home screen* TV.

* `id` (UUID, Primary Key)
* `app_name` (String) -> Contoh: `Netflix`, `YouTube`, atau `Dining Room`
* `package_name` (String, Nullable) -> Contoh: `com.netflix.ninja` (Kosong jika ini adalah modul layar internal aplikasi kita seperti "Information")
* `icon_url` (String)
* `sort_order` (Integer) -> Urutan tampil (contoh: 99, 1)
* `is_active` (Boolean) -> Toggle ON/OFF tampil di TV

### 3. Modul Hotel Services

**Tabel `facilities` (Fasilitas Hotel)**

* `id` (UUID, Primary Key)
* `name` (String) -> Contoh: `Kolam Renang`
* `description` (Text)
* `image_url` (String)

**Tabel `informations` (Hotel Information)**

* `id` (UUID, Primary Key)
* `title` (String) -> Contoh: `Selamat Datang`
* `description` (Text)
* `image_url` (String)

**Tabel `amenities` (Katalog Barang Permintaan)**

* `id` (UUID, Primary Key)
* `name` (String) -> Contoh: `Handuk Tambahan`, `Air Mineral`
* `description` (Text)
* `image_url` (String)

### 4. Modul F&B (Restoran / Dining Room)

**Tabel `dining_menus` (Katalog Makanan)**

* `id` (UUID, Primary Key)
* `name` (String) -> Contoh: `Mie Aceh`, `Nasi Goreng Terasi`
* `price` (Decimal/Numeric) -> Contoh: `100000`
* `image_url` (String)
* `status` (String) -> `Active` / `Inactive`

### 5. Modul Transaksi (Pesanan Tamu dari TV)

**Tabel `dining_orders` (Pesanan Makanan / In-Room Dining)**

* `id` (UUID, Primary Key)
* `room_number` (String, Relasi ke `rooms`)
* `guest_name` (String)
* `total_items` (Integer)
* `total_price` (Decimal)
* `status` (String) -> `PENDING`, `PROCESS`, `DONE`
* `ordered_at` (Timestamp)

**Tabel `dining_order_items` (Keranjang Belanja Spesifik per Order)**

* `id` (UUID, Primary Key)
* `order_id` (UUID, Relasi ke `dining_orders`)
* `menu_name` (String) -> Menyimpan teks mati (snapshot) nama menu
* `quantity` (Integer) -> Contoh: `2` porsi
* `price_per_item` (Decimal) -> Contoh: `85000`

**Tabel `amenity_requests` (Permintaan Barang / Housekeeping)**
Sistemnya mirip pesanan makanan, tapi umumnya tanpa data harga.

* `id` (UUID, Primary Key)
* `room_number` (String, Relasi ke `rooms`)
* `guest_name` (String)
* `status` (String) -> `PENDING`, `PROCESS`, `DONE`
* `requested_at` (Timestamp)

**Tabel `amenity_request_items` (Detail Barang Diminta)**

* `id` (UUID, Primary Key)
* `request_id` (UUID, Relasi ke `amenity_requests`)
* `amenity_name` (String) -> Contoh: `Handuk Tambahan`
* `quantity` (Integer) -> Contoh: `2`

### 6. Sistem Web Admin & Update OTA

**Tabel `system_updates` (Manajemen `.apk`)**
Menampung file instalasi aplikasi Android TV untuk dikirim paksa dari web.

* `id` (UUID, Primary Key)
* `version_name` (String) -> Contoh: `v251110-070051`
* `apk_url` (String)
* `uploaded_at` (Timestamp)

**Tabel `admins` (Login Panel TakeOff IPTV)**

* `id` (UUID, Primary Key)
* `username` (String, Unique) -> Contoh: `rizal`
* `password_hash` (String)
* `last_login_at` (Timestamp, Nullable)
