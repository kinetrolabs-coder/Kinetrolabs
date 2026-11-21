import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 1024) return NextResponse.json({ error: "Invalid request." }, { status: 413 });
  const response = NextResponse.json({ ok: true });
  const secureCookie = process.env.NODE_ENV === "production" || new URL(request.url).protocol === "https:";
  response.cookies.set("sk_admin_session", "", { httpOnly: true, secure: secureCookie, sameSite: "lax", expires: new Date(0), path: "/" });
  return response;
}
