export const memberDataModelBlueprint = [
  "users",
  "roles",
  "permissions",
  "member_profiles",
  "member_cards",
  "organization_histories",
  "learning_modules",
  "learning_lessons",
  "learning_progress",
  "agendas",
  "agenda_registrations",
  "certificates",
  "achievements",
  "badges",
  "portfolios",
] as const;

export type MemberDataModelEntity = (typeof memberDataModelBlueprint)[number];

export const memberWorkspaceNotes: Record<MemberDataModelEntity, string> = {
  users: "Akun login dan identitas dasar.",
  roles: "Role utama: Super Admin, Admin Website, Pengurus Cabang, Kader/Anggota.",
  permissions: "Hak akses admin dashboard dan modul organisasi.",
  member_profiles: "Profil kader personal, terpisah dari profil organisasi.",
  member_cards: "Kartu anggota digital, QR verification, dan status kartu.",
  organization_histories: "Timeline jabatan, kegiatan, dan proses organisasi kader.",
  learning_modules: "Learning path MAPABA, PKD, PKL, PKN.",
  learning_lessons: "Video, PDF, artikel, slide, quiz, dan tugas.",
  learning_progress: "Progress belajar per kader dan status locked/done.",
  agendas: "Agenda yang dibuat admin dan ditampilkan ke kader.",
  agenda_registrations: "Status peserta agenda: terdaftar, verifikasi, hadir, selesai.",
  certificates: "Sertifikat agenda, learning, kaderisasi, dan upload mandiri.",
  achievements: "Prestasi, milestone, level kader, dan kontribusi.",
  badges: "Badge kader aktif, MAPABA, PKD, fasilitator, narasumber, pengurus.",
  portfolios: "Karya, proposal, jurnal, dokumentasi, link, pengalaman organisasi.",
};

