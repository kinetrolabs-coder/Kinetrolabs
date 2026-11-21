import { NextResponse } from "next/server";
import { checkAdminPassword, createAdminToken } from "@/lib/admin-auth";
import { getClientIp, rateLimit } from "@/lib/security";

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 4096) return NextResponse.json({ error: "Invalid request." }, { status: 413 });
  const limit = rateLimit(`admin-login:${getClientIp(request)}`, 5, 15 * 60 * 1000);
  if (!limit.success) return NextResponse.json({ error: "Too many sign-in attempts. Try again in 15 minutes." }, { status: 429, headers: { "Retry-After": "900" } });

  const body = await request.json().catch(() => ({}));
  if (!checkAdminPassword(String(body.password ?? ""))) return NextResponse.json({ error: "Invalid password." }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  const secureCookie = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") === true;
  response.cookies.set("sk_admin_session", createAdminToken(), { httpOnly: true, secure: secureCookie, sameSite: "lax", maxAge: 60 * 60 * 8, path: "/" });
  return response;
}
