import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }] },
  async headers() {
    const isProduction = process.env.NODE_ENV === "production";
    const scriptPolicy = isProduction ? "'self' 'unsafe-inline'" : "'self' 'unsafe-inline' 'unsafe-eval'";
    const connectPolicy = isProduction ? "'self' https://*.supabase.co wss://*.supabase.co" : "'self' https://*.supabase.co wss://*.supabase.co ws://localhost:* ws://127.0.0.1:*";
    const contentSecurityPolicy = [
      "default-src 'self'",
      `script-src ${scriptPolicy}`,
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "img-src 'self' data: blob: https://*.supabase.co",
      `connect-src ${connectPolicy}`,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    const headers = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Content-Security-Policy", value: contentSecurityPolicy },
    ];
    if (isProduction) headers.push({ key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains" });
    return [{ source: "/(.*)", headers }];
  },
};

export default nextConfig;
