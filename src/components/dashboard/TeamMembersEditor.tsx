"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";

import { updateTeamMembers } from "@/app/actions/landing";
import SubmitButton from "@/components/dashboard/SubmitButton";
import type { TeamMember } from "@/lib/landing/types";

type TeamMembersEditorProps = {
  initialMembers: TeamMember[];
};

const emptyMember: TeamMember = {
  name: "",
  role: "",
  image: "/PMII_BPP.png",
  showOnHomepage: true,
  showOnProfile: true,
};

export default function TeamMembersEditor({
  initialMembers,
}: TeamMembersEditorProps) {
  const [members, setMembers] = useState<TeamMember[]>(
    initialMembers.map((member, index) => ({
      showOnHomepage: true,
      showOnProfile: true,
      sortOrder: index + 1,
      ...member,
    }))
  );

  const sortedMembers = useMemo(
    () =>
      members
        .map((member, index) => ({ ...member, sortOrder: index + 1 })),
    [members]
  );

  const updateMember = (index: number, member: TeamMember) => {
    setMembers((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? member : item))
    );
  };

  const moveMember = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= members.length) return;

    setMembers((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const removeMember = (index: number) => {
    setMembers((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <form action={updateTeamMembers} className="space-y-6">
      <input type="hidden" name="members" value={JSON.stringify(sortedMembers)} />

      <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-black text-primary">Data Pengurus</h2>
          <p className="mt-1 text-sm text-blue-900">
            Kelola nama, jabatan, foto, urutan, serta visibilitas pengurus di
            homepage dan halaman profil.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMembers((current) => [...current, emptyMember])}
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 font-black text-white transition hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pengurus
        </button>
      </div>

      <div className="space-y-4">
        {sortedMembers.map((member, index) => (
          <article
            key={`${member.name}-${member.role}-${index}`}
            className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:grid-cols-[7rem_1fr_auto]"
          >
            <div className="overflow-hidden rounded-2xl bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.image || "/PMII_BPP.png"}
                alt={member.name || "Foto pengurus"}
                className="h-32 w-full object-cover grayscale transition hover:grayscale-0 lg:h-full"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-primary">
                  Nama
                </span>
                <input
                  value={member.name}
                  onChange={(event) =>
                    updateMember(index, { ...member, name: event.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="Nama pengurus"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-primary">
                  Jabatan
                </span>
                <input
                  value={member.role}
                  onChange={(event) =>
                    updateMember(index, { ...member, role: event.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="Jabatan"
                />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-black uppercase tracking-wider text-primary">
                  URL Foto
                </span>
                <input
                  value={member.image}
                  onChange={(event) =>
                    updateMember(index, { ...member, image: event.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="/uploads/kegiatan/foto.webp atau https://..."
                />
              </label>
              <div className="flex flex-wrap gap-4 md:col-span-2">
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                  <input
                    type="checkbox"
                    checked={member.showOnHomepage !== false}
                    onChange={(event) =>
                      updateMember(index, {
                        ...member,
                        showOnHomepage: event.target.checked,
                      })
                    }
                  />
                  Tampil di homepage
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                  <input
                    type="checkbox"
                    checked={member.showOnProfile !== false}
                    onChange={(event) =>
                      updateMember(index, {
                        ...member,
                        showOnProfile: event.target.checked,
                      })
                    }
                  />
                  Tampil di profil
                </label>
              </div>
            </div>

            <div className="flex gap-2 lg:flex-col">
              <button
                type="button"
                onClick={() => moveMember(index, -1)}
                className="rounded-xl border border-gray-200 p-3 text-secondary transition hover:border-primary hover:text-primary disabled:opacity-30"
                disabled={index === 0}
                aria-label="Naikkan urutan"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => moveMember(index, 1)}
                className="rounded-xl border border-gray-200 p-3 text-secondary transition hover:border-primary hover:text-primary disabled:opacity-30"
                disabled={index === members.length - 1}
                aria-label="Turunkan urutan"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => removeMember(index)}
                className="rounded-xl border border-red-100 p-3 text-red-600 transition hover:bg-red-50"
                aria-label="Hapus pengurus"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="flex justify-end">
        <SubmitButton
          pendingLabel="Menyimpan pengurus..."
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-black text-white transition hover:bg-primary/90"
        >
          <Save className="mr-2 h-4 w-4" />
          Simpan Pengurus
        </SubmitButton>
      </div>
    </form>
  );
}
