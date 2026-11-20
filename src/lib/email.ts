import type { RegistrationInput } from "@/lib/validation";

type BrevoResponse = { messageId?: string };
function emailConfigured() { return Boolean(process.env.BREVO_API_KEY && process.env.BREVO_FROM_EMAIL); }
function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]!);
}
async function sendBrevo(to: string, subject: string, htmlContent: string) {
  if (!emailConfigured()) return { ok: false, configured: false };
  const response = await fetch("https://api.brevo.com/v3/smtp/email", { method: "POST", headers: { accept: "application/json", "content-type": "application/json", "api-key": process.env.BREVO_API_KEY! }, body: JSON.stringify({ sender: { email: process.env.BREVO_FROM_EMAIL, name: process.env.BREVO_FROM_NAME ?? "Kinetro Labs" }, to: [{ email: to }], subject, htmlContent }) });
  if (!response.ok) { console.error("Brevo email delivery failed", { status: response.status, response: await response.text(), recipient: to }); return { ok: false, configured: true, result: null }; }
  return { ok: true, configured: true, result: await response.json() as BrevoResponse };
}

export async function sendRegistrationEmails(registrationNumber: string, data: RegistrationInput) {
  if (!emailConfigured()) return { configured: false, user: false, admin: false };
  const details = `<p><b>Name:</b> ${escapeHtml(data.fullName)}</p><p><b>Registration ID:</b> ${escapeHtml(registrationNumber)}</p><p><b>Country:</b> ${escapeHtml(data.country)}</p><p><b>City:</b> ${escapeHtml(data.city)}</p><p><b>Occupation:</b> ${escapeHtml(data.occupation)}</p><p><b>Mobile:</b> ${escapeHtml(data.mobile)}</p><p><b>Email:</b> ${escapeHtml(data.email)}</p><p><b>Age:</b> ${escapeHtml(String(data.age))}</p><p><b>Comments:</b> ${escapeHtml(data.comments ?? "-")}</p>`;
  const user = await sendBrevo(data.email, "Your Registration Has Been Received | Kinetro Labs", `<h1>Kinetro Labs</h1><p>Code the Future.</p><p>Thank you for registering with Kinetro Labs. Your registration has been successfully received.</p>${details}`);
  const admin = process.env.ADMIN_NOTIFICATION_EMAIL ? await sendBrevo(process.env.ADMIN_NOTIFICATION_EMAIL, "New Registration Received — Kinetro Labs", `<h1>New registration received</h1>${details}`) : { ok: false, configured: true };
  return { configured: true, user: user.ok, admin: admin.ok };
}
