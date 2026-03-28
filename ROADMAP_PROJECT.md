# Rincian Tugas Harian (Roadmap Checklist)

# Proyek: TakeOff IPTV Full-Stack

Gunakan dokumen ini untuk melacak kemajuan Anda hari demi hari. Tandai kotak `[x]` setiap kali Anda menyelesaikan satu fungsi!

==================================================

### 🟢 FASE 1: BACKEND (Database & API)

Tujuan: Membangun pondasi yang bisa menerima dan menyimpan data.
*Framework Rekomendasi: Python (FastAPI)*

**Modul 1: Persiapan**
[x] Buka terminal, inisialisasi virtual environment Python (`python -m venv venv`).
[x] Install FastAPI & dependensi (`pip install fastapi uvicorn sqlalchemy asyncpg`).
[x] Hubungkan Python dengan database PostgreSQL (`database.md`).
[x] Buat semua tabel (Auto Migration) ke dalam database.

**Modul 2: API Web Admin (Tugas-Tugas Wajib Production)**
[ ] **Otentikasi:** Buat Endpoint Login Admin (`POST /admin/login`) berbalut JWT.
[ ] **Device & Kamar:** API Pendaftaran TV (`/admin/devices`) dan fitur Check-in/Check-out Tamu (`/admin/rooms`).
[ ] **Konten (CRUD):** Buat 5 jalur API utuh (Baca, Tambah, Ubah, Hapus) untuk Master Data:
    - Menu Makanan (Dining)
    - Amenities (Handuk, Sandal, dll)
    - Fasilitas & Informasi Hotel
    - Entertainment Apps (Shortcut Aplikasi TV)
    - System Settings (Teks Berjalan / Banner Utama)
[ ] **Live Monitoring:** API pembacaan pesanan makanan dan permintaan barang tamu, lengkap dengan pengubah status (contoh: PENDING -> DELIVERED).
[ ] **OTA:** API Upload file `.apk` terbaru untuk dikirim paksa ke seluruh TV.

**Modul 3: API Publik (Klien Android TV)**
[ ] **Registrasi:** `POST /tv/register` (Mencatat ID Hardware TV ke dalam *database* saat pertama dinyalakan).
[ ] **Home & Konten:** `GET /tv/home` (Menarik teks sapaan nama tamu, *background*, dan daftar tombol *launcher* secara dinamis).
[ ] **Transaksi:** `POST /tv/dining/order` (Kirim pesanan makanan) & `POST /tv/amenity/request` (Minta barang).
[ ] **OTA Check:** `GET /tv/update` (TV rutin bertanya ke *server* apakah ada *update* sistem aplikasi TV terbaru).

---

### 🔵 FASE 2: FRONTEND WEB (Panel Staf Hotel)

Tujuan: Membangun UI Admin persis seperti foto referensi yang Anda berikan.
*Framework Rekomendasi: Next.js + Tailwind CSS*

**Modul 1: Layout & Navigasi**
[ ] Inisialisasi proyek Next.js (`npx create-next-app admin-web`).
[ ] Buat *Sidebar* sebelah kiri berisi menu "Dashboard, Facilities, Dining, ...".
[ ] Buat halaman Login Admin.

**Modul 2: Data Entry (Halaman Input)**
[ ] Halaman **Facilities** (Unggah gambar, ketik deskripsi properti hotel).
[ ] Halaman **Manajemen Perangkat** (Memasukkan ID Android TV dan Nomor Kamar).
[ ] Halaman **Manajemen Check-in** (Tulis nama Bapak/Ibu ke kamar tertentu).

**Modul 3: Halaman "Command Center"**
[ ] Buat *Table/Grid* khusus untuk memantau "Pesanan Dining" tamu.
[ ] Buat *Table/Grid* khusus memantau "Permintaan Handuk/Amenities".
💡 *Catatan Paling Penting:* Laman ini harus bisa *refresh* otomatis 5 detik sekali, sehingga saat dapur berjalan, mereka langsung tahu pesanan baru tanpa menekan 'Reload'.

---

### 🟠 FASE 3: ANDROID TV (Kiosk App OS)

Tujuan: Membangun aplikasi peluncur pengganti menu bawaan pabrik TV Android.
*Language Rekomendasi: Kotlin (Jetpack Compose)*

**Modul 1: Setup TV Inti**
[ ] Jalankan Android Studio, buat *Project for TV*.
[ ] Atur *Manifest* agar Aplikasi kita berjalan selamanya saat TV menyala (*Launcher Mode*).
[ ] Ekstraksi ID Hardware TV melalui kode `Settings.Secure.ANDROID_ID`.

**Modul 2: Tampilan Sambutan & Menu Beranda Utama**
[ ] Layar putar otomatis sebuah video perkenalan selamat datang hotel.
[ ] Tampilkan *Background Image* dinamis 4K resolusi di *Home Screen*.
[ ] Munculkan nama tamu (Bapak Rizal) hasil tembakan API `tv/sync`.
[ ] Munculkan urutan rapi kartu-kartu *Entertainment Apps* yang dapat dinavigasi mulus dengan *D-Pad* remot kontrol (Kiri ⬅️ Kanan ➡️).

**Modul 3: Aksi Interaktif**
[ ] Bangun sistem *Intent Action* (bila pengguna klik "Netflix", TV langsung pindah seketika keluar jalankan Netflix).
[ ] Halaman **Beli Makanan**: Pengguna bisa memilih Porsi (+/-), lalu tekan konfirmasi `Setuju Pesan`, kirim ke peladen.
[ ] Halaman informasi kolam renang / Spa untuk edukasi tamu hotel.

==================================================

### ✅ TAHAP AKHIR

[ ] Instalasi APK final ke Set-Top Box percobaan.
[ ] Pesan secangkir Kopi "Tubruk" lewat Remote TV, lalu cek monitor admin web... BUM! Terdengar notifikasi pesanan berhasil!
[ ] Anda bersiap menjadi talenta incaran *Software House* di Jepang!
