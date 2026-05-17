# Konsep Besar Website PMII Balikpapan

Dokumen ini disusun sebagai pedoman pengembangan, bahan presentasi, dan acuan narasi produk untuk Website & Sistem Manajemen PC PMII Kota Balikpapan.

## Ringkasan Eksekutif

Website PMII Balikpapan adalah platform digital terpadu untuk membangun wajah organisasi, mengelola kader, menyebarkan gagasan, mendokumentasikan kegiatan, dan memperluas akses pembelajaran kader. Sistem ini tidak hanya berfungsi sebagai website profil, tetapi juga sebagai pusat manajemen organisasi yang menghubungkan kebutuhan publik, kader, pengurus komisariat, pengurus cabang, dan super admin dalam satu ekosistem.

Secara konsep, website ini memiliki dua wajah besar. Pertama, wajah publik sebagai ruang branding, publikasi, informasi kegiatan, galeri, dan pengenalan nilai PMII. Kedua, wajah internal sebagai sistem kerja organisasi yang meliputi LMS kaderisasi, database kader, manajemen berita, kegiatan, surat menyurat, keuangan, RSVP, dan dashboard berbasis role.

Tujuan besarnya adalah membuat PMII Balikpapan memiliki infrastruktur digital yang rapi, modern, fleksibel, dan dapat diwariskan antar periode kepengurusan.

## Identitas Produk

Nama sistem: Website & Sistem Manajemen Kaderisasi PC PMII Balikpapan.

Tagline kerja: Digitalisasi gerakan, kaderisasi, dan administrasi PMII Balikpapan.

Nilai utama:
- Profiling organisasi yang kuat dan mudah dipahami publik.
- Kaderisasi fleksibel melalui LMS yang dapat diakses dari mana saja.
- Administrasi organisasi yang tertib, terdokumentasi, dan mudah diwariskan.
- Publikasi gagasan kader sebagai ruang intelektual dan propaganda gerakan.
- Database kader yang menjadi memori kelembagaan lintas periode.

## Kerangka Sistem

Website ini dibangun dengan Next.js, Tailwind CSS, TypeScript, Prisma, SQLite, NextAuth, dan sistem dashboard berbasis role. Struktur utamanya dapat dibagi menjadi lima lapisan.

1. Lapisan publik: halaman yang bisa diakses semua pengunjung, seperti landing page, profil, berita, kegiatan, galeri, kontak, pendaftaran kader, dan katalog materi publik.
2. Lapisan pembelajaran: LMS PMII yang berisi modul, bab, PDF, video YouTube, pedoman administrasi, AD/ART, materi MAPABA, materi pendalaman, kecakapan, dan materi kaderisasi lanjutan.
3. Lapisan kader: dashboard anggota/kader yang menampilkan profil kader, status keanggotaan, data akademik, komisariat, NIA, riwayat kaderisasi, modul yang dipelajari, dan pengembangan portofolio kader.
4. Lapisan pengurus: dashboard pengurus cabang dan komisariat untuk mengelola kegiatan, berita, materi, surat, keuangan, dan data organisasi sesuai kewenangan.
5. Lapisan super admin: panel tertinggi untuk mengelola seluruh database, role, kader, modul, transaksi, surat, post, kegiatan, dan struktur organisasi lintas komisariat.

## Struktur Halaman Publik

### Landing Page

Landing page adalah halaman muka utama untuk branding PMII Balikpapan. Halaman ini harus memberi kesan kuat sejak pertama dibuka: modern, aktif, intelektual, dan berkarakter pergerakan.

Komponen ideal landing page:
- Hero section dengan animasi, identitas PMII Balikpapan, CTA daftar kader, dan CTA jelajahi materi.
- Profil singkat organisasi.
- Visi, misi, dan tujuan PMII.
- Nilai Dasar Pergerakan atau NDP 4: Tauhid, Hablum Minallah, Hablum Minannas, dan Hablum Minal Alam.
- Susunan pengurus dengan gaya foto hitam putih yang berubah warna saat hover.
- Highlight kegiatan terbaru dan dokumentasi.
- Highlight LMS atau materi kaderisasi.
- Highlight berita/opini kader.
- Footer berisi alamat sekretariat, kontak, media sosial, dan tautan cepat.

