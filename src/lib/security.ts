import { createHmac, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";

const attempts = new Map<string, { count: number; reset: number }>();
let lastCleanup = 0;

function captchaSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be configured with at least 32 characters.");
  }
  return secret;
}

export function rateLimit(key: string, limit = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  if (now - lastCleanup > 60_000 || attempts.size > 10_000) {
    for (const [entry, value] of attempts) if (value.reset <= now) attempts.delete(entry);
    lastCleanup = now;
  }

  const safeKey = key.slice(0, 200);
  const current = attempts.get(safeKey);
  if (!current || current.reset <= now) {
    if (attempts.size >= 10_000) return { success: false, remaining: 0 };
    attempts.set(safeKey, { count: 1, reset: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  current.count += 1;
  return { success: current.count <= limit, remaining: Math.max(0, limit - current.count) };
}

export function getClientIp(request: Request) {
  const candidates = [
    request.headers.get("x-real-ip"),
    request.headers.get("x-forwarded-for")?.split(",").at(-1),
  ];
  return candidates.map((value) => value?.trim()).find((value) => value && isIP(value)) ?? "unknown-client";
}

export function createMathCaptcha() {
  const first = Math.floor(Math.random() * 8) + 2;
  const second = Math.floor(Math.random() * 8) + 2;
  const expires = Date.now() + 10 * 60 * 1000;
  const payload = `${first}:${second}:${expires}`;
  const signature = createHmac("sha256", captchaSecret()).update(payload).digest("hex");
  return { question: `${first} + ${second} = ?`, token: `${payload}.${signature}` };
}

export function verifyMathCaptcha(token: string | undefined, answer: string | undefined) {
  if (!token || !answer || token.length > 256) return false;
  const [payload, signature, extra] = token.split(".");
  const [first, second, expires, payloadExtra] = payload?.split(":") ?? [];
  const a = Number(first);
  const b = Number(second);
  const expiry = Number(expires);
  const numericAnswer = Number(answer);
  if (extra || payloadExtra || !Number.isInteger(a) || !Number.isInteger(b) || !Number.isFinite(expiry) || expiry < Date.now() || expiry > Date.now() + 10 * 60 * 1000 || !Number.isInteger(numericAnswer)) return false;

  const expected = createHmac("sha256", captchaSecret()).update(payload!).digest("hex");
  if (!signature || signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  return a + b === numericAnswer;
}
