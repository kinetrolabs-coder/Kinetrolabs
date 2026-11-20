import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { deleteLocalRegistration, updateLocalRegistration } from "@/lib/local-store";
import { z } from "zod";

const changesSchema = z.object({ status: z.enum(["New", "Reviewed", "Contacted", "Approved", "Rejected"]).optional(), adminNotes: z.string().max(5000).optional() });
async function authorized() { return verifyAdminToken((await cookies()).get("sk_admin_session")?.value); }
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) { if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const parsed = changesSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Invalid update" }, { status: 400 }); const result = await updateLocalRegistration((await context.params).id, parsed.data); return result ? NextResponse.json({ registration: result }) : NextResponse.json({ error: "Registration not found" }, { status: 404 }); }
export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) { if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const deleted = await deleteLocalRegistration((await context.params).id); return deleted ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Registration not found" }, { status: 404 }); }
