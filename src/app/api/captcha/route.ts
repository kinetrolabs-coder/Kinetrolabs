import { NextResponse } from "next/server";
import { createMathCaptcha } from "@/lib/security";

export async function GET() {
  return NextResponse.json(createMathCaptcha(), { headers: { "Cache-Control": "no-store" } });
}
