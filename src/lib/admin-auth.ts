import { createHmac, timingSafeEqual } from "node:crypto";
const password = process.env.ADMIN_INITIAL_PASSWORD ?? "rakshit@123";
const secret = process.env.ADMIN_SESSION_SECRET ?? "local-admin-session-secret";
export function checkAdminPassword(value: string) { return value === password; }
export function createAdminToken() { const payload = `${Date.now() + 8 * 60 * 60 * 1000}`; const signature = createHmac("sha256", secret).update(payload).digest("hex"); return `${payload}.${signature}`; }
export function verifyAdminToken(token: string | undefined) { if (!token) return false; const [payload, signature] = token.split("."); if (!payload || !signature || Number(payload) < Date.now()) return false; const expected = createHmac("sha256", secret).update(payload).digest("hex"); return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected)); }
