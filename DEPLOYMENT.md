# Panduan Deployment via Docker (Rekomendasi Utama)

Aplikasi PMII Balikpapan ini telah dikonfigurasi untuk berjalan secara optimal dan aman menggunakan **Docker**. Metode ini sangat disarankan untuk VPS/Server (Ubuntu, AlmaLinux, MacOS, Windows) karena bersifat *plug-and-play* dan tidak akan kehilangan data (unggah gambar & database) saat di-restart.

## ✅ Prasyarat Sistem
Pastikan server/komputer Anda sudah terinstal:
1.  **Git** (Untuk mengambil source code)
2.  **Docker** & **Docker Compose**

---

## 🚀 Langkah-langkah Deployment Lengkap

Ikuti baris perintah (*command line / cmd*) di bawah ini secara berurutan di terminal server Anda:

### 1. Kloning Repository
Ambil kode terbaru dari GitHub ke dalam server Anda:
```bash
git clone https://github.com/iroysaid/pmii-balikpapan-core.git
cd pmii-balikpapan-core
```

### 2. Siapkan File Konfigurasi (.env)
Salin `.env.example` (atau buat file `.env` baru) untuk mengatur konfigurasi alamat web Anda:
```bash
cp .env .env.production
# Buka file .env dan ubah jika perlu
nano .env
```
**PENTING di dalam `.env`:**
*   Pastikan `DATABASE_URL="file:./dev.db"`
*   Ubah `NEXTAUTH_URL` sesuai nama domain Anda, contoh: `NEXTAUTH_URL=https://pmii-balikpapan.com`
*   Ubah `NEXTAUTH_SECRET` menjadi teks acak rahasia untuk keamanan *login*.

### 3. Eksekusi Docker Compose
Jalankan perintah ini untuk mulai mengunduh OS (*Debian*), menginstal dependencies, mem-*build* Next.js, dan menyalakan server secara otomatis di latar belakang (*background*):

```bash
docker-compose up --build -d
```
*Tunggu beberapa menit hingga proses build selesai. Ini hanya memakan waktu agak lama pada percobaan pertama.*

### 4. Cek Status Aplikasi
Untuk memastikan aplikasi berjalan dengan baik:
```bash
# Melihat daftar docker yang hidup (Status harusnya: Up)
docker ps

# Melihat log aplikasi jika terjadi error
docker-compose logs -f
```

---

## 💼 Manajemen Lanjutan (CMD Penting)

Jika Anda ingin melakukan update atau menghentikan website, gunakan perintah berikut di dalam folder proyek (`pmii-balikpapan-core`):

**1. Mengambil Update Fitur Baru (Pull & Rebuild):**
Jika ada fitur baru yang di-*push* ke GitHub, Anda bisa memperbaruinya di server dengan cara:
```bash
git pull origin main
docker-compose up --build -d
```
*Catatan: Semua data akun, berita, kegiatan, dan foto galeri **TIDAK AKAN HILANG** karena kita telah menguncinya menggunakan sistem Volume yang aman pada `./uploads` dan `dev.db`.*

**2. Mematikan Website (Tanpa Menghapus Data):**
```bash
docker-compose stop
```

**3. Menyalakan Kembali Website:**
```bash
docker-compose start
```

**4. Mereset / Menghapus Container (Data tetap aman):**
```bash
docker-compose down
```

---

## 🛡️ Hak Akses (Troubleshooting)
Sistem ini menggunakan *Node Debian-Slim*. Jika terdapat pesan *error* "Permission Denied" pada saat Anda meng-upload galeri melalui website yang sudah live, jalankan perintah ini di OS Ubuntu/Server Anda untuk memberi izin pada folder unggahan:

```bash
sudo chmod -R 777 public/uploads
sudo chmod 777 dev.db
```

## 🌐 Koneksi ke Domain Publik (Opsional)
Aplikasi Docker ini secara default berjalan di `http://localhost:3005`. 
Untuk mengarahkan domain asli (contoh: `pmii.org`) agar langsung terbuka, Anda perlu memasang **Nginx Proxy Manager**, **Cloudflare Tunnels**, atau **Nginx Reverse Proxy** yang meneruskan Port `80/443` ke Port `3005` milik Docker.
