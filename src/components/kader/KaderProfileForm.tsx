"use client";

import { useState } from "react";
import { updateMemberProfile } from "@/app/actions/member";

type KaderProfileFormProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    kaderProfile?: {
      phone?: string | null;
      birthPlace?: string | null;
      birthDate?: Date | string | null;
      address?: string | null;
      campus?: string | null;
      faculty?: string | null;
      major?: string | null;
      komisariat?: string | null;
      rayon?: string | null;
      mapabaYear?: string | null;
      otherTraining?: string | null;
    } | null;
  };
};

function getBio(otherTraining?: string | null) {
  if (!otherTraining) return "";
  try {
    const parsed = JSON.parse(otherTraining);
    const bio = Array.isArray(parsed)
      ? parsed.find((item) => item?.type === "bio")
      : null;
    return bio?.value || "";
  } catch {
    return "";
  }
}

export default function KaderProfileForm({ user }: KaderProfileFormProps) {
  const [message, setMessage] = useState("");
  const profile = user.kaderProfile;
  const birthDate = profile?.birthDate
    ? new Date(profile.birthDate).toISOString().slice(0, 10)
    : "";

  return (
    <form
      action={async (formData) => {
        setMessage("");
        const result = await updateMemberProfile(formData);
        setMessage(result.success ? "Profil berhasil diperbarui." : result.error || "Gagal memperbarui profil.");
      }}
      className="space-y-5 rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-[0_24px_80px_rgba(18,37,98,0.10)] backdrop-blur-xl md:p-8"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-bold text-secondary">
          Nama lengkap
          <input name="name" defaultValue={user.name || ""} className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
        </label>
        <label className="space-y-2 text-sm font-bold text-secondary">
          Email
          <input name="email" type="email" defaultValue={user.email || ""} className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
        </label>
        <label className="space-y-2 text-sm font-bold text-secondary">
          No HP
          <input name="phone" defaultValue={profile?.phone || ""} className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
        </label>
        <label className="space-y-2 text-sm font-bold text-secondary">
          Foto profil
          <input name="image" type="file" accept="image/*" className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm" />
        </label>
        <label className="space-y-2 text-sm font-bold text-secondary">
          Tempat lahir
          <input name="birthPlace" defaultValue={profile?.birthPlace || ""} className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
        </label>
        <label className="space-y-2 text-sm font-bold text-secondary">
          Tanggal lahir
          <input name="birthDate" type="date" defaultValue={birthDate} className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
        </label>
        <label className="space-y-2 text-sm font-bold text-secondary">
          Kampus
          <input name="campus" defaultValue={profile?.campus || ""} className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
        </label>
        <label className="space-y-2 text-sm font-bold text-secondary">
          Fakultas/Jurusan
          <input name="faculty" defaultValue={profile?.faculty || ""} className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
        </label>
        <label className="space-y-2 text-sm font-bold text-secondary">
          Program studi
          <input name="major" defaultValue={profile?.major || ""} className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
        </label>
        <label className="space-y-2 text-sm font-bold text-secondary">
          Komisariat
          <input name="komisariat" defaultValue={profile?.komisariat || ""} className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
        </label>
        <label className="space-y-2 text-sm font-bold text-secondary">
          Rayon
          <input name="rayon" defaultValue={profile?.rayon || ""} className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
        </label>
        <label className="space-y-2 text-sm font-bold text-secondary">
          Tahun masuk PMII/MAPABA
          <input name="mapabaYear" defaultValue={profile?.mapabaYear || ""} className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
        </label>
      </div>
      <label className="block space-y-2 text-sm font-bold text-secondary">
        Domisili
        <textarea name="address" defaultValue={profile?.address || ""} rows={3} className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
      </label>
      <label className="block space-y-2 text-sm font-bold text-secondary">
        Bio singkat
        <textarea name="bio" defaultValue={getBio(profile?.otherTraining)} rows={4} className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
      </label>
      {message && <p className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-primary">{message}</p>}
      <button type="submit" className="w-full rounded-2xl bg-primary px-5 py-4 font-black text-white transition hover:bg-secondary md:w-auto">
        Simpan Profil
      </button>
    </form>
  );
}