Kondisi kode saat ini:
- Sudah ada landing page utama lama di route root.
- Sudah ada landing page baru terpisah di /pmii dengan hero animatif, pengurus, gallery interaktif, dan parallax content.
- Navbar/footer global disembunyikan khusus /pmii agar halaman terasa sebagai experience branding tersendiri.

Arahan pengembangan:
- Satukan konsep /pmii dengan kebutuhan final landing page utama.
- Tambahkan section visi misi, tujuan, NDP 4, berita pilihan, kegiatan terbaru, dan footer.
- Putuskan apakah /pmii menjadi landing utama baru atau tetap halaman campaign terpisah.

### Profil

Halaman profil menjelaskan sejarah, visi, misi, nilai, struktur organisasi, dan posisi PMII Balikpapan sebagai organisasi kaderisasi mahasiswa Islam.

Fungsi:
- Menjelaskan identitas organisasi kepada calon kader, alumni, mitra, dan publik.
- Menjadi referensi resmi tentang PMII Balikpapan.
- Menguatkan kredibilitas organisasi.

### Berita dan Ruang Gagasan

Halaman berita tidak hanya untuk kabar kegiatan. Ia harus menjadi ruang ekspresi kader dan kanal intelektual PMII.

Jenis konten:
- Berita kegiatan PMII.
- Tulisan opini dan kritik kader.
- Ekspresi karya kader.
- Propaganda nilai dan gagasan PMII.
- Analisis sosial, politik, pendidikan, ekonomi, lingkungan, dan kebijakan pemerintah.
- Catatan advokasi dan respons organisasi terhadap isu publik.

Kondisi kode saat ini:
- Model Post, Tag, dan PostTag sudah tersedia.
- Halaman /berita sudah menampilkan post published dengan gaya editorial.
- Halaman /berita/[slug] sudah memiliki detail artikel, tag, author, dan related posts.
- Dashboard berita tersedia untuk membuat dan mengelola post.

Arahan pengembangan:
- Perjelas kategori/tag seperti Kaderisasi, Opini, Daerah, Pergerakan, Advokasi, Kritik Kebijakan, dan Karya Kader.
- Tambahkan status editorial bila dibutuhkan: draft, review, published.
- Tambahkan author berbasis user agar tulisan kader bisa terhubung dengan profil kader.

### Kegiatan dan Agenda

Halaman kegiatan berfungsi sebagai kalender publik dan arsip gerakan PMII Balikpapan.

Alur ideal:
1. Pengurus membuat kegiatan dari dashboard.
2. Kegiatan dapat diberi poster, deskripsi, tanggal mulai, tanggal selesai, lokasi, penyelenggara, scope, dan status published.
3. Jika kegiatan belum lewat tanggal, halaman publik menampilkan status akan datang atau sedang berlangsung.
4. Jika kegiatan memerlukan pendaftaran, pengunjung bisa mengisi formulir daftar hadir.
5. Jika kegiatan bertipe undangan, sistem menyediakan halaman undangan dan RSVP.
6. Jika kegiatan sudah lewat tanggal, status berubah menjadi dokumentasi.
7. Pengurus mengunggah foto dokumentasi kegiatan.
8. Foto kegiatan tampil di detail kegiatan dan terhubung dengan galeri/album.

Kondisi kode saat ini:
- Model Activity, ActivityImage, RSVP, dan Pendaftar sudah tersedia.
- Halaman /kegiatan sudah memiliki filter semua, akan datang, sedang berlangsung, dan dokumentasi.
- Halaman /kegiatan/[slug] sudah menampilkan poster, deskripsi, tanggal, lokasi, status, form pendaftaran untuk kegiatan akan datang, dan galeri dokumentasi untuk kegiatan yang sudah lewat.
- Dashboard kegiatan sudah tersedia.
- Fitur invitation dan RSVP sudah ada secara konsep dan komponen.

Catatan teknis penting:
- Halaman /undangan/[slug] masih memakai activity.eventDate, sementara schema Prisma memakai startDate dan endDate. Ini perlu diselaraskan agar halaman undangan stabil.
- Halaman undangan memakai /logo-pmii.png, sementara aset publik yang tersedia adalah PMII_BPP.png dan PB_PMII.png. Aset logo perlu disesuaikan.

### Galeri dan Album

Galeri menjadi arsip visual kegiatan organisasi.

Konsep:
- Galeri umum menampilkan album kegiatan.
- Setiap kegiatan yang sudah selesai bisa memiliki foto dokumentasi.
- Foto di detail kegiatan otomatis dapat menjadi sumber album.
- Landing page dapat menampilkan section album pilihan.

