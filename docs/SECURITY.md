# Security notes

Registration validation runs on the server with Zod. Supabase writes use the service role only in server routes, while RLS denies public reads. Turnstile is verified server-side when configured. The fallback rate limiter is for local development only; production must configure Upstash Redis and replace the in-memory adapter with the distributed implementation before launch.
