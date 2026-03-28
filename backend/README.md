# Panduan Menjalankan TakeOff IPTV Backend (FastAPI)

Dokumen ini berisi langkah-langkah untuk menyiapkan dan menjalankan mesin API server (backend) untuk proyek TakeOff IPTV.

---

## 1. Persiapan Awal (Hanya Dilakukan 1 Kali)

Pastikan terminal Anda sudah berada di dalam folder `backend`:

```bash
cd backend
```

Buat *Virtual Environment* (venv) untuk mengisolasi *library* Python agar tidak mengganggu sistem utama komputer Anda:

```bash
python3 -m venv venv
```

## 2. Aktifkan Virtual Environment (Dilakukan Setiap Buka Terminal Baru)

Pilih perintah aktivasi sesuai dengan jenis terminal (*shell*) yang Anda gunakan:

### Pengguna Fish Shell (Sesuai Terminal VS Code Anda Saat Ini)

```fish
source venv/bin/activate.fish
```

### Pengguna Linux/Mac (Bash/Zsh)

```bash
source venv/bin/activate
```

### Pengguna Windows (CMD / PowerShell)

```cmd
venv\Scripts\activate
```

*Cek Keberhasilan: Anda akan melihat tulisan `(venv)` muncul di sebelah kiri baris *prompt* terminal Anda.*

## 3. Instalasi Persyaratan (Dependencies)

Jika `venv` sudah aktif, instal semua *pustaka (library)* yang kita butuhkan:

```bash
pip install -r requirements.txt
```

## 4. Nyalakan Server API 🚀

Jalankan perintah ini untuk menghidupkan *server* lokal Anda:

```bash
uvicorn app.main:app --reload
```

*(Catatan: Flag `--reload` membuat server me-restart dirinya sendiri secara otomatis setiap kali Anda memperbarui baris kode, sehingga Anda tidak perlu mematikan-menyalakan server terus-menerus).*

---

## Cek Keberhasilan & URL Penting

Jika 4 langkah di atas berhasil, aplikasi berjalan di port 8000. Buka tautan berikut di browser Anda:

- **Beranda API:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/) *(Menampilkan pesan JSON penyambutan)*
- **Dokumentasi API Interaktif (Swagger UI):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) *(Ini akan otomatis merekap seluruh daftar URL API kita nantinya!)*
