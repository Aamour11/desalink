import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: "No file found." });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate a unique filename
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  
  // Define the path to save the file
  const uploadDir = join(process.cwd(), "public", "uploads");
  const path = join(uploadDir, filename);

  try {
    // Ensure the upload directory exists
    await mkdir(uploadDir, { recursive: true });
    // Write the file to the public/uploads directory
    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);

    // Return the public URL of the file
    const imageUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Error saving file:", error);
    return NextResponse.json({ success: false, error: "Failed to save file." }, { status: 500 });
  }
}
