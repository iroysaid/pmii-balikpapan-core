"use client";

import { useState } from "react";
import { Plus, Tag } from "lucide-react";

export interface TagItem {
    id: string;
    name: string;
    group: string;
}

interface TagSelectorProps {
    allTags: TagItem[];
    selectedTagIds?: string[];
    name?: string;
}

const GROUP_CONFIG: { key: string; label: string; color: string }[] = [
    { key: "Wilayah", label: "🗺️ Wilayah", color: "blue" },
    { key: "Isu", label: "🔥 Isu", color: "red" },
    { key: "Kaderisasi", label: "🎓 Kaderisasi", color: "green" },
    { key: "Umum", label: "📌 Umum", color: "gray" },
];

const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    red: "bg-red-100 text-red-700 border-red-200",
    green: "bg-green-100 text-green-700 border-green-200",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function TagSelector({
    allTags,
    selectedTagIds = [],
    name = "tagsJson",
}: TagSelectorProps) {
    // Merge DB tags + any newly created ones
    const [tags, setTags] = useState<TagItem[]>(allTags);
    const [checked, setChecked] = useState<Set<string>>(new Set(selectedTagIds));
    const [newInputs, setNewInputs] = useState<Record<string, string>>({});

    const toggleTag = (id: string) => {
        setChecked((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const addNewTag = (group: string) => {
        const name = (newInputs[group] || "").trim();
        if (!name) return;

        // Check for duplicate
        const existing = tags.find((t) => t.name.toLowerCase() === name.toLowerCase());
        if (existing) {
            // Just check it
            setChecked((prev) => new Set([...prev, existing.id]));
            setNewInputs((prev) => ({ ...prev, [group]: "" }));
            return;
        }

        // Create a temporary tag (ID prefixed with "new:" for backend detection)
        const tempId = `new:${group}:${name}`;
        const newTag: TagItem = { id: tempId, name, group };
        setTags((prev) => [...prev, newTag]);
        setChecked((prev) => new Set([...prev, tempId]));
        setNewInputs((prev) => ({ ...prev, [group]: "" }));
    };

    // Build payload: array of {id, name, group}
    const payload = tags.filter((t) => checked.has(t.id));

    const groups = GROUP_CONFIG.map((g) => ({
        ...g,
        tags: tags.filter((t) => t.group === g.key),
    }));

    return (
        <div className="space-y-1">
            {/* Hidden input for form submission */}
            <input type="hidden" name={name} value={JSON.stringify(payload)} />

            {groups.map((group) => (
                <div
                    key={group.key}
                    className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3"
                >
                    <h4 className="text-sm font-black text-primary flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-gray-400" />
                        {group.label}
                    </h4>

                    {/* Tag checklist */}
                    <div className="space-y-2">
                        {group.tags.length === 0 && (
                            <p className="text-xs text-gray-400 italic">Belum ada tag.</p>
                        )}
                        {group.tags.map((tag) => (
                            <label
                                key={tag.id}
                                className="flex items-center gap-2 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={checked.has(tag.id)}
                                    onChange={() => toggleTag(tag.id)}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30 accent-primary"
                                />
                                <span
                                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border
                                        ${colorMap[group.color]}
                                        ${tag.id.startsWith("new:") ? "ring-1 ring-offset-1 ring-orange-300" : ""}
                                    `}
                                >
                                    {tag.name}
                                    {tag.id.startsWith("new:") && (
                                        <span className="ml-1 text-orange-500">✦</span>
                                    )}
                                </span>
                            </label>
                        ))}
                    </div>

                    {/* Add new tag input */}
                    <div className="flex gap-2 pt-1 border-t border-dashed border-gray-100">
                        <input
                            type="text"
                            value={newInputs[group.key] || ""}
                            onChange={(e) =>
                                setNewInputs((prev) => ({
                                    ...prev,
                                    [group.key]: e.target.value,
                                }))
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addNewTag(group.key);
                                }
                            }}
                            placeholder="Tag baru..."
                            className="flex-1 text-xs px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
                        />
                        <button
                            type="button"
                            onClick={() => addNewTag(group.key)}
                            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-blue-900 transition active:scale-95"
                        >
                            <Plus className="w-3 h-3" />
                            Add
                        </button>
                    </div>
                </div>
            ))}

            {/* Summary of selected tags */}
            {checked.size > 0 && (
                <div className="bg-blue-50 rounded-2xl p-3">
                    <p className="text-xs font-bold text-blue-700 mb-2">
                        {checked.size} tag terpilih:
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {payload.map((t) => (
                            <span
                                key={t.id}
                                className="text-[10px] bg-white text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-semibold"
                            >
                                {t.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