Kondisi kode saat ini:
- Model GalleryItem tersedia, tetapi integrasi utama dokumentasi kegiatan lebih kuat melalui ActivityImage.
- Halaman /galeri dan /galeri/[slug] sudah ada.
- Landing page /pmii sudah memiliki gallery interaktif berbasis komponen baru, tetapi masih memakai gambar Unsplash sebagai placeholder visual.

Arahan pengembangan:
- Hubungkan gallery landing page dengan data ActivityImage dari database.
- Buat album berdasarkan kegiatan agar dokumentasi tidak terpisah dari agenda.
- Tambahkan upload batch foto kegiatan dari dashboard.

## LMS PMII: Platform Pembelajaran Kader

LMS adalah pusat pembelajaran kader PMII Balikpapan. Istilah yang digunakan sebaiknya LMS PMII atau Pusat Pembelajaran Kader, bukan sekadar e-learning, karena konsepnya bukan hanya kelas online, tetapi ruang kaderisasi digital.

Masalah yang dijawab:
- Kader sering punya keterbatasan waktu karena kuliah, kerja, organisasi, dan aktivitas lain.
- Pembelajaran tidak selalu bisa dilakukan dengan berkumpul di satu tempat.
- Materi dasar PMII perlu mudah diakses dan diwariskan.
- Materi pendalaman perlu tetap terjaga untuk kader terverifikasi.

Tujuan LMS:
- Membuat kader bisa belajar fleksibel dari mana saja.
- Menyediakan modul dasar yang bisa diakses publik.
- Menyediakan modul lanjutan yang hanya bisa diakses kader/login.
- Menjadi arsip materi kaderisasi yang terus diperbarui.
- Mengurangi ketergantungan pada penyampaian lisan yang tidak terdokumentasi.

### Struktur Materi LMS

Kategori materi:
- Materi publik: Pedoman administrasi PMII, AD/ART PMII, NDP dasar, materi MAPABA, sejarah PMII, dasar organisasi, dan referensi umum.
- Materi kader login: Pendalaman ideologi, materi kecakapan organisasi, teknik advokasi, kepemimpinan, manajemen aksi, jurnalistik kader, administrasi lanjutan, pengelolaan forum, dan materi kaderisasi lanjutan.
- Materi pengurus: Tata kelola komisariat/cabang, surat menyurat, keuangan organisasi, database kader, manajemen kegiatan, dan laporan periodik.

Alur akses ideal:
1. Pengunjung membuka halaman LMS publik.
2. Pengunjung melihat daftar modul publik.
3. Pengunjung menekan Lihat Modul Lainnya.
4. Jika belum login, sistem mengarahkan ke halaman login.
5. Jika sudah login dan session masih aktif, sistem langsung menampilkan semua modul sesuai role.
6. Kader dapat membuka modul private.
7. Admin/pengurus dapat membuat dan memperbarui modul dari dashboard.

Kondisi kode saat ini:
- Model Material dan MaterialChapter sudah tersedia.
- Materi bisa memiliki banyak bab.
- Bab bisa bertipe DOCUMENT atau YOUTUBE.
- Halaman /materi menampilkan materi published.
- Halaman /materi/[id] menampilkan viewer PDF atau YouTube.
- Dashboard materi tersedia untuk create, update, delete.
- Upload PDF dan thumbnail materi sudah didukung.

Gap penting:
- Belum ada field accessLevel atau visibility untuk membedakan materi publik dan private.
- Halaman /materi saat ini menampilkan semua isPublished: true.
- Belum ada tracking progres belajar per kader.
- Dashboard kader menampilkan jumlah modul dipelajari 0, masih placeholder.

Rekomendasi schema tambahan:
- Material.accessLevel: PUBLIC, KADER, PENGURUS, ADMIN.
- Material.category: Administrasi, AD/ART, MAPABA, Pendalaman, Kecakapan, Advokasi, Kepemimpinan.
- LearningProgress: userId, materialId, chapterId, status, completedAt, lastOpenedAt.
- Certificate: userId, title, issuer, fileUrl, issuedAt, type.

## Dashboard dan Role

Sistem memakai role:
- PUBLIC
- KADER
- PENGURUS_KOMISARIAT
- PENGURUS_CABANG
- ADMIN_CABANG
- SUPER_ADMIN

### Super Admin

