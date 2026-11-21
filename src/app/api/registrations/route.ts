import { NextResponse } from "next/server";
import { getClientIp, rateLimit, verifyMathCaptcha } from "@/lib/security";
import { registrationSchema } from "@/lib/validation";
import { sendRegistrationEmails } from "@/lib/email";
import { saveLocalRegistration } from "@/lib/local-store";
export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 16 * 1024) return NextResponse.json({ error: "Registration request is too large." }, { status: 413 });
  const limit = rateLimit(`registration:${getClientIp(request)}`);
  if (!limit.success) return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });

  try {
    const body = await request.json();
    const parsed = registrationSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Please correct the form and try again.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
    if (!verifyMathCaptcha(body.captchaToken, body.captchaAnswer)) return NextResponse.json({ error: "Verification failed. Please solve the maths question again." }, { status: 400 });
    const record = await saveLocalRegistration(parsed.data);
    const emailStatus = await sendRegistrationEmails(record.registrationNumber, parsed.data);
    return NextResponse.json({ ok: true, registrationNumber: record.registrationNumber, emailStatus }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to save registration locally." }, { status: 500 });
  }
}
