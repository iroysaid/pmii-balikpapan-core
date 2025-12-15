# Panduan Deployment ke Vercel

Project ini menggunakan **Next.js**. Platform deployment terbaik dan termudah (serta Gratis untuk hobi/personal) adalah **Vercel**.

## 1. Persiapan Database (Penting!)
Saat ini project menggunakan **SQLite** (`dev.db`). SQLite **TIDAK BISA** digunakan di Vercel secara persistent (data akan hilang setiap deploy). Anda harus beralih ke Database Cloud seperti **PostgreSQL**.

### Solusi Termudah: Vercel Postgres
1.  Login ke [Vercel](https://vercel.com).
2.  Buat Project baru -> Import dari GitHub Repository Anda (`pmii-balikpapan-core`).
3.  Di halaman konfigurasi Vercel:
    *   Klik tab **Storage** (atau nanti setelah project dibuat).
    *   Buat Database **Postgres** baru.
    *   Vercel akan memberikan *Environment Variables* (`POSTGRES_PRISMA_URL`, dll).

### Update Kode untuk PostgreSQL
Anda perlu mengubah `prisma/schema.prisma` sebelum deploy:

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql" // Ubah dari sqlite
  url      = env("POSTGRES_PRISMA_URL") // Gunakan env dari Vercel
  directUrl = env("POSTGRES_URL_NON_POOLING") // Optional, untuk Vercel Postgres
}
```

Jalankan perintah ini lokal untuk generate ulang client:
```bash
npm install pg
npx prisma generate
```

## 2. Environment Variables
Di Dashboard Vercel (Settings -> Environment Variables), pastikan Anda memasukkan KEY yang sama dengan file `.env` lokal Anda:

*   `NEXTAUTH_SECRET`: Generate string acak baru (bisa pakai `openssl rand -base64 32`).
*   `NEXTAUTH_URL`: Isi dengan domain Vercel Anda (misal `https://pmii-balikpapan.vercel.app`).

## 3. Build Command
Vercel otomatis mendeteksi Next.js. Namun untuk pertama kali, Anda perlu menjalankan migrasi database saat build.
Update `package.json` Anda:

```json
"scripts": {
  "build": "prisma generate && prisma db push && next build",
  ...
}
```
*Catatan: `prisma db push` akan mensinkronkan skema ke database Postgres baru Anda.*

## 4. Deploy
Setelah setup di atas:
1.  Push perubahan (`schema.prisma`, `package.json`) ke GitHub.
2.  Vercel akan otomatis mendeteksi commit baru dan melakukan deployment.
3.  Tunggu hingga status "Ready".

## Alternatif: VPS (Tanpa Ganti Database)
Jika ingin tetap pakai SQLite, Anda harus sewa VPS (Linux Server) dan menjalankan manual:
1.  Upload file ke server.
2.  `npm install` & `npm run build`.
3.  Jalanan dengan `pm2 start npm --name "pmii-app" -- start`.
4.  Setup Nginx sebagai reverse proxy.