Super Admin adalah role tertinggi.

Kewenangan:
- Mengelola semua kader.
- Memverifikasi kader.
- Mengelola role user.
- Mengelola materi LMS.
- Mengelola berita dan artikel.
- Mengelola kegiatan.
- Mengelola surat.
- Mengelola keuangan.
- Mengelola database organisasi/komisariat.
- Melakukan ekspor data.

Kondisi kode saat ini:
- Dashboard utama menampilkan total kader, saldo kas, surat masuk/keluar, jumlah materi, dan berita terbaru.
- Database kader hanya dapat dikelola oleh SUPER_ADMIN dan ADMIN_CABANG.
- Server actions beberapa modul sudah membatasi role.

### Admin Cabang dan Pengurus Cabang

Admin Cabang/Pengurus Cabang mengelola kebutuhan organisasi di level cabang.

Kewenangan ideal:
- Mengelola agenda cabang.
- Mengelola berita organisasi.
- Mengelola surat cabang.
- Mengelola keuangan cabang.
- Melihat database kader lintas komisariat sesuai izin.
- Mengelola materi kaderisasi yang sifatnya cabang.

### Pengurus Komisariat

PMII Balikpapan memiliki lima komisariat:
- Komisariat Nusantara.
- Komisariat Uniba.
- Komisariat Mulia.
- Komisariat Staiba.
- Komisariat Stitba.

Konsep role komisariat:
- Setiap komisariat memiliki database kader sendiri.
- Setiap komisariat memiliki arsip surat sendiri.
- Setiap komisariat memiliki catatan kas sendiri.
- Setiap komisariat dapat membuat kegiatan komisariat.
- Data komisariat tetap bisa direkap oleh admin cabang/super admin.

Kondisi kode saat ini:
- Model Organization sudah tersedia.
- User, Letter, Transaction, Post, dan Activity bisa memiliki organizationId.
- Surat dan keuangan sudah memfilter berdasarkan organizationId untuk non-super admin.
- Kegiatan sudah memiliki validasi agar pengurus komisariat tidak mengedit kegiatan milik organisasi lain.

Arahan pengembangan:
- Pastikan semua pengurus komisariat wajib memiliki organizationId.
- Perkuat UI dashboard komisariat agar hanya menampilkan data komisariatnya.
- Tambahkan halaman rekap cabang untuk membandingkan data lima komisariat.
- Buat mapping komisariat sebagai data master, bukan hardcoded di banyak tempat.

### Dashboard Kader

Dashboard kader adalah ruang personal kader.

Fitur ideal:
- Profil kader.
- Foto profil.
- NIA.
- Asal komisariat.
- Kampus, fakultas, prodi/jurusan.
- Tahun MAPABA.
- Riwayat PKD, PKL, PKN.
- Pelatihan lain.
- Sertifikat kaderisasi.
- Sertifikat pengembangan karir.
- Modul LMS yang sedang/selesai dipelajari.
- Riwayat kegiatan yang pernah diikuti.
- Status verifikasi keanggotaan.

Kondisi kode saat ini:
- Halaman /dashboard/anggota sudah tersedia.
- Sudah menampilkan nama, status, NIA, komisariat, kampus, fakultas, jurusan.
- Jumlah modul dipelajari masih placeholder.
- Link edit profil menuju /dashboard/settings, tetapi halaman itu belum terlihat dalam struktur.

Arahan pengembangan:
- Buat halaman edit profil kader.
- Tambahkan upload foto profil kader.
- Tambahkan model sertifikat dan portofolio.
- Hubungkan LMS progress ke dashboard kader.
- Tambahkan riwayat RSVP/pendaftaran kegiatan kader.

## Database dan Model Data

Model utama yang sudah ada:
- Organization: cabang/komisariat.
- User: akun dan role.
- KaderProfile: data detail kader.
- Post, Tag, PostTag: berita, artikel, dan kategori.
- GalleryItem: item galeri umum.
- Material, MaterialChapter: LMS.
- Letter: arsip surat masuk/keluar.
- Transaction: arus kas.
- Activity, ActivityImage: kegiatan dan dokumentasi.
- RSVP: konfirmasi undangan.
- Pendaftar: pendaftaran kehadiran kegiatan.

Kekuatan desain data:
- Sudah ada pemisahan organisasi melalui organizationId.
- Sudah ada role untuk membedakan akses.
- Sudah ada data kader cukup lengkap.
- Sudah ada dasar LMS berbasis modul dan bab.
- Sudah ada dasar event management dan dokumentasi.

