import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { hasAccess } from "@/lib/permissions/defaults";
import { getRolePermissions } from "@/lib/permissions/routes";
import type { DashboardPermissionKey } from "@/lib/permissions/types";
import { uploadFile } from "@/lib/upload";

function getUploadPermission(folder: string): DashboardPermissionKey | null {
  if (folder.startsWith("posts")) return "berita";
  if (folder.startsWith("kegiatan")) return "agenda";
  if (folder.startsWith("materials")) return "elearning";
  if (folder.startsWith("landing")) return "cmsHomepage";
  if (folder.startsWith("officers")) return "cmsPengurus";
  return null;
}

function canUploadToFolder(
  folder: string,
  role?: string | null,
  permissions?: Record<string, unknown> | null
) {
  if (role === "SUPER_ADMIN") return true;
  if (folder.startsWith("kader")) return true;

  const requiredPermission = getUploadPermission(folder);
  if (!requiredPermission || !role) return false;

  const rolePermissions = getRolePermissions(role);
  const userPermissions =
    (permissions as Partial<typeof rolePermissions> | undefined) || rolePermissions;

  return hasAccess(
    userPermissions[requiredPermission] || rolePermissions[requiredPermission],
    "edit"
  );
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed here" }, { status: 400 });
    }

    const requestedFolder = req.nextUrl.searchParams.get("folder") || "kegiatan";

    if (
      !canUploadToFolder(
        requestedFolder,
        session.user.role,
        session.user.permissions as Record<string, unknown> | null | undefined
      )
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const relativeUrl = await uploadFile(file, requestedFolder);

    return NextResponse.json({ url: relativeUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
