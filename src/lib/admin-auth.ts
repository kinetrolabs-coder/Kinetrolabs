import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const sessionDurationMs = 8 * 60 * 60 * 1000;

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be configured with at least 32 characters.");
  }
  return secret;
}

export function checkAdminPassword(value: string) {
  const expectedPassword = process.env.ADMIN_INITIAL_PASSWORD;
  if (!expectedPassword || !value || value.length > 1024) return false;
  const actual = createHash("sha256").update(value).digest();
  const expected = createHash("sha256").update(expectedPassword).digest();
  return timingSafeEqual(actual, expected);
}

export function createAdminToken() {
  const payload = `${Date.now() + sessionDurationMs}`;
  const signature = createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function verifyAdminToken(token: string | undefined) {
  if (!token || token.length > 160) return false;
  const [payload, signature, extra] = token.split(".");
  const expires = Number(payload);
  if (extra || !payload || !signature || !Number.isFinite(expires) || expires <= Date.now() || expires > Date.now() + sessionDurationMs) return false;

  const expected = createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
