"use client";

import { useState } from "react";
import { Save } from "lucide-react";

import { updateProfileContent } from "@/app/actions/profile";
import SubmitButton from "@/components/dashboard/SubmitButton";
import type { ProfileContent } from "@/lib/profile/types";

type ProfileContentEditorProps = {
  initialContent: ProfileContent;
  contentFilePath: string;
};

export default function ProfileContentEditor({
  initialContent,
  contentFilePath,
}: ProfileContentEditorProps) {
  const [draft, setDraft] = useState(JSON.stringify(initialContent, null, 2));
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState("");

  const updateDraft = (value: string) => {
    setDraft(value);
    try {
      const parsed = JSON.parse(value) as ProfileContent;
      setContent(parsed);
      setError("");
    } catch (draftError) {
      setError(draftError instanceof Error ? draftError.message : "JSON tidak valid.");
    }
  };

  return (
    <form action={updateProfileContent} className="grid gap-6 xl:grid-cols-[22rem_1fr]">
      <input type="hidden" name="content" value={JSON.stringify(content)} />
      <aside className="space-y-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            CMS Profil
          </p>
          <h2 className="mt-2 text-xl font-black text-secondary">
            Konten statis profil
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Profil dipisahkan dari Homepage agar narasi organisasi, sejarah,
            struktur, dan sekretariat bisa berkembang tanpa mengganggu landing.
          </p>
        </div>
        <div className="rounded-xl bg-slate-950 p-4">
          <p className="mb-2 text-xs font-black uppercase tracking-wider text-accent">
            Preview JSON
          </p>
          <pre className="max-h-[420px] overflow-auto text-xs leading-relaxed text-slate-100">
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      </aside>

      <div className="space-y-4">
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-bold text-primary">Editor Profil</h2>
            <p className="text-xs text-gray-500">File target: {contentFilePath}</p>
          </div>
          <textarea
            value={draft}
            onChange={(event) => updateDraft(event.target.value)}
            className="min-h-[620px] w-full resize-y rounded-b-xl border-0 bg-slate-950 p-5 font-mono text-xs leading-relaxed text-slate-100 outline-none focus:ring-2 focus:ring-accent"
            spellCheck={false}
          />
        </div>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            JSON profil belum valid: {error}
          </p>
        )}
        <div className="flex justify-end">
          <SubmitButton
            disabled={Boolean(error)}
            pendingLabel="Menyimpan profil..."
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-black text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            Simpan Profil
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
