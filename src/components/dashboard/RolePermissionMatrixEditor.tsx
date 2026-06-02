"use client";

import { useState } from "react";
import { Save } from "lucide-react";

import { updatePermissionConfig } from "@/app/actions/permissions";
import SubmitButton from "@/components/dashboard/SubmitButton";
import {
  accessLabels,
  kaderPermissionLabels,
  permissionLabels,
  roleLabels,
} from "@/lib/permissions/defaults";
import type {
  AccessLevel,
  DashboardPermissionKey,
  KaderPermissionKey,
  PermissionConfig,
  RoleKey,
} from "@/lib/permissions/types";

const roleOrder: RoleKey[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "CONTRIBUTOR"];
const permissionOrder: (DashboardPermissionKey | KaderPermissionKey)[] = [
  "dashboard",
  "dashboardKader",
  "cmsHomepage",
  "cmsProfil",
  "cmsPengurus",
  "agenda",
  "berita",
  "galeri",
  "elearning",
  "userRole",
  "sertifikat",
  "portofolio",
  "riwayatOrganisasi",
  "settings",
];
const accessOrder: AccessLevel[] = ["none", "view", "edit", "full"];

function getPermissionLabel(permission: DashboardPermissionKey | KaderPermissionKey) {
  return (
    permissionLabels[permission as DashboardPermissionKey] ||
    kaderPermissionLabels[permission as KaderPermissionKey]
  );
}

export default function RolePermissionMatrixEditor({
  initialConfig,
}: {
  initialConfig: PermissionConfig;
}) {
  const [config, setConfig] = useState(initialConfig);

  const updateAccess = (
    role: RoleKey,
    permission: DashboardPermissionKey | KaderPermissionKey,
    access: AccessLevel
  ) => {
    if (role === "SUPER_ADMIN" || permission === "settings") return;

    setConfig((current) => ({
      ...current,
      roles: {
        ...current.roles,
        [role]: {
          ...current.roles[role],
          [permission]: access,
        },
      },
    }));
  };

  return (
    <form action={updatePermissionConfig} className="space-y-6">
      <input type="hidden" name="config" value={JSON.stringify(config)} />

      <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black text-primary">Role Matrix</h2>
            <p className="mt-1 text-sm text-secondary">
              Atur akses menu dan route dashboard. Perubahan permission aktif
              saat user login ulang atau token session diperbarui.
            </p>
          </div>
          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-primary">
            Session aktif {Math.round(config.sessionMaxAgeSeconds / 3600)} jam
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 rounded-l-2xl bg-primary px-4 py-3 text-left font-black text-white">
                  Role
                </th>
                {permissionOrder.map((permission, index) => (
                  <th
                    key={permission}
                    className={`bg-primary px-3 py-3 text-left font-black text-white ${
                      index === permissionOrder.length - 1 ? "rounded-r-2xl" : ""
                    }`}
                  >
                    {getPermissionLabel(permission)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roleOrder.map((role) => (
                <tr key={role}>
                  <td className="sticky left-0 z-10 border-b border-gray-100 bg-white px-4 py-4 font-black text-primary">
                    {roleLabels[role]}
                  </td>
                  {permissionOrder.map((permission) => (
                    <td key={permission} className="border-b border-gray-100 px-3 py-3">
                      <select
                        value={config.roles[role][permission]}
                        disabled={role === "SUPER_ADMIN" || permission === "settings"}
                        onChange={(event) =>
                          updateAccess(
                            role,
                            permission,
                            event.target.value as AccessLevel
                          )
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-secondary outline-none transition focus:border-primary disabled:bg-blue-50 disabled:text-primary"
                      >
                        {accessOrder.map((access) => (
                          <option key={access} value={access}>
                            {accessLabels[access]}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
        <h3 className="text-lg font-black text-primary">Session Policy</h3>
        <p className="mt-1 text-sm text-blue-900">
          Session login dibatasi maksimal 3 jam. Setelah token habis, user harus
          login ulang untuk masuk dashboard.
        </p>
        <label className="mt-4 block max-w-sm space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Max Age Session (detik)
          </span>
          <input
            type="number"
            min={900}
            max={10800}
            value={config.sessionMaxAgeSeconds}
            readOnly
            className="w-full rounded-xl border border-blue-100 bg-white/70 px-4 py-3 font-bold text-primary outline-none"
          />
        </label>
      </div>

      <div className="flex justify-end">
        <SubmitButton
          pendingLabel="Menyimpan permission..."
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-black text-white transition hover:bg-primary/90"
        >
          <Save className="mr-2 h-4 w-4" />
          Simpan Role & Permission
        </SubmitButton>
      </div>
    </form>
  );
}
