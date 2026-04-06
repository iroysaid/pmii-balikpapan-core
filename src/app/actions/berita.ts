"use server";

import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function checkSuperAdmin() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized: Only Super Admin can perform this action.");
    }
}

export async function createPost(formData: FormData) {
    await checkSuperAdmin();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    // Image handling (File upload priority, fallback to URL if needed but UI suggests upload)
    const imageFile = formData.get("image") as File;
    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadFile(imageFile, "posts");
    }

    await prisma.post.create({
        data: {
            title,
            content,
            slug: `${slug}-${Date.now()}`,
            image: imageUrl,
            published: true,
            author: "Admin",
        },
    });

    revalidatePath("/dashboard/berita");
    revalidatePath("/berita");
    redirect("/dashboard/berita");
}

export async function deletePost(id: string) {
    await checkSuperAdmin();

    await prisma.post.delete({
        where: { id },
    });
    revalidatePath("/dashboard/berita");
    revalidatePath("/berita");
}

export async function updatePost(id: string, formData: FormData) {
    await checkSuperAdmin();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    const imageFile = formData.get("image") as File;
    let imageUrl;

    if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadFile(imageFile, "posts");
    }

    await prisma.post.update({
        where: { id },
        data: {
            title,
            content,
            ...(imageUrl ? { image: imageUrl } : {}),
            author: "Admin", // Assuming still admin for now
        },
    });

    revalidatePath("/dashboard/berita");
    revalidatePath("/berita");
    redirect("/dashboard/berita");
}
