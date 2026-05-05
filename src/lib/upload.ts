import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

export async function uploadFile(file: File, folder: string = "general"): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isImage = file.type.startsWith("image/");
    const originalExtension = path.extname(file.name || "").toLowerCase();
    const extension = isImage ? ".webp" : originalExtension || ".bin";
    const filename = `${uuidv4()}${extension}`;

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    // proper path for saving
    const filepath = path.join(uploadDir, filename);

    if (isImage) {
        await sharp(buffer)
            .webp({ quality: 80 })
            .toFile(filepath);
    } else {
        await writeFile(filepath, buffer);
    }

    // Return public URL
    return `/uploads/${folder}/${filename}`;
}
