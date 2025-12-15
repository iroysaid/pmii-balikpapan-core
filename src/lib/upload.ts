import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function uploadFile(file: File, folder: string = "general"): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    // proper path for saving
    const filepath = path.join(uploadDir, filename);

    // Write file
    await writeFile(filepath, buffer);

    // Return public URL
    return `/uploads/${folder}/${filename}`;
}
