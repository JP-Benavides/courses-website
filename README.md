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
    ├── health/route.ts   # GET /api/health
    └── account/route.ts  # DELETE /api/account (signed-in user only)
components/              # Frontend interface
data/                    # Static demo data
lib/
└── server/              # Shared backend logic, added as features are built
public/                  # Static files
```

Next.js maps `app/api/<name>/route.ts` to `/api/<name>`. Exported functions such as `GET` and `POST` handle those HTTP methods. Shared privileged backend logic lives in `lib/server/`, protected with `import "server-only";`. Supabase OAuth Server handles authorization codes and token issuance; this website hosts the consent UI at `/oauth/consent` and does not expose its own token endpoints.

With the development server running, open `http://localhost:3000/api/health` to receive `{"status":"ok"}`. This only confirms the website API responds; it does not verify Supabase or the separate Python MCP service.

| File | Responsibility |
| --- | --- |
| `app/layout.tsx` | Shared HTML shell, page title, and global stylesheet import. |
| `app/page.tsx` | Verifies the current user with Supabase and renders the app. |
| `app/auth/callback/route.ts` | Exchanges an email-confirmation/OAuth code for a cookie-backed session. |
| `app/api/health/route.ts` | Basic backend health endpoint. |
| `app/api/account/route.ts` | Verifies the signed-in user, deletes their Auth account, and clears session cookies. |
| `lib/server/supabase-admin.ts` | Creates the server-only privileged Supabase client for account deletion. |
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
| `components/connected-apps.tsx` | Lists Supabase OAuth grants and revokes an app’s authorization. |
| `app/oauth/consent/page.tsx` | Hosts the Supabase OAuth consent flow for assistant connections. |
| `components/mcp-tab.tsx` | Copyable MCP URL, assistant setup prompt, and connected-app management. |
| `app/globals.css` | Tailwind, Inter font, global styles, and ticker animations. |
| `public/design-references/` | Preserved reference images from the export; not used by the UI. |

`"use client"` marks components that need browser interactions or React state. The app controller imports the other screens, so they also run within that client boundary. `app/page.tsx` itself stays a server component.

Screen navigation currently uses React state on `/`, matching the original prototype. Refreshing restores a valid Supabase session; these screens do not yet have separate URLs. The MCP setup shows the configured public MCP URL; it does not issue credentials.

### MCP URL setup

Set `NEXT_PUBLIC_MCP_URL` in `.env.local` to the full public HTTPS endpoint for the separate MCP service, including `/mcp`, then restart `bun dev`. Use the publicly reachable service URL for remote assistants such as ChatGPT, not the website URL or localhost. Until configured, the profile shows “MCP URL coming soon” and disables copying.

Development currently uses a temporary ngrok endpoint. Update this variable if the tunnel URL changes or the MCP moves to its permanent host.

Set the same variable on the deployment platform before building. Next.js includes `NEXT_PUBLIC_` values in the browser bundle at build time, so changing the deployed URL requires a new build. This URL is public configuration, not a credential; it does not change the MCP service’s authentication requirements or connect the assistant automatically.

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

### Account deletion

Click the profile avatar, choose **Delete account**, then confirm in the dialog. Cancel is focused first. Failed deletion leaves the account screen and session in place; successful deletion clears this browser's auth cookies and reloads the landing page.

Add `SUPABASE_SECRET_KEY` to `.env.local` using a secret key from the same Supabase project's API Keys settings, then restart `bun dev`. A legacy `SUPABASE_SERVICE_ROLE_KEY` is also supported as a fallback. `.env.example` contains placeholders only; do not overwrite existing `.env.local` values. Configure the same server-only secret on the deployment platform. Never add `NEXT_PUBLIC_` to this secret or commit it. Without it, the endpoint returns an unavailable error and does not delete anything.

The browser sends `DELETE /api/account`. The handler checks the request's Origin, verifies the cookie-backed user with `getUser()`, then calls Supabase's admin `deleteUser()` with that verified ID. A user ID supplied by the browser is never used. The privileged client has no user session or cookies. API responses are not cached, and provider error details are not exposed.

Currently this deletes the Supabase Auth account, including its user metadata. No transcript files, profile table, or MCP access tokens are stored by this website. Supabase manages OAuth grants and tokens; already-issued access tokens may remain valid until expiry. When data storage is added, extend deletion with its cleanup rules. Supabase can reject deletion when a user owns Storage objects; existing JWTs may remain valid until expiry, so future protected operations must also account for deleted users and token revocation. See [Supabase user management](https://supabase.com/docs/guides/auth/managing-user-data#deleting-users).

Run `bun test tests/` for mocked callback and account-deletion tests. These check the verified target ID, origin/auth rejection, missing configuration, failure handling, and session-cookie clearing; they never delete real accounts. For a manual check, use a disposable account: cancel first, then confirm deletion and verify that refreshing stays signed out and the account no longer appears in Supabase Authentication → Users.

### Current demo limitations

Session maintenance is wired through the root `proxy.ts`. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` before opening the website. Static images, Next.js assets, and `/api/health` skip session maintenance. The proxy validates/refreshes sessions but does not redirect signed-out visitors or authorize protected operations.

- Sign-in is connected to Supabase; Google requires provider configuration. Live email delivery and provider credentials have not been verified by automated tests.
- The MCP section displays the public URL from `NEXT_PUBLIC_MCP_URL` for manual assistant setup. It lists Supabase OAuth grants with a Disconnect action. A grant does not verify that ChatGPT can reach the MCP service; live end-to-end connection testing is still required.
- Course data is static prototype content, not a live or verified catalog.
- The imported `How it works` button has no action yet, and the export does not include the future academic-context tab.
- The font currently loads from Google Fonts in the browser, as in the export.

The imported visual styling is preserved. Department backgrounds are solid colors in `data/courses.ts`. The landing-page fade is the `radial-gradient` overlay in `components/landing-page.tsx`, not the course cards.

Run `bun run lint` and `bun run build` to check the project.


## Deployment 
Goal is to either deploy on vercel or cloudflare


## ChatGPT OAuth connection

The website hosts the Supabase OAuth Server consent UI at `/oauth/consent`.
Enable OAuth 2.1 Server in the Supabase dashboard and set its authorization path
(the consent page) to `/oauth/consent`, using this website as the Site URL.
Configure the ChatGPT OAuth client and exact callback URL in Supabase; the MCP
server uses the same project for discovery and access-token verification.
Use asymmetric JWT signing keys. No OAuth client secret belongs in browser env vars.

Existing email/password signup, email confirmation, and Google login preserve
`authorization_id` through `/auth/callback?next=...`. Only the local consent route
is an accepted return destination. Add the deployed `/auth/callback` URL (including
support for its `next` query parameter) to Supabase's redirect allowlist. A real,
non-anonymous Supabase account is required before consent is loaded or submitted.

Consent displays the registered client, callback address, and requested account
scopes. Supabase issues the authorization code and handles PKCE/token exchange;
this website never creates or stores ChatGPT's access tokens. Existing grants may
be redirected automatically by Supabase. Expired requests must be restarted in
ChatGPT.

The MCP tab lists the user's OAuth grants and provides a separate Disconnect
control. Website logout continues to use `signOut({ scope: "local" })` and does
not revoke those grants. Disconnect calls `oauth.revokeGrant({ clientId })`;
already-issued access tokens can remain valid until expiration.

OAuth account scopes do not restrict database rows. RLS policy creation and
live cross-user RLS testing are deferred; configure policies before exposing
private data. End-to-end ChatGPT testing still needs the deployed HTTPS URLs,
Supabase OAuth Server settings, and a registered ChatGPT connection.
