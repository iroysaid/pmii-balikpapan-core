import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import RolePermissionMatrixEditor from "@/components/dashboard/RolePermissionMatrixEditor";
import { authOptions } from "@/lib/auth";
import {
  getPermissionConfig,
  getPermissionConfigFilePath,
} from "@/lib/permissions/service";

export default async function DashboardSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/masuk?callbackUrl=/dashboard/settings");
  }

  if (session.user?.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const config = await getPermissionConfig();

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/40 bg-primary/10 p-6 shadow-[0_18px_60px_rgba(38,46,237,0.12)] backdrop-blur-2xl backdrop-saturate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-primary">
              Settings
            </p>
            <h1 className="text-2xl font-black text-[#122562]">
              Role & Permission Management
            </h1>
            <p className="mt-2 max-w-2xl text-secondary">
              Settings dipakai untuk mengatur user access, role, permission,
              dan session policy. Konten website tetap dikelola dari menu CMS
              atau modul dinamis masing-masing.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/45 px-4 py-3 font-bold text-primary backdrop-blur-xl">
            <ShieldCheck className="h-5 w-5" />
            Super Admin Only
          </div>
        </div>
        <p className="mt-4 text-xs font-semibold text-secondary/70">
          File config: {getPermissionConfigFilePath()}
        </p>
      </div>

      <RolePermissionMatrixEditor initialConfig={config} />
    </div>
  );
}
