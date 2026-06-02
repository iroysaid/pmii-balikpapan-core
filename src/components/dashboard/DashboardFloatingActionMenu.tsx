"use client";

import { useRouter } from "next/navigation";
import {
  CalendarPlus,
  BookOpen,
  ImagePlus,
  Newspaper,
  UserPlus,
  Wand2,
} from "lucide-react";
import FloatingActionMenu from "@/components/ui/floating-action-menu";
import { hasAccess } from "@/lib/permissions/defaults";
import type {
  AccessLevel,
  DashboardPermissionKey,
} from "@/lib/permissions/types";

type DashboardFloatingActionMenuProps = {
  permissions?: Partial<Record<DashboardPermissionKey, AccessLevel>>;
  className?: string;
};

export default function DashboardFloatingActionMenu({
  permissions,
  className,
}: DashboardFloatingActionMenuProps) {
  const router = useRouter();
  const can = (permission: DashboardPermissionKey, minimum: AccessLevel = "edit") =>
    hasAccess(permissions?.[permission], minimum);

  return (
    <FloatingActionMenu
      className={className}
      options={[
        {
          label: "Edit Homepage",
          Icon: <Wand2 className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/landing"),
          show: can("cmsHomepage"),
        },
        {
          label: "Edit Profil",
          Icon: <Wand2 className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/profil"),
          show: can("cmsProfil"),
        },
        {
          label: "Kelola Pengurus",
          Icon: <UserPlus className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/pengurus"),
          show: can("cmsPengurus"),
        },
        {
          label: "Tambah Berita",
          Icon: <Newspaper className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/berita/create"),
          show: can("berita"),
        },
        {
          label: "Tambah Agenda",
          Icon: <CalendarPlus className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/kegiatan/create"),
          show: can("agenda"),
        },
        {
          label: "Upload Galeri",
          Icon: <ImagePlus className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/galeri"),
          show: can("galeri"),
        },
        {
          label: "Tambah Materi Learning",
          Icon: <BookOpen className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/materi/create"),
          show: can("elearning"),
        },
      ].filter((option) => option.show)}
    />
  );
}
