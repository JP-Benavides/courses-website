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
| `app/page.tsx` | Next.js home route; renders the demo app. |
| `app/api/health/route.ts` | Basic backend health endpoint. |
| `lib/server/` | Home for future shared server-only logic. |
| `components/coursebook-app.tsx` | Holds the selected screen and demo user's name. |
| `components/landing-page.tsx` | Landing-page content and layout. |
| `components/course-ticker.tsx` | Course cards and moving catalogue rows. |
| `data/courses.ts` | Static example courses and department colors. |
| `components/sign-in-page.tsx` | Demo sign-in and sign-up screens. |
| `components/profile-page.tsx` | Account header and MCP section container. |
| `components/mcp-tab.tsx` | Sample token, clipboard actions, and setup checkpoint display. |
| `app/globals.css` | Tailwind, Inter font, global styles, and ticker animations. |
| `public/design-references/` | Preserved reference images from the export; not used by the UI. |

`"use client"` marks components that need browser interactions or React state. The app controller imports the other screens, so they also run within that client boundary. `app/page.tsx` itself stays a server component.

Screen navigation currently uses React state on `/`, matching the original prototype. Refreshing resets the demo; these screens do not yet have separate URLs.

### Current demo limitations

- Email/password, Google, and Apple buttons simulate sign-in; they do not authenticate or store credentials.
- The sample token cannot access the MCP. The second checkpoint stays pending; no backend verification is connected.
- Course data is static prototype content, not a live or verified catalog.
- The imported `How it works` button has no action yet, and the export does not include the future academic-context tab.
- The font currently loads from Google Fonts in the browser, as in the export.

The imported visual styling is preserved. Department backgrounds are solid colors in `data/courses.ts`. The landing-page fade is the `radial-gradient` overlay in `components/landing-page.tsx`, not the course cards.

Run `bun run lint` and `bun run build` to check the project.


## Deployment 
Goal is to either deploy on vercel or cloudflare
