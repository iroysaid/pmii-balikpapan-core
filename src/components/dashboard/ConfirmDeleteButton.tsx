"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type ConfirmDeleteButtonProps = {
    className?: string;
    children: ReactNode;
    message?: string;
    title?: string;
};

export default function ConfirmDeleteButton({
    className,
    children,
    message = "Yakin ingin menghapus data ini?",
    title,
}: ConfirmDeleteButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            title={title}
            disabled={pending}
            onClick={(event) => {
                if (!window.confirm(message)) {
                    event.preventDefault();
                }
            }}
            className={className}
        >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
        </button>
    );
}
