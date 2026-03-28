# Beranda Panduan OSKA IPTV 🚀

Selamat datang di Proyek OSKA IPTV (Sistem Manajemen Hotel & Kiosk TV).
Proyek ini terdiri dari 3 blok arsitektur utama:
1. **Backend**: Python (FastAPI) & PostgreSQL
2. **Frontend (Admin Panel)**: Next.js + Tailwind CSS (Tema Neo-Brutalism)
3. **Android TV (Kiosk Client)**: Kotlin Jetpack Compose TV

---

## 🛠️ Persyaratan Lingkungan (Prerequisites)
Sebelum menjalankan, pastikan mesin / laptop Anda telah terinstal:
- **Node.js**: v18+ (Disarankan LTS)
- **Python**: v3.10+
- **PostgreSQL**: Pastikan daemon lokal database berjalan.
- **Android Studio / Waydroid** (Hanya jika Anda ingin mengubah kode Klien Kotlin)

---

## 🕹️ Langkah 1: Menjalankan Backend (FastAPI)

Data kunci sistem tersimpan di sini. Pastikan PostgreSQL Anda hidup.
1. Buka Terminal baru dan masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Buat lingkungan virtual Python (Opsional namun sangat disarankan):
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Instal dependencies sistem dari file `requirements.txt`:
   ```bash
   pip install -r requirements.txt
   ```
4. Pastikan file URL Database telah terhubung (cek config `.env` / `database.py` Anda). Secara bawaan, kita menggunakan `postgresql://postgres:postgres@localhost/oskapanel`.
5. Jalankan server FastAPI dengan uvicorn:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   *Dashboard API Interaktif akan terbuka di: [http://localhost:8000/docs](http://localhost:8000/docs).*

---

## 🕹️ Langkah 2: Menjalankan Web Admin (Frontend)

Platform manajemen kamar, pesanan dapur, dan konfigurasi TV.
1. Buka Terminal baru dan masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Instal pustaka paket berbasis NPM:
   ```bash
   npm install
   ```
3. Jalankan server Live Development Next.js:
   ```bash
   npm run dev
   ```
   *Web Admin akan tersedia di: [http://localhost:3000](http://localhost:3000).* 
   *Catatan: Pastikan Anda membuka tab Browser Anda dan mendaftar sebuah akun Staf dulu di `/register` sebelum masuk ke Dashboard.*

---

## 🕹️ Langkah 3: Menjalankan Klien Android TV (Cara Opsional)

Untuk mensimulasikan layar TV yang ada di hotel.
1. Buka folder root proyek ini di **Android Studio**.
2. Biarkan Gradle melakukan sinkronisasi otomatis.
3. Sambungkan Waydroid (via ADB) atau jalankan Emulator Android TV bawaan AVD.
4. Klik Logo **"Run"** berlogo ▶️ hijau di panel atas Android Studio.
5. TV App akan terbuka dan mencoba menghubungi IP lokal server Anda untuk mendaftarkan *Device ID*-nya.

---

> Jika mengalami isu koneksi jaringan dari TV ke backend di Windows/Mac, pastikan _IP internal LAN_ laptop Anda dimasukkan ke dalam konfigurasi Retrofit Client di Kotlin, bukan `localhost`. Bagi pengguna Linux (Waydroid), pengaturan awal biasanya langsung berhasil karena interkomunikasi host terbuka.
