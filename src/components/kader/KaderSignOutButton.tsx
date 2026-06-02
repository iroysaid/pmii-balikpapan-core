"use client";

import { signOut } from "next-auth/react";
import type { ReactNode } from "react";

export default function KaderSignOutButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/masuk" })}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-black text-red-600 transition hover:bg-red-100"
    >
      {children}
    </button>
  );
}

