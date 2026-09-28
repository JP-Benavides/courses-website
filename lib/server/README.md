# Shared backend logic

This folder is reserved for database and token logic as those features are implemented. No services exist yet.

Start backend TypeScript modules with `import "server-only";` to prevent imports into client components. The folder name alone does not enforce this boundary. Keep secrets in `.env.local` without the `NEXT_PUBLIC_` prefix.

See the [project README](../../README.md#how-the-code-is-organized) for the request-handler structure.
