import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { getClientIp, rateLimit } from "@/lib/security";
import { getAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
const maxImageSize = 4 * 1024 * 1024;
const imageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif"
};

function matchesImageType(type: string, bytes: Buffer) {
  if (type === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (type === "image/webp") return bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (type === "image/avif") return bytes.toString("ascii", 4, 8) === "ftyp" && ["avif", "avis"].includes(bytes.toString("ascii", 8, 12));
  return false;
}

export async function POST(request: Request) {
  const token = (await cookies()).get("sk_admin_session")?.value;
  if (!verifyAdminToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const limit = rateLimit(`admin-image:${getClientIp(request)}`, 10, 15 * 60 * 1000);
  if (!limit.success) return NextResponse.json({ error: "Too many uploads. Try again later." }, { status: 429 });

  try {
    const form = await request.formData();
    const file = form.get("image");
    if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
    const extension = imageTypes[file.type];
    if (!extension) return NextResponse.json({ error: "Use a JPG, PNG, WebP or AVIF image." }, { status: 400 });
    if (file.size > maxImageSize) return NextResponse.json({ error: "The image must be 4 MB or smaller." }, { status: 413 });

    const bytes = Buffer.from(await file.arrayBuffer());
    if (!matchesImageType(file.type, bytes)) return NextResponse.json({ error: "The file contents do not match the selected image type." }, { status: 400 });
    const client = getAdminClient();
    let imageUrl: string;

    if (client) {
      const bucketName = "kinetro-site-assets";
      const { data: buckets, error: listError } = await client.storage.listBuckets();
      if (listError) throw new Error(`Could not check image storage: ${listError.message}`);
      if (!buckets.some((bucket) => bucket.name === bucketName)) {
        const { error: createError } = await client.storage.createBucket(bucketName, { public: true, fileSizeLimit: `${maxImageSize}`, allowedMimeTypes: Object.keys(imageTypes) });
        if (createError) throw new Error(`Could not prepare image storage: ${createError.message}`);
      }
      const storagePath = `hero/background.${extension}`;
      const { error: uploadError } = await client.storage.from(bucketName).upload(storagePath, bytes, { contentType: file.type, cacheControl: "3600", upsert: true });
      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
      imageUrl = `${client.storage.from(bucketName).getPublicUrl(storagePath).data.publicUrl}?v=${Date.now()}`;
    } else {
      if (process.env.VERCEL) return NextResponse.json({ error: "Image uploads need Supabase configured for persistent production storage." }, { status: 503 });
      const uploadsPath = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsPath, { recursive: true });
      const storagePath = `hero-background.${extension}`;
      await writeFile(path.join(uploadsPath, storagePath), bytes);
      imageUrl = `/uploads/${storagePath}?v=${Date.now()}`;
    }

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Admin hero image upload failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not upload the hero image." }, { status: 500 });
  }
}
