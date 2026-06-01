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

export default function DashboardFloatingActionMenu() {
  const router = useRouter();

  return (
    <FloatingActionMenu
      options={[
        {
          label: "Edit Homepage",
          Icon: <Wand2 className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/landing"),
        },
        {
          label: "Edit Profil",
          Icon: <Wand2 className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/profil"),
        },
        {
          label: "Tambah Berita",
          Icon: <Newspaper className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/berita/create"),
        },
        {
          label: "Tambah Agenda",
          Icon: <CalendarPlus className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/kegiatan/create"),
        },
        {
          label: "Upload Galeri",
          Icon: <ImagePlus className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/galeri"),
        },
        {
          label: "Tambah Materi E-Learning",
          Icon: <BookOpen className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/materi/create"),
        },
        {
          label: "Tambah Pengurus",
          Icon: <UserPlus className="h-4 w-4" />,
          onClick: () => router.push("/dashboard/pengurus"),
        },
      ]}
    />
  );
}
