# The Social Katalyst

Production-oriented Next.js 16 website foundation for The Social Katalyst: a premium public site, registration flow, Supabase schema/RLS, transactional email integration points, and secure configuration documentation.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

Configure `.env.local` from `.env.example`. The public site works without credentials using editable code defaults; database, email, CAPTCHA, distributed rate limiting and the full CMS become active once their services are configured. See [docs/SETUP.md](./docs/SETUP.md).

## Share the local site

For devices on the same Wi-Fi network, run `npm run dev:network` and share the computer's IPv4 address with port `3000`, for example `http://192.168.1.20:3000`.

For a temporary public link over the internet, start the app with `npm run dev`, then run `npm run share`. LocalTunnel will print a public HTTPS URL. This is for previews only; deploy to Vercel, Azure, or another production host for a permanent link.
