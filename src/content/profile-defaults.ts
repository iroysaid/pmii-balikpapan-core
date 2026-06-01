import type { ProfileContent } from "@/lib/profile/types";

export const profileDefaults: ProfileContent = {
  hero: {
    title: "Profil Organisasi",
    description:
      "Mengenal lebih dekat Pergerakan Mahasiswa Islam Indonesia Cabang Balikpapan.",
  },
  history: {
    title: "Sejarah Singkat",
    description:
      "Pergerakan Mahasiswa Islam Indonesia (PMII) lahir dari kegelisahan mahasiswa Nahdliyin akan peran mahasiswa dalam membangun bangsa dan mempertahankan kedaulatan NKRI. PC PMII Balikpapan terus bertransformasi menjadi wadah kaderisasi intelektual organik yang kritis dan inovatif di Kota Beriman.",
  },
  visionMission: {
    title: "Visi & Misi",
    items: [
      "Terbentuknya pribadi muslim Indonesia yang bertaqwa kepada Allah SWT.",
      "Berbudi luhur, berilmu, cakap, dan bertanggung jawab.",
      "Mengamalkan nilai-nilai Ahlussunnah wal Jamaah.",
    ],
  },
  values: {
    title: "Nilai Dasar (NDP)",
    description:
      "Tauhid, Habluminallah, Habluminannas, dan Habluminalalam menjadi landasan filosofis setiap kader dalam bergerak dan berkontribusi.",
  },
  structure: {
    title: "Struktur Pengurus Cabang",
    description: "Data pengurus sedang dalam proses digitalisasi.",
  },
  secretariat: {
    eyebrow: "Hubungi & Kunjungi Kami",
    title: "Lokasi Sekretariat",
    addressTitle: "Alamat Lengkap",
    address:
      "Jl. Ratte Daeng Nai, Sepinggan Raya, Balikpapan Selatan, Kota Balikpapan, 76114",
    mapsUrl: "https://maps.app.goo.gl/acFYwLwgVrvWUrZY9",
    embedUrl:
      "https://maps.google.com/maps?q=-1.250806,116.888083&t=&z=17&ie=UTF8&iwloc=&output=embed",
  },
};
