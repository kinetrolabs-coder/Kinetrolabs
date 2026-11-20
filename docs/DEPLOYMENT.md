# Deployment and sharing

## Local network preview

```bash
npm run dev:network
```

Share `http://YOUR_COMPUTER_IPV4:3000` with people on the same network. Windows Firewall may need to allow Node.js on private networks.

## Temporary public preview

```bash
npm run dev
npm run share
```

The printed HTTPS URL can be shared with others while the terminal remains running. Do not use this as production hosting and do not expose real secrets in a preview environment.

## Production

Deploy the repository to Vercel, Azure App Service, or another Node.js host. Set `NEXT_PUBLIC_SITE_URL` to the deployed HTTPS domain, configure Supabase redirect URLs for `/admin-api/reset-password`, run the SQL migration, and add all server-only credentials from `.env.example` in the host's secret manager.