Kekurangan yang perlu dilengkapi:
- Belum ada pemisahan public/private materi.
- Belum ada progress LMS.
- Belum ada sertifikat kader.
- Belum ada relasi post dengan user author.
- Belum ada data master komisariat yang eksplisit selain Organization.
- Belum ada audit log untuk perubahan data penting.
- Undangan perlu diselaraskan dengan startDate/endDate.

## Alur Pengguna

### Alur Pengunjung Publik

1. Pengunjung membuka landing page.
2. Pengunjung mengenal PMII Balikpapan melalui hero, profil, visi misi, tujuan, NDP, pengurus, berita, kegiatan, dan galeri.
3. Pengunjung dapat membaca berita dan opini kader.
4. Pengunjung dapat melihat kegiatan yang akan datang.
5. Pengunjung dapat membuka katalog materi publik.
6. Pengunjung dapat mendaftar sebagai kader atau login.

### Alur Calon Kader

1. Calon kader membuka halaman daftar.
2. Calon kader mengisi data diri, kampus, fakultas, komisariat, dan informasi awal.
3. Sistem menyimpan status sebagai PENDING.
4. Admin memverifikasi data.
5. Setelah diverifikasi, kader dapat masuk ke dashboard anggota.

### Alur Kader

1. Kader login.
2. Kader masuk dashboard anggota.
3. Kader melihat profil, status, NIA, komisariat, kampus, fakultas, dan jurusan.
4. Kader membuka LMS dan mengakses modul publik maupun private.
5. Kader mengikuti kegiatan dan mengisi pendaftaran/RSVP.
6. Kader menyimpan sertifikat dan riwayat pelatihan.

### Alur Pengurus Komisariat

1. Pengurus komisariat login.
2. Pengurus melihat dashboard sesuai komisariat.
3. Pengurus mengelola kegiatan komisariat.
4. Pengurus mengarsipkan surat komisariat.
5. Pengurus mencatat arus kas komisariat.
6. Data otomatis masuk rekap cabang, tetapi tetap terpisah berdasarkan organizationId.

### Alur Pengurus Cabang/Admin

1. Admin login ke dashboard.
2. Admin melihat overview organisasi.
3. Admin mengelola database kader.
4. Admin memverifikasi kader pending.
5. Admin membuat berita, kegiatan, materi LMS, surat, dan transaksi.
6. Admin mengunggah dokumentasi kegiatan.
7. Admin mengekspor data jika dibutuhkan.

## Kerangka Navigasi

Navigasi publik:
- Beranda.
- Profil.
- Agenda/Kegiatan.
- Berita.
- Galeri.
- LMS/Materi.
- Daftar.
- Login.

Navigasi dashboard pengurus:
- Dashboard.
- Informasi & Kegiatan.
- Database Kader.
- Berita/Artikel.
- LMS.
- Administrasi Surat.
- Keuangan.
- Keluar.

Navigasi dashboard kader:
- Dashboard Anggota.
- Profil Saya.
- LMS.
- Berita/Artikel.
- Sertifikat/Portofolio.
- Riwayat Kegiatan.
- Keluar.

## Role User dan Akses Fitur

Sistem ini perlu memakai pembagian role yang jelas agar setiap pengguna hanya melihat dan mengelola fitur sesuai kewenangannya. Pembagian akses bukan hanya untuk keamanan teknis, tetapi juga untuk menjaga tertib organisasi: data cabang, data komisariat, data kader, arsip surat, dan keuangan harus berada di tangan role yang tepat.

### Daftar Role

1. `PUBLIC`
   Pengunjung umum yang belum login. Role ini mewakili calon kader, alumni, mitra, masyarakat, dan pembaca umum.

2. `KADER`
   Anggota/kader PMII yang sudah memiliki akun dan dapat mengakses dashboard anggota serta materi pembelajaran internal sesuai hak akses kader.

3. `PENGURUS_KOMISARIAT`
   Pengurus komisariat dari salah satu dari lima komisariat. Role ini mengelola data operasional komisariatnya sendiri, seperti kegiatan, surat, dan keuangan komisariat.

4. `PENGURUS_CABANG`
   Pengurus cabang yang memiliki kewenangan lebih luas di tingkat PC PMII Balikpapan, terutama untuk agenda cabang, publikasi, administrasi, dan rekap organisasi.

