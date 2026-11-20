import { NextResponse } from "next/server";
import { getPublicContent } from "@/lib/content";

export async function GET() {
  return NextResponse.json(await getPublicContent(), { headers: { "Cache-Control": "no-store" } });
}
