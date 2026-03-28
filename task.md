# Oska IPTV - Detailed Project Tasks

## Phase 1: Backend & Database (API Server)

*Tech Target: Python (FastAPI) + PostgreSQL*

- [x] **1.1 Inisiasi Proyek:** Membuat folder `backend`, setup virtual environment, instalasi *framework* FastAPI dan *driver* database.
- [x] **1.2 Migrasi Database:** Membuat dan menjalankan skrip SQL berdasarkan *schema* di `database.md`.
  - [x] Tabel `rooms`, `devices`, `admins`.
  - [x] Tabel `system_settings`, `entertainment_apps`.
  - [x] Tabel `facilities`, `informations`, `amenities`.
  - [x] Tabel `dining_menus`, `dining_orders`, `dining_order_items`.
- [ ] **1.3 Pembuatan API Web Admin (CRUD):**
  - [ ] API Login & Autentikasi Admin (JWT).
  - [ ] API Tambah/Edit/Hapus `dining_menus`.
  - [ ] API Tambah/Edit/Hapus `amenities`.
  - [ ] API Tambah/Edit/Hapus `entertainment_apps`.
  - [ ] API WebSockets/SSE untuk pesanan masuk secara *real-time*.
- [ ] **1.4 Pembuatan API Android TV (Client-Facing):**
  - [ ] `GET /api/tv/home` (Kompilasi setelan *marquee*, daftar app, `check-in` data).
  - [ ] `GET /api/tv/dining` (Mengambil menu makanan).
  - [ ] `POST /api/tv/order-dining` (Menerima pesanan & kuantitas keranjang).
  - [ ] `POST /api/tv/request-amenity` (Menerima permintaan handuk dll).

## Phase 2: Web Admin Panel (Sistem Manajemen Hotel)

*Tech Target: Next.js/React + TypeScript + Tailwind CSS*

- [ ] **2.1 Inisiasi Proyek UI:** Setup *boilerplate* Next.js, konfigurasi *Tailwind*, pembuatan *Layout Dashboard Sidebar*.
- [ ] **2.2 Autentikasi:** Pembuatan halaman Login khusus staf hotel.
- [ ] **2.3 Data Management Pages (Pengaturan Master):**
  - [ ] Halaman **Manajemen Perangkat:** Input `Device ID` TV baru dan nomor kamarnya.
  - [ ] Halaman **Manajemen Check-in:** Set nama tamu ke nomor kamar.
  - [ ] Halaman **Entertainment Apps:** *Toggle* hidup/mati menu *launcher* TV.
  - [ ] Halaman **System Settings:** Input teks *Marquee* dan upload video *Flashscreen*.
- [ ] **2.4 Content Upload Pages:**
  - [ ] Halaman **Dining Menu:** Form upload foto makanan, nama, dan harga.
  - [ ] Halaman **Amenities Item:** Form penambahan aset barang untuk *housekeeping*.
- [ ] **2.5 Live Monitoring Dashboard:**
  - [ ] Tabel *auto-refreshing* untuk **Pesanan Dining** (menyala/berbunyi <i>ting</i> saat pesanan dari TV masuk).
  - [ ] Tabel *auto-refreshing* untuk **Permintaan Amenities**.

## Phase 3: Android TV App (Klien)

*Tech Target: Kotlin + Jetpack Compose for TV*

- [ ] **3.1 Inisiasi Kiosk TV:** Setup proyek Android Studio, konfigurasi HTTP Client (Retrofit), dan fungsi pengunci *Default Home Launcher* (TV booting langsung masuk aplikasi).
- [ ] **3.2 Identitas TV:** Fungsi ekstraktor konfigurasi `Device ID` unik.
- [ ] **3.3 Splash Screen & Sambutan:** Merender *boot animation* dari API dan menampilkan `guest_name` dari *Check-in status*.
- [ ] **3.4 Menu Utama (D-Pad UI):**
  - [ ] Merender kotak kartu aplikasi berbaris rapi secara dinamis dari API `entertainment_apps`.
  - [ ] Animasi fokus (membesar/bercahaya) saat dipilih remote TV.
  - [ ] Fitur *intent* Android untuk membuka aplikasi pihak ke-3 otomatis via `Package Name` (mis: Netflix).
- [ ] **3.5 Halaman Pesanan (Dining):**
  - [ ] Merender katalog makanan dari API.
  - [ ] Membuat fitur *State Management* "Keranjang/Cart".
  - [ ] Tombol **Selesaikan Pesanan** yang memanggil POST API backend.
- [ ] **3.6 Halaman Amenities & Informasi:**
  - [ ] Merender halaman permintaan barang.
  - [ ] Halaman statis bergambar untuk profil & peraturan hotel (*Facilities*).

## Phase 4: Finalisasi

- [ ] **4.1 Over The Air (OTA):** Sistem serbaneka rahasia TV untuk mengunduh `.apk` versi baru secara otomatis dari peladen (*server*).
- [ ] **4.2 End-to-End Testing (E2E):** Simulasi pesanan Nasi Goreng dari TV dan memastikan langsung muncul di Web Panel.
