import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024;

const allowedImageMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/heic",
    "image/heif",
]);

const allowedDocumentMimeTypes = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

const allowedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif"]);
const allowedDocumentExtensions = new Set([".pdf", ".doc", ".docx", ".ppt", ".pptx"]);

function sanitizeFolder(folder: string) {
    const cleaned = folder
        .split("/")
        .map((part) => part.replace(/[^a-zA-Z0-9-_]/g, ""))
        .filter(Boolean)
        .join("/");

    if (!cleaned || cleaned.includes("..")) {
        throw new Error("Folder upload tidak valid.");
    }

    return cleaned;
}

function validateFile(file: File) {
    const originalExtension = path.extname(file.name || "").toLowerCase();
    const isImage = allowedImageMimeTypes.has(file.type) && allowedImageExtensions.has(originalExtension);
    const isDocument = allowedDocumentMimeTypes.has(file.type) && allowedDocumentExtensions.has(originalExtension);

    if (!isImage && !isDocument) {
        throw new Error("Tipe file tidak diizinkan. Gunakan gambar, PDF, DOC/DOCX, atau PPT/PPTX.");
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_DOCUMENT_SIZE;
    if (file.size > maxSize) {
        throw new Error(`Ukuran file terlalu besar. Maksimal ${isImage ? "5MB" : "20MB"}.`);
    }

    return { isImage, originalExtension };
}

export async function uploadFile(file: File, folder: string = "general"): Promise<string> {
    const safeFolder = sanitizeFolder(folder);
    const { isImage, originalExtension } = validateFile(file);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const extension = isImage ? ".webp" : originalExtension || ".bin";
    const filename = `${uuidv4()}${extension}`;

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);
    await mkdir(uploadDir, { recursive: true });

    // proper path for saving
    const filepath = path.join(uploadDir, filename);

    if (isImage) {
        try {
            // Dynamic import to avoid issues with sharp in some environments if not needed
            const sharp = (await import("sharp")).default;
            await sharp(buffer)
                .webp({ quality: 80 })
                .toFile(filepath);
        } catch (error) {
            console.error("Sharp optimization failed:", error);
            throw new Error("Gagal mengoptimasi gambar. Coba gunakan JPG, PNG, atau WebP.");
        }
    } else {
        // For non-images (PDF, etc.), just write the file
        await writeFile(filepath, buffer);
    }

    // Return public URL
    return `/uploads/${safeFolder}/${filename}`;
}
