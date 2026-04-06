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

### 2. Eksekusi Docker Compose
Semua konfigurasi (termasuk *database* dan akses *login*) sudah diotomatisasi. Anda tidak perlu lagi membuat file `.env` secara manual! Cukup jalankan perintah ini untuk menginstal dan menyalakan server secara langsung:

```bash
docker-compose up --build -d
```
*Tunggu beberapa menit hingga proses build OS dan instalasi dependensi selesai (membutuhkan koneksi internet).*

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
Aplikasi Docker ini secara default berjalan di `http://localhost:1960`. 
Untuk mengarahkan domain asli (contoh: `pmii.org`) agar langsung terbuka, Anda perlu memasang **Nginx Proxy Manager**, **Cloudflare Tunnels**, atau **Nginx Reverse Proxy** yang meneruskan Port `80/443` ke Port `1960` milik Docker.

---

## 📡 Akses Jaringan Lokal & Custom Hostname (Windows)
Jika Anda men-deploy sistem ini di komputer **Windows** milik Anda dan ingin bisa mengaksesnya menggunakan `http://pmii:1960` (serta bisa dibuka oleh HP/Laptop lain di WiFi yang sama), berikut adalah caranya:

### 1. Akses untuk Komputer Windows Anda Sendiri (Edit Hosts)
Agar kata `pmii` dapat dialihkan ke aplikasi:
1. Buka **Notepad**, klik kanan dan pilih **Run as Administrator**.
2. Masuk ke menu `File > Open`, arahkan folder ke `C:\Windows\System32\drivers\etc`.
3. Ubah Tipe File di pojok kanan bawah menjadi **All Files (\*.\*)**, lalu buka file bernama `hosts`.
4. Tambahkan baris ini di bagian paling bawah dokumen:
   ```text
   127.0.0.1       pmii
   127.0.0.1       pm11
   ```
5. Simpan (Ctrl+S). Anda kini bisa menggunakan tautan `http://pmii:1960` di komputer Anda.

### 2. Berbagi Akses ke Komputer / HP Lain di WiFi yang Sama
Mengubah file *hosts* hanya efektif untuk komputer itu sendiri. Agar *device* lain di satu jaringan WiFi dapat mengakses *dashboard* PMII Anda:

**Opsi A: Menggunakan IP (Paling Mudah)**
Buka via alamat IP dari komputer pusat Windows Anda. 
*   Cari IP komputer Windows Anda (Ketik `ipconfig` di CMD, cari *IPv4 Address*, misal: `192.168.1.15`).
*   Buka di HP/Device lain: `http://192.168.1.15:1960`
*(Pastikan pengaturan Windows Defender Firewall Anda mengizinkan lalu-lintas jaringan masuk untuk koneksi lokal Public/Private).*

**Opsi B: Menggunakan Fitur mDNS (Bisa Pakai Nama)**
Daripada menggunakan IP, Anda bisa mengganti nama Komputer pusat Windows Anda.
1. Di komputer Windows pusat, masuk ke **Settings > System > About**.
2. Klik **Rename this PC** dan ganti menjadi `PMII`. *Restart PC.*
3. Sekarang, dari HP/Mac/Laptop apa pun di WiFi yang sama, Anda bisa langsung mengaksesnya lewat tautan ini tanpa setelan tambahan:
👉 **`http://pmii.local:1960`**
