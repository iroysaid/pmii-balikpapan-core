# Sistem Manajemen & Kaderisasi PC PMII Balikpapan 🌟

Selamat datang di repositori resmi **Website & Sistem Manajemen Internal Pengurus Cabang Pergerakan Mahasiswa Islam Indonesia (PMII) Kota Balikpapan**.

Proyek ini dibangun menggunakan teknologi modern (Next.js, Prisma, Tailwind CSS) untuk melayani kebutuhan administrasi, pendataan kader, E-Learning, manajemen kegiatan, hingga laporan keuangan secara terpadu dan aman.

## 🚀 Fitur Utama

- **Dashboard Terpadu**: Panel manajemen khusus untuk Super Admin, Pengurus, dan Kader.
- **Galeri & Berita Otomatis**: Sistem album foto cerdas dan jurnal kegiatan. Konversi otomatis ke format WebP untuk performa super cepat.
- **E-Learning PMII**: Pusat materi pendidikan (MAPABA, PKD, dll) terintegrasi berbasis digital.
- **Database Kader**: Integrasi penuh data base keanggotaan dalam satu pintu.
- **Optimasi Filososfis**: Aplikasi ini berjalan di Port `1960` — terinspirasi dari tahun berdirinya PMII (17 April 1960).

---

## 💻 Pengembangan Lokal (Development)

Untuk ikut mengembangkan website ini di komputer lokal Anda:

1. **Clone & Install**
   ```bash
   git clone https://github.com/iroysaid/pmii-balikpapan-core.git
   cd pmii-balikpapan-core
   npm install
   ```

2. **Generate Database & Jalankan Server**
   ```bash
   npx prisma generate
   npm run dev -p 1960
   ```

3. Buka browser Anda di [http://localhost:1960](http://localhost:1960) untuk melihat hasilnya.

---

## 🐳 Panduan Deployment (Server/Production)

Aplikasi ini sudah dipersiapkan dan dioptimasi secara penuh untuk berjalan di atas server manapun menggunakan ekosistem **Docker (Debian Slim Node)** yang kebal dan aman terhadap kehilangan data.

Langkah deployment **TIDAK DIJELASKAN** di sini. Segala instruksi lengkap mengenai prosedur keamanan, penyesuaian ENV, instalasi server, hingga konfigurasi proxy telah kami rangkum di:

👉 **[BACA PANDUAN DEPLOYMENT (DEPLOYMENT.md)](./DEPLOYMENT.md)**

---

*Tumbuh subur kader PMII, Dzikir, Fikir, dan Amal Shaleh.*
