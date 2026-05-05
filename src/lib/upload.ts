import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function uploadFile(file: File, folder: string = "general"): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalExtension = path.extname(file.name || "").toLowerCase();
    
    // Support common image formats for conversion
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".heif", ".bmp", ".tiff"];
    const isImage = imageExtensions.includes(originalExtension) || file.type.startsWith("image/");
    
    const extension = isImage ? ".webp" : originalExtension || ".bin";
    const filename = `${uuidv4()}${extension}`;

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
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
            console.error("Sharp optimization failed, falling back to direct write:", error);
            // If sharp fails or is not supported for this format (like HEIC without proper libs), fallback
            await writeFile(filepath, buffer);
        }
    } else {
        // For non-images (PDF, etc.), just write the file
        await writeFile(filepath, buffer);
    }

    // Return public URL
    return `/uploads/${folder}/${filename}`;
}
