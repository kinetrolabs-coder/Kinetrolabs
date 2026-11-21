import type { RegistrationInput } from "@/lib/validation";

type BrevoResponse = { messageId?: string };
type SendResult = { ok: boolean; configured: boolean };

function emailConfigured() {
  return Boolean(process.env.BREVO_API_KEY && process.env.BREVO_FROM_EMAIL);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]!);
}

async function sendBrevo(to: string, subject: string, htmlContent: string): Promise<SendResult> {
  if (!emailConfigured()) return { ok: false, configured: false };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: { email: process.env.BREVO_FROM_EMAIL, name: process.env.BREVO_FROM_NAME ?? "Kinetro Labs" },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    });

    if (!response.ok) {
      console.error("Brevo email delivery failed", { status: response.status, response: await response.text() });
      return { ok: false, configured: true };
    }

    await response.json() as BrevoResponse;
    return { ok: true, configured: true };
  } catch (error) {
    console.error("Brevo email request failed", error instanceof Error ? error.message : "Unknown error");
    return { ok: false, configured: true };
  }
}

export async function sendRegistrationEmails(registrationNumber: string, data: RegistrationInput) {
  const configured = emailConfigured();
  if (!configured) return { configured: false, user: false, admin: false };

  const customerEmail = sendBrevo(
    data.email,
    "Thank you for registering with Kinetro Labs",
    `<main style="font-family:Arial,sans-serif;line-height:1.6;color:#202020;max-width:600px;margin:auto">
      <h1 style="color:#5c4bd8">Thank you, ${escapeHtml(data.fullName)}!</h1>
      <p>We have received your registration with Kinetro Labs. Our team will review your details and get in touch with you.</p>
      <p><strong>Your registration ID:</strong> ${escapeHtml(registrationNumber)}</p>
      <p>Thank you for your interest in Kinetro Labs. We look forward to connecting with you.</p>
      <p>Regards,<br/>Kinetro Labs</p>
    </main>`,
  );

  const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL;
  const adminEmail = adminRecipient
    ? sendBrevo(
      adminRecipient,
      `New registration received: ${registrationNumber}`,
      `<main style="font-family:Arial,sans-serif;line-height:1.6;color:#202020;max-width:600px;margin:auto">
        <h1>New registration received</h1>
        <p><strong>Registration ID:</strong> ${escapeHtml(registrationNumber)}</p>
        <p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Mobile:</strong> ${escapeHtml(data.mobile)}</p>
        <p><strong>Country:</strong> ${escapeHtml(data.country)}</p>
        <p><strong>City:</strong> ${escapeHtml(data.city)}</p>
        <p><strong>Occupation:</strong> ${escapeHtml(data.occupation)}</p>
        <p><strong>Age:</strong> ${escapeHtml(String(data.age))}</p>
        <p><strong>Comments:</strong> ${escapeHtml(data.comments || "-")}</p>
      </main>`,
    )
    : Promise.resolve({ ok: false, configured: true });

  const [user, admin] = await Promise.all([customerEmail, adminEmail]);
  return { configured, user: user.ok, admin: admin.ok };
}
