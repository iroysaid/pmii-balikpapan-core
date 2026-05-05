"use client";

import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    pendingLabel?: string;
};

export default function SubmitButton({
    children,
    pendingLabel = "Menyimpan...",
    className,
    disabled,
    ...props
}: SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            {...props}
            type={props.type || "submit"}
            disabled={disabled || pending}
            className={className}
        >
            {pending ? (
                <span className="inline-flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {pendingLabel}
                </span>
            ) : (
                children
            )}
        </button>
    );
}
