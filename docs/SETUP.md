# Setup

1. Copy `.env.example` to `.env.local`. Registration data is stored locally in `data/registrations.json`; no database is used by the current registration flow.
2. Run `npm install` and `npm run dev`.
3. In Supabase SQL Editor, run `supabase/migrations/001_initial.sql`.
4. The admin login is `/admin` and accepts the password `rakshit@123`.
5. Add Brevo sender and admin recipient settings when needed. Confirmation emails remain optional and only send when Brevo is configured.

The current local admin session is protected by an HTTP-only signed cookie. Set a strong `ADMIN_SESSION_SECRET` before sharing the app publicly. Local JSON storage is not suitable for multi-instance production hosting because files may be ephemeral.

The admin entry point is `/admin` and redirects to `/admin-api/login`.
