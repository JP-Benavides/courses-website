# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The initial audience is NYU students using the course-advising MCP.

## Product Purpose

Provide a public introduction to the MCP and an account website where students can sign in, provide profile information, and obtain a bearer token for MCP access associated with their account.

## Operating Context

Students should be able to reach the landing page from the web or the MCP connection experience. The intended flow is landing page, sign-in, then account. Account identity will support MCP usage tracking.

## Capabilities and Constraints

- Use the existing Next.js, TypeScript, and Bun project.
- Supabase Auth is the intended authentication service; Supabase is also the database.
- Initial scope: landing page, sign-in, account/profile with bearer-token access, and an empty personalization page.
- Start with clearly labeled demo sign-in and sample account screens. Real Supabase authentication and usable token issuance come later.
- Future scope: upload an unofficial transcript, parse its information, and let the student review and submit it. Do not implement this workflow now.
- The existing Python MCP currently uses manually issued JWTs and per-developer in-memory rate limiting. Website authentication, account-linked token issuance, usage persistence, and the unauthenticated entry flow still require integration.
- Build in small, explained steps so the owner can understand the frontend code.

## Brand Commitments

- Coursebook is an assistant-selected temporary name, as authorized by the owner. README.md records the required future rename.
- White is the primary visual focus. No gradients or generic AI-generated styling.
- Keep the interface clean and straightforward.

## Evidence on Hand

- The sibling courses-mcp repository provides catalog discovery, search, details, similarity, and prerequisite tools.
- The website currently has a Next.js starter screen. No official NYU affiliation, testimonials, or usage figures have been established.

## Open Decisions

- Final product name and deployment platform are undecided.
