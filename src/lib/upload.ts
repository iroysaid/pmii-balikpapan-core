import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

export async function uploadFile(file: File, folder: string = "general"): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename with .webp extension for images
    const filename = `${uuidv4()}.webp`;

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    // proper path for saving
    const filepath = path.join(uploadDir, filename);

    // Convert to WebP using Sharp
    await sharp(buffer)
        .webp({ quality: 80 })
        .toFile(filepath);

    // Return public URL
    return `/uploads/${folder}/${filename}`;
}
