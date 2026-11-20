import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { getPublicContent, saveSiteContent } from "@/lib/content";
import { z } from "zod";

const contentSchema = z.object({ content: z.object({ heroHeadline: z.string().min(1).max(180), heroDescription: z.string().max(1000), heroBackgroundImage: z.string().max(2000).default(""), about: z.string().max(2000), registrationHeading: z.string().max(180), registrationDescription: z.string().max(1000), contactEmail: z.string().max(200), whatsapp: z.string().max(80), address: z.string().max(300), linkedin: z.string().max(300), instagram: z.string().max(300), footerText: z.string().max(300), seoTitle: z.string().max(180), seoDescription: z.string().max(300), privacyPolicy: z.string().max(10000), terms: z.string().max(10000) }), services: z.array(z.object({ id: z.string().min(1), title: z.string().min(1).max(120), description: z.string().max(1000), icon: z.string().max(40), is_active: z.boolean(), sort_order: z.number().int() })).max(30) });
async function authorized() { return verifyAdminToken((await cookies()).get("sk_admin_session")?.value); }
export async function GET() { if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); return NextResponse.json(await getPublicContent()); }
export async function PUT(request: Request) { if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const parsed = contentSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Please check the content fields." }, { status: 400 }); try { return NextResponse.json(await saveSiteContent(parsed.data)); } catch (error) { console.error("Admin content publish failed:", error); return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save website content." }, { status: 500 }); } }