5. `ADMIN_CABANG`
   Admin operasional cabang yang membantu mengelola sistem, database kader, publikasi, materi, dan data lintas komisariat sesuai mandat cabang.

6. `SUPER_ADMIN`
   Role tertinggi yang memiliki akses penuh ke seluruh sistem, data, konfigurasi, dan manajemen role.

### Matriks Akses Ringkas

| Fitur | Public | Kader | Pengurus Komisariat | Pengurus Cabang | Admin Cabang | Super Admin |
| --- | --- | --- | --- | --- | --- | --- |
| Landing page, profil, berita publik, kegiatan publik, galeri | Lihat | Lihat | Lihat | Lihat | Lihat | Lihat |
| Pendaftaran kader | Isi formulir | Tidak perlu | Lihat jika diberi akses | Lihat jika diberi akses | Kelola/verifikasi | Kelola/verifikasi |
| Login dan dashboard | Tidak | Ya | Ya | Ya | Ya | Ya |
| LMS materi publik | Lihat | Lihat | Lihat | Lihat | Lihat | Lihat |
| LMS materi private kader | Login diperlukan | Lihat | Lihat | Lihat | Kelola | Kelola |
| LMS materi pengurus | Tidak | Terbatas | Lihat sesuai role | Lihat | Kelola | Kelola |
| Membuat/mengedit modul LMS | Tidak | Tidak | Opsional/terbatas | Opsional/terbatas | Ya | Ya |
| Dashboard kader pribadi | Tidak | Lihat/kelola profil sendiri | Tidak sebagai kader, kecuali akun juga kader | Tidak sebagai kader, kecuali akun juga kader | Bisa lihat data sesuai izin | Akses penuh |
| Upload sertifikat/portofolio kader | Tidak | Ya, milik sendiri | Ya, milik sendiri | Ya, milik sendiri | Bisa bantu kelola | Akses penuh |
| Database kader | Tidak | Lihat profil sendiri | Lihat kader komisariatnya jika diizinkan | Lihat rekap cabang jika diizinkan | Kelola | Kelola penuh |
| Verifikasi kader | Tidak | Tidak | Usul/verifikasi tingkat komisariat jika diaktifkan | Bisa verifikasi jika diberi mandat | Ya | Ya |
| Berita/artikel | Baca | Baca/tulis draft jika diaktifkan | Tulis/kelola sesuai organisasi | Tulis/kelola | Kelola | Kelola penuh |
| Kegiatan publik | Lihat/daftar | Lihat/daftar/RSVP | Kelola kegiatan komisariat | Kelola kegiatan cabang | Kelola | Kelola penuh |
| Undangan dan RSVP | Isi RSVP jika ada link | Isi RSVP | Buat undangan komisariat | Buat undangan cabang | Kelola | Kelola penuh |
| Upload dokumentasi kegiatan | Tidak | Tidak | Untuk kegiatan komisariatnya | Untuk kegiatan cabang | Ya | Ya |
| Galeri/album kegiatan | Lihat | Lihat | Kelola album komisariat | Kelola album cabang | Kelola | Kelola penuh |
| Surat masuk/keluar | Tidak | Tidak | Kelola surat komisariatnya | Kelola surat cabang | Kelola lintas data | Kelola penuh |
| Keuangan | Tidak | Tidak | Kelola kas komisariatnya | Kelola kas cabang | Kelola/review | Kelola penuh |
| Ekspor data | Tidak | Tidak | Terbatas data komisariat | Terbatas sesuai mandat | Ya | Ya |
| Manajemen user dan role | Tidak | Tidak | Tidak | Tidak | Terbatas | Penuh |

### Prinsip Akses Per Role

`PUBLIC` hanya boleh mengakses informasi yang memang ditujukan untuk publik: landing page, profil, berita published, kegiatan published, galeri, kontak, pendaftaran kader, dan materi LMS publik. Ketika public user menekan tombol `Lihat Modul Lainnya`, sistem harus mengarahkan ke halaman login.

`KADER` memiliki akses ke dashboard anggota, profil dirinya sendiri, LMS private untuk kader, berita, kegiatan, RSVP, dan fitur portofolio/sertifikat. Kader tidak boleh melihat data kader lain, arsip surat, ataupun keuangan organisasi kecuali ada fitur khusus yang memang dibuka sebagai informasi publik.

