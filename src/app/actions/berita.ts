"use server";

import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireDashboardPermission } from "@/lib/permissions/guards";

async function checkBeritaPermission() {
    await requireDashboardPermission("berita", "edit");
}

// ——— Tag processing helper ———
// Accepts array of {id, name, group}. Tags prefixed "new:" are created fresh.
async function processTags(tagsJson: string): Promise<string[]> {
    if (!tagsJson) return [];

    let tags: { id: string; name: string; group: string }[] = [];
    try {
        tags = JSON.parse(tagsJson);
    } catch {
        return [];
    }

    const tagIds: string[] = [];

    for (const t of tags) {
        if (t.id.startsWith("new:")) {
            // Create the tag if it doesn't exist yet
            const tag = await prisma.tag.upsert({
                where: { name: t.name },
                update: {},
                create: { name: t.name, group: t.group },
            });
            tagIds.push(tag.id);
        } else {
            tagIds.push(t.id);
        }
    }

    return tagIds;
}

export async function createPost(formData: FormData) {
    await checkBeritaPermission();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tagsJson = formData.get("tagsJson") as string;
    const imageUrlFromState = formData.get("imageUrl") as string; // from hidden input managed by React
    const published = formData.get("published") !== "false";

    // Legacy: also support direct file upload if provided
    const imageFile = formData.get("image") as File;
    let imageUrl = imageUrlFromState || null;

    if (!imageUrl && imageFile && imageFile.size > 0) {
        imageUrl = await uploadFile(imageFile, "posts");
    }

    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const tagIds = await processTags(tagsJson);

    await prisma.post.create({
        data: {
            title,
            content,
            slug: `${slug}-${Date.now()}`,
            image: imageUrl,
            published,
            author: "Admin",
            tags: {
                create: tagIds.map((tagId) => ({ tagId })),
            },
        },
    });

    revalidatePath("/dashboard/berita");
    revalidatePath("/berita");
    redirect("/dashboard/berita");
}

export async function deletePost(id: string) {
    await checkBeritaPermission();

    await prisma.post.delete({
        where: { id },
    });
    revalidatePath("/dashboard/berita");
    revalidatePath("/berita");
}

export async function updatePost(id: string, formData: FormData) {
    await checkBeritaPermission();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tagsJson = formData.get("tagsJson") as string;
    const imageUrlFromState = formData.get("imageUrl") as string;
    const published = formData.get("published") !== "false";

    const imageFile = formData.get("image") as File;
    let imageUrl: string | undefined = imageUrlFromState || undefined;

    if (!imageUrl && imageFile && imageFile.size > 0) {
        imageUrl = await uploadFile(imageFile, "posts");
    }

    const tagIds = await processTags(tagsJson);

    await prisma.post.update({
        where: { id },
        data: {
            title,
            content,
            published,
            ...(imageUrl !== undefined ? { image: imageUrl || null } : {}),
            author: "Admin",
            // Sync tags: delete old, create new
            tags: {
                deleteMany: {},
                create: tagIds.map((tagId) => ({ tagId })),
            },
        },
    });

    revalidatePath("/dashboard/berita");
    revalidatePath("/berita");
    redirect("/dashboard/berita");
}
