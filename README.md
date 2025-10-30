# Remind+

Colorful reminders and team sharing built with Next.js, Supabase, Prisma, Tailwind, and shadcn/ui.

## Supabase Setup

1. Create a project named `remind-plus` at https://supabase.com
2. From Settings → API, copy:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. From Database → Connection string, copy the Postgres `DATABASE_URL`.
4. Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXTAUTH_SECRET=REPLACE_ME
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=your_resend_api_key
```

Note: Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.

## Local Development

```
npm run prisma:generate
npx prisma migrate dev --name init
npm run dev
```

## API Routes

- `POST /api/team` create team `{ name, color? }`
- `POST /api/team` join team `{ action: "join", code }`
- `GET /api/team` list teams for current user (admin-owned)
- `POST /api/reminders` create reminder `{ title, description?, date, time, recurring?, teamId }`
- `GET /api/reminders` list user reminders
- `PUT /api/reminders/[id]` update reminder
- `DELETE /api/reminders/[id]` delete reminder

All requests are validated by Zod. Authentication relies on Supabase sessions.

## Vercel Deployment

- Push to GitHub
- Import in Vercel
- Add environment variables from `.env.template`
- Set `NEXTAUTH_URL` to your deployment URL
 - Set `NEXT_PUBLIC_SITE_URL` to your deployment URL
 - Add `RESEND_API_KEY` for notifications (optional)

## E2E Checklist

- Sign up, sign in via Supabase
- Create a team, copy the team code
- Join team using team code
- Create reminders in a team
- Edit and delete reminders
- Verify protected routes (`/dashboard/*`, `/admin/*`) redirect when unauthenticated
- Deploy to Vercel with env vars configured

## TODOS.md

- Choose notification/email provider (Resend recommended)
- Add PWA + push notifications
- Enable backups
"# remind-plus" 