`PENGURUS_KOMISARIAT` bekerja dalam batas komisariatnya. Semua data yang dibuat atau dikelola harus terhubung dengan `organizationId` komisariat. Role ini idealnya dapat mengelola kegiatan komisariat, dokumentasi kegiatan komisariat, surat komisariat, dan kas komisariat. Untuk database kader, role ini dapat diberi akses baca atau usulan verifikasi hanya untuk kader di komisariatnya, tergantung kebijakan cabang.

`PENGURUS_CABANG` bekerja pada level cabang. Role ini dapat mengelola kegiatan cabang, publikasi cabang, surat cabang, keuangan cabang, dan melihat rekap lintas komisariat jika diberi izin. Role ini bukan role teknis tertinggi, sehingga manajemen user dan konfigurasi sistem tetap sebaiknya dibatasi.

`ADMIN_CABANG` adalah operator sistem tingkat cabang. Role ini dapat mengelola database kader, memverifikasi kader, mengelola LMS, berita, kegiatan, surat, keuangan, dan melakukan ekspor data sesuai kebutuhan administrasi cabang.

`SUPER_ADMIN` memiliki akses penuh. Role ini dipakai untuk pengelola utama sistem, developer/maintainer, atau otoritas yang ditunjuk. Perubahan besar seperti pengaturan role, struktur organisasi, dan data lintas komisariat harus berada di bawah kendali role ini.

### Alur Akses LMS Berdasarkan Role

1. Public user membuka halaman LMS dan hanya melihat modul publik.
2. Public user menekan `Lihat Modul Lainnya`.
3. Jika belum login, sistem mengarahkan ke `/masuk`.
4. Setelah login sebagai kader, user dapat melihat modul publik dan modul private kader.
5. Jika login sebagai pengurus, user dapat melihat modul kader dan modul pengurus sesuai akses.
6. Admin cabang dan super admin dapat membuat, mengedit, mempublikasikan, menyembunyikan, dan mengatur akses modul.

### Alur Akses Komisariat

Setiap pengurus komisariat harus memiliki `organizationId`. Dengan begitu, data yang tampil di dashboard komisariat dapat difilter otomatis.

Contoh:
- Pengurus Komisariat Uniba hanya melihat surat, kas, kegiatan, dan kader Komisariat Uniba.
- Pengurus Komisariat Nusantara hanya melihat data Komisariat Nusantara.
- Admin Cabang dan Super Admin dapat melihat seluruh data atau memfilter per komisariat.

Pola ini penting agar website tidak hanya menjadi sistem cabang, tetapi juga menjadi sistem kerja lima komisariat dalam satu platform.

### Catatan Implementasi Role Saat Ini

Yang sudah ada:
- Role sudah tersimpan di model `User`.
- `Organization` sudah tersedia sebagai dasar pemisahan cabang/komisariat.
- `User`, `Letter`, `Transaction`, `Post`, dan `Activity` sudah dapat terhubung ke `organizationId`.
- Sidebar dashboard sudah membedakan menu berdasarkan role.
- Surat dan keuangan sudah memfilter data berdasarkan organisasi untuk non-super admin.
- Database kader sudah dibatasi untuk `SUPER_ADMIN` dan `ADMIN_CABANG`.

Yang perlu disempurnakan:
- Buat konfigurasi permission terpusat agar aturan akses tidak tersebar di banyak file.
- Pastikan semua server action mengecek role dan `organizationId`.
- Tambahkan role guard untuk halaman dashboard, bukan hanya menyembunyikan menu.
- Tambahkan field akses materi LMS agar modul publik/private bisa dipisahkan.
- Buat halaman manajemen role untuk super admin.
- Tambahkan audit log untuk perubahan data sensitif seperti role, verifikasi kader, transaksi, dan surat.

## Roadmap Pengembangan

### Prioritas 1: Penyempurnaan Identitas Publik

- Jadikan landing page baru sebagai beranda utama atau finalisasi route /pmii.
- Tambahkan visi, misi, tujuan, NDP 4, berita pilihan, kegiatan terbaru, dan footer.
- Ganti gambar placeholder Unsplash dengan foto asli PMII Balikpapan.
- Hubungkan susunan pengurus dengan data pengurus asli.

### Prioritas 2: LMS Publik dan Private

- Tambahkan field akses materi.
- Pisahkan modul publik dan modul private.
- Buat tombol Lihat Modul Lainnya yang mengarah ke login jika belum masuk.
- Tampilkan semua modul sesuai role jika sudah login.
- Tambahkan kategori dan pencarian fungsional.

