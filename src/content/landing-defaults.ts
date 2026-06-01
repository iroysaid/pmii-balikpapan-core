import type { LandingContent } from "@/lib/landing/types";

export const landingDefaults: LandingContent = {
  navbar: {
    brandTop: "PC PMII",
    brandBottom: "BALIKPAPAN",
    logos: [
      { src: "/PB_PMII.png", alt: "Logo PMII" },
      { src: "/PMII_BPP.png", alt: "Logo PMII Balikpapan" },
    ],
    links: [
      { name: "Beranda", href: "/" },
      { name: "Profil", href: "/profil" },
      { name: "Agenda", href: "/kegiatan" },
      { name: "Berita", href: "/berita" },
      { name: "Galeri", href: "/galeri" },
    ],
    loginLink: { label: "Login", href: "/masuk" },
  },
  footer: {
    brand: "PC PMII BALIKPAPAN",
    tagline: "Dzikir, Fikir, dan Amal Sholeh.",
    socials: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/pmiibalikpapan?igsh=MWxyZGZtd2F4MWh1dA==",
      },
    ],
    quickLinks: [
      { name: "Tentang Kami", href: "/profil" },
      { name: "Berita Terkini", href: "/berita" },
      { name: "Pendaftaran Anggota", href: "/daftar" },
    ],
    secretariatTitle: "Sekretariat",
    addressLabel: "Alamat:",
    address:
      "Jl. Ratte Daeng Nai, Kel. Sepinggan Raya, Perum. Balikpapan Kota, Gn. Bahagia, Kec. Balikpapan Selatan, Kota Balikpapan, Kalimantan Timur 76114",
    mapsCta: {
      label: "Lihat di Google Maps",
      href: "https://maps.app.goo.gl/acFYwLwgVrvWUrZY9",
    },
    email: "pmiibalikpapan@gmail.com",
    copyright: "© 2025 @royhss_id beta version 0.0.0.60",
  },
  hero: {
    eyebrow: "Website resmi organisasi",
    title: "PMII",
    titleHighlight: "Balikpapan",
    titleSuffix: "Bergerak",
    description:
      "Website resmi PC PMII Kota Balikpapan untuk kaderisasi, dokumentasi gerakan, kabar organisasi, dan ruang belajar kader.",
    primaryCta: {
      label: "Gabung PMII Balikpapan",
      href: "/daftar",
    },
    studyCta: {
      label: "Mulai Belajar",
      href: "/materi",
    },
    floatingImages: [
      {
        image:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=500&auto=format&fit=crop",
        alt: "Kader PMII berdiskusi",
        title: "kaderisasi",
        description: "ruang belajar bersama",
      },
      {
        image:
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=500&auto=format&fit=crop",
        alt: "Forum organisasi mahasiswa",
        title: "forum kader",
        description: "diskusi dan advokasi",
      },
    ],
  },
  visionMission: {
    eyebrow: "Profil Organisasi",
    title: "Visi Misi",
    visionTitle: "Visi",
    vision:
      "Terbentuknya pribadi muslim Indonesia yang bertaqwa kepada Allah SWT, berbudi luhur, berilmu, cakap dan bertanggung jawab dalam mengamalkan ilmunya serta komitmen memperjuangkan cita-cita kemerdekaan Indonesia.",
    missionTitle: "Misi",
    missions: [
      "Komitmen terhadap nilai-nilai keislaman Ahlussunnah wal Jamaah.",
      "Memperjuangkan keadilan dan kesejahteraan sosial.",
      "Mengembangkan intelektualitas dan profesionalitas kader.",
    ],
  },
  ndp: {
    title: "Nilai Dasar Pergerakan",
    description:
      "Landasan berfikir, bersikap, dan bertindak setiap kader PMII dalam kehidupan sehari-hari maupun organisasi.",
    items: [
      {
        title: "Tauhid",
        desc: "Mengesakan Allah SWT sebagai sumber dari segala sumber kebenaran.",
      },
      {
        title: "Hablum Minallah",
        desc: "Menjaga hubungan vertikal dengan Allah SWT melalui ibadah dan ketaqwaan.",
      },
      {
        title: "Hablum Minannas",
        desc: "Menjaga hubungan baik antar sesama manusia dengan prinsip egaliter dan persaudaraan.",
      },
      {
        title: "Hablum Minal Alam",
        desc: "Menjaga kelestarian alam semesta sebagai tempat hidup dan beribadah.",
      },
    ],
  },
  team: {
    eyebrow: "Struktur",
    title: "Pengurus PMII Balikpapan",
    description:
      "Default grayscale, lalu tampil warna asli saat hover, focus, atau sentuhan. Di mobile, geser ke samping untuk melihat semua pengurus.",
    members: [
      {
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=700&auto=format&fit=crop",
        name: "Ketua Cabang",
        role: "Koordinator Gerakan",
      },
      {
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=700&auto=format&fit=crop",
        name: "Sekretaris",
        role: "Administrasi Organisasi",
      },
      {
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=700&auto=format&fit=crop",
        name: "Bendahara",
        role: "Tata Kelola Keuangan",
      },
      {
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=700&auto=format&fit=crop",
        name: "Kaderisasi",
        role: "Pengembangan Kader",
      },
      {
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=700&auto=format&fit=crop",
        name: "Media",
        role: "Publikasi dan Informasi",
      },
      {
        image:
          "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=700&auto=format&fit=crop",
        name: "Advokasi",
        role: "Kajian dan Aksi",
      },
    ],
  },
  documentation: {
    eyebrow: "Dokumentasi",
    title: "Jejak Kegiatan PMII",
    description: "Cuplikan dokumentasi kegiatan, forum, dan ruang kaderisasi PMII Balikpapan.",
    photos: [],
    primaryCta: { label: "Buka Galeri", href: "/galeri" },
    secondaryCta: { label: "Lihat Lainnya", href: "/galeri" },
    emptyText: "Dokumentasi kegiatan akan tampil otomatis setelah foto diunggah.",
  },
  movement: {
    cards: [
      {
        title: "Kaderisasi",
        text: "Dibangun untuk bertumbuh bersama.",
        image:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
        alt: "Kader PMII dalam forum kaderisasi",
        icon: "graduation",
        overlay: "blue",
      },
      {
        title: "Gerakan",
        text: "Berpihak pada masyarakat.",
        image:
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
        alt: "Diskusi dan gerakan sosial",
        icon: "handshake",
        overlay: "blue",
      },
      {
        title: "Solidaritas",
        text: "Sahabat dalam satu barisan.",
        image:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
        alt: "Solidaritas kader dalam satu barisan",
        icon: "users",
        overlay: "blue",
      },
    ],
  },
  news: {
    eyebrow: "Kabar Terbaru",
    title: "Kabar Terbaru",
    cta: { label: "Lihat Semua", href: "/berita" },
    emptyText: "Belum ada berita terbaru.",
    headlineLabel: "Headline",
    popularLabel: "Populer",
    description: "Berita, opini, propaganda gerakan, dan ekspresi karya kader.",
    displayCount: 3,
    selectedSlugs: [],
  },
  agenda: {
    eyebrow: "Informasi Kegiatan",
    title: "Informasi Kegiatan",
    cta: { label: "Lihat Agenda Lengkap", href: "/kegiatan" },
    learningTitle: "E-Learning Kader",
    learningDescription:
      "Akses pedoman, modul MAPABA, dan materi pendalaman kader melalui ruang belajar digital.",
    learningCta: { label: "Mulai Belajar", href: "/materi" },
    description: "Agenda terpilih dari kegiatan PMII Balikpapan.",
    displayCount: 5,
    selectedSlugs: [],
  },
  finalCta: {
    title: "Bergabung Bersama PMII",
    description:
      "Jadilah bagian dari mahasiswa pergerakan yang siap belajar, berorganisasi, dan mengabdi untuk masyarakat.",
    cta: { label: "Daftar Sekarang", href: "/daftar" },
  },
};
