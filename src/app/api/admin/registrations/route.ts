import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { listLocalRegistrations } from "@/lib/local-store";

export async function GET() {
  const token = (await cookies()).get("sk_admin_session")?.value;
  if (!verifyAdminToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ registrations: await listLocalRegistrations() });
}
