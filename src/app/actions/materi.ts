"use server";

import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkSuperAdmin() {
    const session = await getServerSession(authOptions);
    // Allow SUPER_ADMIN and PENGURUS (if we want Pengurus to manage learning, but UI hides it. 
    // Safest is SUPER_ADMIN only for now as per dashboard logic).
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized: Only Super Admin can perform this action.");
    }
}

export async function createMaterial(formData: FormData) {
    await checkSuperAdmin();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const isPublished = formData.get("isPublished") === "true";

    // Parse chapters from FormData
    // Expecting keys: chapters[0][title], chapters[0][type], chapters[0][file], etc.
    const chapters = [];
    let i = 0;
    while (formData.has(`chapters[${i}][title]`)) {
        const chapterTitle = formData.get(`chapters[${i}][title]`) as string;
        const chapterDesc = formData.get(`chapters[${i}][description]`) as string;
        const type = formData.get(`chapters[${i}][type]`) as string;

        let fileUrl = null;
        let youtubeUrl = null;

        if (type === "DOCUMENT") {
            const file = formData.get(`chapters[${i}][file]`) as File;
            if (file && file.size > 0) {
                fileUrl = await uploadFile(file, "materials");
            }
        } else if (type === "YOUTUBE") {
            youtubeUrl = formData.get(`chapters[${i}][youtubeUrl]`) as string;
        }

        chapters.push({
            title: chapterTitle,
            description: chapterDesc,
            type,
            fileUrl,
            youtubeUrl,
            sortOrder: i
        });
        i++;
    }

    // Determine Featured Image from Chapter 1 (index 0) if available
    let featuredImage = null;
    if (chapters.length > 0) {
        if (chapters[0].type === "YOUTUBE" && chapters[0].youtubeUrl) {
            const videoId = getYouTubeID(chapters[0].youtubeUrl);
            if (videoId) {
                featuredImage = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            }
        }
        // If Document, we could prompt for a cover image, but for now leave null or standard placeholder
    }

    await prisma.material.create({
        data: {
            title,
            description,
            isPublished,
            featuredImage,
            chapters: {
                create: chapters.map(c => ({
                    title: c.title,
                    description: c.description,
                    type: c.type,
                    fileUrl: c.fileUrl,
                    youtubeUrl: c.youtubeUrl,
                    sortOrder: c.sortOrder
                }))
            }
        },
    });

    revalidatePath("/dashboard/materi");
    redirect("/dashboard/materi");
}

export async function deleteMaterial(id: string) {
    await checkSuperAdmin();
    await prisma.material.delete({ where: { id } });
    revalidatePath("/dashboard/materi");
}

export async function updateMaterial(id: string, formData: FormData) {
    await checkSuperAdmin();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const isPublished = formData.get("isPublished") === "true";

    // Re-calculating chapters is complex. Simplest valid approach:
    // Delete all existing chapters and recreate them (nuclear option, but ensures order and consistency without complex diffing).
    // EXCEPT we need to preserve fileUrls if file not re-uploaded.
    // Better: We will rely on the UI sending complete state.

    // However, handling file retention in "Delete & Recreate" is hard because we lose the old URL if we don't pass it back.
    // UI must send `existingFileUrl` if no new file.

    const chapters = [];
    let i = 0;
    while (formData.has(`chapters[${i}][title]`)) {
        const chapterTitle = formData.get(`chapters[${i}][title]`) as string;
        const chapterDesc = formData.get(`chapters[${i}][description]`) as string;
        const type = formData.get(`chapters[${i}][type]`) as string;
        const existingFileUrl = formData.get(`chapters[${i}][existingFileUrl]`) as string;

        let fileUrl = existingFileUrl || null;
        let youtubeUrl = null;

        if (type === "DOCUMENT") {
            const file = formData.get(`chapters[${i}][file]`) as File;
            if (file && file.size > 0) {
                fileUrl = await uploadFile(file, "materials");
            }
        } else if (type === "YOUTUBE") {
            youtubeUrl = formData.get(`chapters[${i}][youtubeUrl]`) as string;
        }

        chapters.push({
            title: chapterTitle,
            description: chapterDesc,
            type,
            fileUrl,
            youtubeUrl,
            sortOrder: i
        });
        i++;
    }

    let featuredImage = null;
    if (chapters.length > 0) {
        if (chapters[0].type === "YOUTUBE" && chapters[0].youtubeUrl) {
            const videoId = getYouTubeID(chapters[0].youtubeUrl);
            if (videoId) {
                featuredImage = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            }
        }
    }

    // Transaction to update
    await prisma.$transaction([
        prisma.materialChapter.deleteMany({ where: { materialId: id } }),
        prisma.material.update({
            where: { id },
            data: {
                title,
                description,
                isPublished,
                featuredImage, // Update featured image based on new chapters
                chapters: {
                    create: chapters.map(c => ({
                        title: c.title,
                        description: c.description,
                        type: c.type,
                        fileUrl: c.fileUrl,
                        youtubeUrl: c.youtubeUrl,
                        sortOrder: c.sortOrder
                    }))
                }
            }
        })
    ]);

    revalidatePath("/dashboard/materi");
    redirect("/dashboard/materi");
}

function getYouTubeID(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
