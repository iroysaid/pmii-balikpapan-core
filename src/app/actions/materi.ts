"use server";

import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getYouTubeID } from "@/lib/youtube";

async function checkSuperAdmin() {
    const session = await getServerSession(authOptions);
    // Allow SUPER_ADMIN and PENGURUS (if we want Pengurus to manage learning, but UI hides it. 
    // Safest is SUPER_ADMIN only for now as per dashboard logic).
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized: Only Super Admin can perform this action.");
    }
}

export async function createMaterial(formData: FormData) {
    try {
        await checkSuperAdmin();

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const visibilityValue = formData.get("visibility") as string;
        const visibility = visibilityValue === "PRIVATE" ? "PRIVATE" : "PUBLIC";
        const isPublished = formData.get("isPublished") === "true";
        const pathKey = (formData.get("pathKey") as string) || "MAPABA";
        const requiredPath = (formData.get("requiredPath") as string) || null;
        const passingGrade = Number(formData.get("passingGrade") || 70);
        const requiresAssignment = formData.get("requiresAssignment") === "on";
        const assignmentPrompt = (formData.get("assignmentPrompt") as string) || null;

        console.log("[MATERI DEBUG] Creating material:", title);

        const chapters = [];
        let i = 0;
        while (formData.has(`chapters[${i}][title]`)) {
            const chapterTitle = formData.get(`chapters[${i}][title]`) as string;
            const chapterDesc = formData.get(`chapters[${i}][description]`) as string;
            const type = formData.get(`chapters[${i}][type]`) as string;
            const article = formData.get(`chapters[${i}][article]`) as string;
            const slideUrl = formData.get(`chapters[${i}][slideUrl]`) as string;
            const durationMin = Number(formData.get(`chapters[${i}][durationMin]`) || 0);

            let fileUrl = null;
            let youtubeUrl = null;

            if (type === "DOCUMENT") {
                const file = formData.get(`chapters[${i}][file]`) as File;
                if (file && file.size > 0) {
                    console.log(`[MATERI DEBUG] Uploading file for chapter ${i}:`, file.name);
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
                article: article || null,
                slideUrl: slideUrl || null,
                durationMin: durationMin > 0 ? durationMin : null,
                sortOrder: i
            });
            i++;
        }
        
        // Handle Featured Image Upload
        let featuredImage = null;
        const featuredImageFile = formData.get("featuredImage") as File;
        if (featuredImageFile && featuredImageFile.size > 0) {
            console.log("[MATERI DEBUG] Uploading manual featured image");
            featuredImage = await uploadFile(featuredImageFile, "materials/thumbnails");
        } 
        
        // Fallback to YouTube Thumbnail if no manual upload
        if (!featuredImage && chapters.length > 0) {
            if (chapters[0].type === "YOUTUBE" && chapters[0].youtubeUrl) {
                const videoId = getYouTubeID(chapters[0].youtubeUrl);
                if (videoId) {
                    featuredImage = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                }
            }
        }

        console.log("[MATERI DEBUG] Saving to database with chapters count:", chapters.length);

        const quizQuestions = parseQuizQuestions(formData);

        await prisma.material.create({
            data: {
                title,
                description,
                visibility,
                isPublished,
                pathKey,
                requiredPath,
                passingGrade: Number.isNaN(passingGrade) ? 70 : passingGrade,
                requiresAssignment,
                assignmentPrompt,
                featuredImage,
                chapters: {
                    create: chapters.map(c => ({
                        title: c.title,
                        description: c.description,
                        type: c.type,
                        fileUrl: c.fileUrl,
                        youtubeUrl: c.youtubeUrl,
                        article: c.article,
                        slideUrl: c.slideUrl,
                        durationMin: c.durationMin,
                        sortOrder: c.sortOrder
                    }))
                },
                ...(quizQuestions.length > 0 ? {
                    quiz: {
                        create: {
                            title: (formData.get("quizTitle") as string) || `Quiz ${title}`,
                            passingGrade: Number.isNaN(passingGrade) ? 70 : passingGrade,
                            isActive: true,
                            questions: {
                                create: quizQuestions,
                            },
                        },
                    },
                } : {}),
            },
        });

        console.log("[MATERI DEBUG] Success!");
        revalidatePath("/dashboard/materi");
    } catch (error: any) {
        console.error("[MATERI ERROR]", error);
        // We rethrow to let Next.js handle it, but now we have logs on the server.
        throw error;
    }
    // Redirect must be outside try/catch in some Next.js versions to work properly with Server Actions
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
    const visibilityValue = formData.get("visibility") as string;
    const visibility = visibilityValue === "PRIVATE" ? "PRIVATE" : "PUBLIC";
    const isPublished = formData.get("isPublished") === "true";
    const pathKey = (formData.get("pathKey") as string) || "MAPABA";
    const requiredPath = (formData.get("requiredPath") as string) || null;
    const passingGrade = Number(formData.get("passingGrade") || 70);
    const requiresAssignment = formData.get("requiresAssignment") === "on";
    const assignmentPrompt = (formData.get("assignmentPrompt") as string) || null;

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
        const article = formData.get(`chapters[${i}][article]`) as string;
        const slideUrl = formData.get(`chapters[${i}][slideUrl]`) as string;
        const durationMin = Number(formData.get(`chapters[${i}][durationMin]`) || 0);

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
            article: article || null,
            slideUrl: slideUrl || null,
            durationMin: durationMin > 0 ? durationMin : null,
            sortOrder: i
        });
        i++;
    }

    // Handle Featured Image Upload
    const existingFeaturedImage = formData.get("existingFeaturedImage") as string;
    let featuredImage = existingFeaturedImage || null;
    
    const featuredImageFile = formData.get("featuredImage") as File;
    if (featuredImageFile && featuredImageFile.size > 0) {
        console.log("[MATERI DEBUG] Uploading new featured image");
        featuredImage = await uploadFile(featuredImageFile, "materials/thumbnails");
    } 

    // Fallback to YouTube Thumbnail ONLY IF no manual image exists and no new one uploaded
    if (!featuredImage && chapters.length > 0) {
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
        prisma.learningQuiz.deleteMany({ where: { materialId: id } }),
        prisma.material.update({
            where: { id },
            data: {
                title,
                description,
                visibility,
                isPublished,
                pathKey,
                requiredPath,
                passingGrade: Number.isNaN(passingGrade) ? 70 : passingGrade,
                requiresAssignment,
                assignmentPrompt,
                featuredImage, // Update featured image based on new chapters
                chapters: {
                    create: chapters.map(c => ({
                        title: c.title,
                        description: c.description,
                        type: c.type,
                        fileUrl: c.fileUrl,
                        youtubeUrl: c.youtubeUrl,
                        article: c.article,
                        slideUrl: c.slideUrl,
                        durationMin: c.durationMin,
                        sortOrder: c.sortOrder
                    }))
                },
                ...(parseQuizQuestions(formData).length > 0 ? {
                    quiz: {
                        create: {
                            title: (formData.get("quizTitle") as string) || `Quiz ${title}`,
                            passingGrade: Number.isNaN(passingGrade) ? 70 : passingGrade,
                            isActive: true,
                            questions: {
                                create: parseQuizQuestions(formData),
                            },
                        },
                    },
                } : {}),
            }
        })
    ]);

    revalidatePath("/dashboard/materi");
    redirect("/dashboard/materi");
}

function parseQuizQuestions(formData: FormData) {
    const questions = [];
    let i = 0;

    while (formData.has(`quiz[${i}][question]`)) {
        const question = (formData.get(`quiz[${i}][question]`) as string)?.trim();
        const optionsRaw = (formData.get(`quiz[${i}][options]`) as string) || "";
        const correctAnswer = (formData.get(`quiz[${i}][correctAnswer]`) as string)?.trim();
        const options = optionsRaw
            .split("\n")
            .map((option) => option.trim())
            .filter(Boolean);

        if (question && options.length > 0 && correctAnswer) {
            questions.push({
                question,
                optionsJson: JSON.stringify(options),
                correctAnswer,
                sortOrder: i,
            });
        }

        i++;
    }

    return questions;
}
