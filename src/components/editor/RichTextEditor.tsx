"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Link as LinkIcon,
    Unlink,
    Quote,
    Heading2,
    Heading3,
    Minus,
} from "lucide-react";

interface RichTextEditorProps {
    initialContent?: string;
    placeholder?: string;
    name?: string;
}

function ToolbarButton({
    onClick,
    active,
    disabled,
    title,
    children,
}: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title?: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={`p-2 rounded-lg transition-all text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed
                ${active
                    ? "bg-primary text-white shadow-inner"
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`}
        >
            {children}
        </button>
    );
}

export default function RichTextEditor({
    initialContent = "",
    placeholder = "Tulis isi berita di sini...",
    name = "content",
}: RichTextEditorProps) {
    const [htmlContent, setHtmlContent] = useState(initialContent);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-600 underline hover:text-blue-800",
                },
            }),
            Placeholder.configure({ placeholder }),
        ],
        content: initialContent,
        onUpdate({ editor }) {
            setHtmlContent(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class:
                    "prose max-w-none min-h-[320px] px-5 py-4 focus:outline-none text-sm leading-relaxed text-gray-800",
            },
        },
    });

    useEffect(() => {
        if (editor && initialContent && editor.isEmpty) {
            editor.commands.setContent(initialContent);
        }
    }, [editor, initialContent]);

    const setLink = () => {
        const previousUrl = editor?.getAttributes("link").href;
        const url = window.prompt("URL Hyperlink:", previousUrl);
        if (url === null) return;
        if (url === "") {
            editor?.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    if (!editor) return null;

    return (
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all">
            {/* Hidden input to carry HTML content on form submit */}
            <input type="hidden" name={name} value={htmlContent} />

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-200">
                {/* Heading */}
                <ToolbarButton
                    title="Heading 2"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive("heading", { level: 2 })}
                >
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Heading 3"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive("heading", { level: 3 })}
                >
                    <Heading3 className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                {/* Text formatting */}
                <ToolbarButton
                    title="Bold"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive("bold")}
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Italic"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive("italic")}
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Underline"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    active={editor.isActive("underline")}
                >
                    <UnderlineIcon className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                {/* Lists */}
                <ToolbarButton
                    title="Bullet List"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive("bulletList")}
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Ordered List"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive("orderedList")}
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                {/* Blockquote & Divider */}
                <ToolbarButton
                    title="Blockquote"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive("blockquote")}
                >
                    <Quote className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Horizontal Rule"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                    <Minus className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                {/* Link */}
                <ToolbarButton
                    title="Tambah Link"
                    onClick={setLink}
                    active={editor.isActive("link")}
                >
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Hapus Link"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    disabled={!editor.isActive("link")}
                >
                    <Unlink className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor Area */}
            <EditorContent editor={editor} />
        </div>
    );
}
