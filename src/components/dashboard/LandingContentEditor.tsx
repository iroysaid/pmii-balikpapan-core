"use client";

import { useMemo, useState } from "react";
import { Code2, Save } from "lucide-react";

import { updateLandingContent } from "@/app/actions/landing";
import SubmitButton from "@/components/dashboard/SubmitButton";
import type { LandingContent } from "@/lib/landing/types";

export type EditableLandingSection = {
  key: keyof LandingContent;
  label: string;
  fields: string;
};

type LandingContentEditorProps = {
  initialContent: LandingContent;
  sections: EditableLandingSection[];
  initialSectionKey: keyof LandingContent;
  contentFilePath: string;
};

function createDrafts(content: LandingContent, sections: EditableLandingSection[]) {
  return sections.reduce<Record<string, string>>((drafts, section) => {
    drafts[section.key] = JSON.stringify(content[section.key], null, 2);
    return drafts;
  }, {});
}

export default function LandingContentEditor({
  initialContent,
  sections,
  initialSectionKey,
  contentFilePath,
}: LandingContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [activeKey, setActiveKey] = useState<keyof LandingContent>(initialSectionKey);
  const [drafts, setDrafts] = useState(() => createDrafts(initialContent, sections));
  const [sectionError, setSectionError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");

  const activeSection = useMemo(
    () => sections.find((section) => section.key === activeKey) || sections[0],
    [activeKey, sections]
  );

  const saveDisabled = Boolean(sectionError);

  const updateSectionDraft = (value: string) => {
    setDrafts((current) => ({ ...current, [activeKey]: value }));

    try {
      const parsed = JSON.parse(value);
      const nextContent = { ...content, [activeKey]: parsed };
      setContent(nextContent);
      setSectionError("");
    } catch (error) {
      setSectionError(error instanceof Error ? error.message : "Format JSON section tidak valid.");
    }
  };

  const handleImageUpload = async (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadStatus("File harus berupa gambar.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus("Ukuran gambar maksimal 5MB.");
      return;
    }

    setUploadStatus("Mengupload dan mengoptimasi gambar...");
    setUploadedUrl("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !result.url) {
        throw new Error(result.error || "Upload gagal.");
      }

      setUploadedUrl(result.url);
      setUploadStatus("Upload berhasil. Masukkan URL ini ke field image/src section aktif.");
    } catch (error) {
      setUploadStatus(error instanceof Error ? error.message : "Upload gagal.");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[22rem_1fr]">
      <aside className="space-y-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            Section aktif
          </p>
          <h2 className="mt-2 text-xl font-black text-secondary">
            {activeSection.label}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Edit field berikut: {activeSection.fields}. Untuk list seperti
            pengurus, NDP, misi, dokumentasi, dan storytelling, tambah/hapus
            atau ubah urutan item dilakukan dari array section terkait.
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="mb-2 text-xs font-black uppercase tracking-wider text-accent">
            Preview section aktif
          </p>
          <pre className="max-h-[420px] overflow-auto text-xs leading-relaxed text-slate-100">
            {JSON.stringify(content[activeKey], null, 2)}
          </pre>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            Upload gambar cepat
          </p>
          <p className="mt-2 text-sm leading-relaxed text-blue-900">
            Gunakan untuk hero, pengurus, dokumentasi, storytelling, learning,
            CTA, navbar, atau footer. File akan dikonversi ke WebP.
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => handleImageUpload(event.target.files?.[0])}
            className="mt-3 block w-full text-sm text-secondary file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
          />
          {uploadStatus && (
            <p className="mt-3 text-sm font-semibold text-blue-900">{uploadStatus}</p>
          )}
          {uploadedUrl && (
            <div className="mt-3 rounded-lg bg-white p-3">
              <p className="break-all font-mono text-xs text-secondary">
                {uploadedUrl}
              </p>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(uploadedUrl)}
                className="mt-2 rounded-full bg-accent px-3 py-1 text-xs font-black text-secondary"
              >
                Salin URL
              </button>
            </div>
          )}
        </div>
      </aside>

      <form action={updateLandingContent} className="space-y-4">
        <input type="hidden" name="content" value={JSON.stringify(content)} />

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-primary">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-primary">Editor Section CMS</h2>
                <p className="text-xs text-gray-500">File target: {contentFilePath}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 lg:grid-cols-[14rem_1fr]">
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => {
                    setActiveKey(section.key);
                    setSectionError("");
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm transition ${
                    activeKey === section.key
                      ? "bg-primary font-black text-white shadow-sm"
                      : "bg-gray-50 font-bold text-secondary hover:bg-blue-50 hover:text-primary"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-primary">
                {activeSection.label}
              </label>
              <textarea
                value={drafts[activeKey] || ""}
                onChange={(event) => updateSectionDraft(event.target.value)}
                className="min-h-[520px] w-full resize-y rounded-xl border border-slate-800 bg-slate-950 p-5 font-mono text-xs leading-relaxed text-slate-100 outline-none focus:ring-2 focus:ring-accent"
                spellCheck={false}
              />
              {sectionError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                  JSON section belum valid: {sectionError}
                </p>
              )}
              {!sectionError && (
                <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                  Section valid. Perubahan akan ikut tersimpan saat tombol save ditekan.
                </p>
              )}
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900 md:flex-row md:items-center md:justify-between">
          <p>
            Simpan hanya memperbarui konten statis Homepage. Berita, agenda,
            galeri, e-learning, navbar, header, dan footer tetap dikelola lewat
            modul atau konfigurasi layout masing-masing.
          </p>
          <SubmitButton
            disabled={saveDisabled}
            pendingLabel="Menyimpan konten..."
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 font-black text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            Simpan Landing Page
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
