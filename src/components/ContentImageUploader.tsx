"use client";

import { useState } from "react";

export default function ContentImageUploader() {
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload?folder=posts/content", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            setUrl(data.url);
        } catch (err) {
            console.error(err);
            alert("Gagal upload gambar");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
            <p className="text-sm font-bold text-primary mb-2">Sisipkan Gambar di Artikel</p>
            <div className="flex items-center space-x-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="text-xs text-secondary"
                />
                {loading && <span className="text-xs text-gray-500">Uploading...</span>}
            </div>
            {url && (
                <div className="mt-3 bg-white p-2 rounded border border-gray-200 flex items-center justify-between">
                    <code className="text-xs text-blue-600 break-all">{url}</code>
                    <button
                        type="button"
                        onClick={() => {
                            navigator.clipboard.writeText(url);
                            alert("URL disalin! Paste di kolom konten."); // Simple feedback
                        }}
                        className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                    >
                        Copy
                    </button>
                </div>
            )}
        </div>
    );
}