### Prioritas 3: Dashboard Kader

- Buat halaman edit profil.
- Tambahkan upload foto profil.
- Tambahkan sertifikat dan portofolio.
- Tambahkan progress belajar.
- Tambahkan riwayat kegiatan/RSVP.

### Prioritas 4: Komisariat Multi-Tenant

- Rapikan data master lima komisariat.
- Pastikan seluruh data surat, keuangan, kegiatan, dan kader terikat organisasi.
- Buat dashboard komisariat yang benar-benar terpisah.
- Buat rekap cabang lintas komisariat.

### Prioritas 5: Kegiatan, Undangan, dan Galeri

- Perbaiki field undangan dari eventDate ke startDate.
- Ganti aset logo undangan ke aset yang tersedia.
- Tambahkan upload foto batch setelah kegiatan selesai.
- Hubungkan foto kegiatan dengan halaman galeri dan landing page.

### Prioritas 6: Keamanan dan Kualitas Data

- Tambahkan audit log.
- Perjelas permission per role di seluruh server action.
- Hindari penyimpanan database produksi langsung di Git untuk deployment real.
- Tambahkan backup database otomatis.
- Rapikan lint dan type error yang sudah ada.

## Narasi Presentasi Singkat

Website PMII Balikpapan dirancang sebagai infrastruktur digital organisasi. Di satu sisi, website ini menjadi etalase publik untuk memperkenalkan PMII, menyampaikan gagasan kader, menampilkan kegiatan, dan membangun branding organisasi. Di sisi lain, sistem ini menjadi ruang kerja internal untuk mengelola kader, pembelajaran, surat menyurat, keuangan, kegiatan, dokumentasi, dan administrasi lintas komisariat.

Keunggulan utamanya adalah LMS PMII, yaitu pusat pembelajaran kader yang memungkinkan kader belajar secara fleksibel tanpa harus selalu berkumpul di satu tempat. Kader yang kuliah, bekerja, atau memiliki keterbatasan waktu tetap bisa mengakses materi dasar, pedoman organisasi, AD/ART, materi MAPABA, hingga materi pendalaman sesuai hak aksesnya.

Sistem ini juga memberi ruang bagi kader untuk menulis, mengkritik, berkarya, dan membaca dinamika kebijakan publik melalui kanal berita dan opini. Dengan dashboard berbasis role, super admin, pengurus cabang, pengurus komisariat, dan kader memiliki ruang masing-masing sesuai kebutuhan dan kewenangan.

Dalam jangka panjang, website ini menjadi memori digital PMII Balikpapan: menyimpan data kader, jejak kegiatan, arsip surat, arus kas, materi kaderisasi, dan dokumentasi organisasi agar kepengurusan berikutnya tidak memulai dari nol.

## Catatan Implementasi Saat Ini

Yang sudah kuat:
- Fondasi Next.js, Prisma, Tailwind, NextAuth, dan dashboard sudah tersedia.
- Database kader sudah cukup lengkap.
- LMS berbasis materi dan bab sudah berjalan.
- Berita, kegiatan, galeri, surat, dan keuangan sudah memiliki halaman dan model.
- Role dasar sudah tersedia.
- Landing page baru /pmii sudah ditambahkan sebagai arah branding modern.

Yang perlu disempurnakan:
- Pemisahan LMS publik/private.
- Progress belajar kader.
- Sertifikat/portofolio kader.
- Dashboard komisariat yang benar-benar terisolasi.
- Perbaikan undangan eventDate.
- Integrasi foto kegiatan ke galeri dan landing page.
- Penyelarasan aset visual dengan foto asli PMII Balikpapan.
- Perapihan lint/type error lama.

## Prinsip Pengembangan

Setiap fitur baru sebaiknya mengikuti prinsip berikut:
- Berbasis kebutuhan organisasi, bukan hanya tampilan.
- Data kader harus rapi, aman, dan mudah diwariskan.
- Role dan akses harus jelas.
- Materi kaderisasi harus mudah diakses tetapi tetap terkontrol.
- Kegiatan harus terdokumentasi dari rencana sampai arsip foto.
- Dashboard harus membantu kerja pengurus, bukan menambah beban.
- Landing page harus kuat sebagai identitas, tetapi tetap terhubung dengan data nyata.
