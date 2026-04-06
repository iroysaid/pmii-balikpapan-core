import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp"; // Using sharp for WebP conversion

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${uuidv4()}.webp`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "kegiatan");
    
    // Ensure directory exists (redundant but safe)
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);

    // AUTO CONVERT TO WEBP using SHARP
    await sharp(buffer)
      .webp({ quality: 80 }) // 80% quality is a good balance
      .toFile(filePath);

    const relativeUrl = `/uploads/kegiatan/${fileName}`;

    return NextResponse.json({ url: relativeUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
