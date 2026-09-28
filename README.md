This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Working product name

**Coursebook** is a temporary name for this NYU student course-advising MCP website.
TODO: Choose the final product name and update visible copy, page metadata, and project documentation before launch. The working name does not imply official NYU affiliation.



| Layer | Technology |
| --- | --- |
| Language | TypeScript |
| Package manager | Bun |
| Framework | Next.js |
| Authentication | Supabase Auth |
| Database | Supabase Postgres |
| Hosting | Cloudflare |

## Getting Started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How the code is organized

The website uses a single Next.js application for its frontend and backend. There is no separate API server or workspace; `bun dev` starts both.

```text
app/
├── page.tsx              # Website entry point
├── layout.tsx            # Shared page layout
└── api/
    └── health/route.ts   # GET /api/health
components/              # Frontend interface
data/                    # Static demo data
lib/
└── server/              # Shared backend logic, added as features are built
public/                  # Static files
```

Next.js maps `app/api/<name>/route.ts` to `/api/<name>`. Exported functions such as `GET` and `POST` handle those HTTP methods. Reusable database and token logic will live in `lib/server/`, protected with `import "server-only";`. Token endpoints will be added once authentication and issuance are implemented; none are exposed yet.

With the development server running, open `http://localhost:3000/api/health` to receive `{"status":"ok"}`. This only confirms the website API responds; it does not verify Supabase or the separate Python MCP service.

| File | Responsibility |
| --- | --- |
| `app/layout.tsx` | Shared HTML shell, page title, and global stylesheet import. |
| `app/page.tsx` | Verifies the current user with Supabase and renders the app. |
| `app/auth/callback/route.ts` | Exchanges an email-confirmation/OAuth code for a cookie-backed session. |
| `app/api/health/route.ts` | Basic backend health endpoint. |
| `lib/server/` | Home for future shared server-only logic. |
| `proxy.ts` | Refreshes Supabase auth cookies before pages and API routes; does not enforce sign-in. |
| `lib/supabase/client.ts` | Creates a Supabase client for browser code. |
| `lib/supabase/server.ts` | Creates a request-specific Supabase client for server code. |
| `components/coursebook-app.tsx` | Listens for auth changes, displays the signed-in account, and signs out. |
| `components/landing-page.tsx` | Landing-page content and layout. |
| `components/course-ticker.tsx` | Course cards and moving catalogue rows. |
| `data/courses.ts` | Static example courses and department colors. |
| `components/sign-in-page.tsx` | Supabase email/password forms and Google sign-in. |
| `components/profile-page.tsx` | Account header and MCP section container. |
| `components/mcp-tab.tsx` | Sample token, clipboard actions, and setup checkpoint display. |
| `app/globals.css` | Tailwind, Inter font, global styles, and ticker animations. |
| `public/design-references/` | Preserved reference images from the export; not used by the UI. |

`"use client"` marks components that need browser interactions or React state. The app controller imports the other screens, so they also run within that client boundary. `app/page.tsx` itself stays a server component.

Screen navigation currently uses React state on `/`, matching the original prototype. Refreshing restores a valid Supabase session; these screens do not yet have separate URLs. The MCP demo token state still resets on refresh.

### Authentication setup

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`, then restart `bun dev`.

In Supabase Authentication settings:

1. Enable email/password authentication. With email confirmation enabled, users must follow the confirmation email before they can sign in. The UI also supports projects where confirmation is disabled.
2. Set Site URL to the website's origin (locally `http://localhost:3000`). Add `http://localhost:3000/auth/callback` to the redirect URL allowlist; add the deployed equivalent before deployment. Keep the standard confirmation template using `{{ .ConfirmationURL }}` for this PKCE flow.
3. Enable and configure Google before using its sign-in button. Its provider-console callback is the Supabase callback URL displayed by Supabase, not this website's `/auth/callback`.
4. Open confirmation links in the browser that started signup: the code exchange needs its PKCE verifier cookie. Expired/failed links return to sign-in with an error.

The request flow is: sign-in form → browser Supabase client → Supabase Auth → session cookies → auth event opens the profile. On a later page load, `app/page.tsx` calls `getUser()` to verify the account. OAuth and email-confirmation redirects go through `/auth/callback`. Sign-out ends the session in this browser (`scope: "local"`).

Full name is saved as Supabase Auth user metadata for display, not authorization. No profile table or MCP credentials are created. Protected API operations must independently verify authentication; showing a profile in the UI is not an authorization boundary.

Check manually: wrong password displays an error; signup requests confirmation when enabled; successful sign-in opens the profile; refreshing preserves it; signing out and refreshing returns to the landing page. Google requires provider setup. Test the callback branches locally with `bun test tests/auth-callback.test.mjs` (Supabase is mocked; these tests do not create accounts or send email).

Reference: [Supabase server-side authentication](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs).

### Current demo limitations

Session maintenance is wired through the root `proxy.ts`. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` before opening the website. Static images, Next.js assets, and `/api/health` skip session maintenance. The proxy validates/refreshes sessions but does not redirect signed-out visitors or authorize protected operations.

- Sign-in is connected to Supabase; Google requires provider configuration. Live email delivery and provider credentials have not been verified by automated tests.
- The sample token cannot access the MCP. The second checkpoint stays pending; no backend verification is connected.
- Course data is static prototype content, not a live or verified catalog.
- The imported `How it works` button has no action yet, and the export does not include the future academic-context tab.
- The font currently loads from Google Fonts in the browser, as in the export.

The imported visual styling is preserved. Department backgrounds are solid colors in `data/courses.ts`. The landing-page fade is the `radial-gradient` overlay in `components/landing-page.tsx`, not the course cards.

Run `bun run lint` and `bun run build` to check the project.


## Deployment 
Goal is to either deploy on vercel or cloudflare
