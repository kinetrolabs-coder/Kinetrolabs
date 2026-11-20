import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
export async function GET() { const token = (await cookies()).get("sk_admin_session")?.value; return NextResponse.json({ authenticated: verifyAdminToken(token) }); }
