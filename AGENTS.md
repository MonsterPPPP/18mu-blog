# Agent Instructions

Read `docs/博客描述.md`, `docs/技术选型.md`, and the active OpenSpec change before editing.

## Content

- Markdown under `src/content/` is the only human-maintained public content source.
- Use the correct template in `docs/templates/` and keep personal content accurate, public, and de-identified where required.
- Do not add invented semantic relationships. Map and random-walk data require the later configured embedding synchronization.

## Development

1. Run `npm install` after dependency changes.
2. Run `npm run validate` and `npm run build` before a commit.
3. Use Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, or `test:`.
4. Never commit secrets, `.dev.vars`, API keys, Cloudflare tokens, or embedding credentials.
5. Deploy with `npm run deploy` only after validation. GitHub Actions deploys `main` once its required secrets are configured.

## Cloudflare

- The Worker name is `18mu-blog` and uses Static Assets from `dist/`.
- `/api/` is reserved for future protected semantic synchronization.
- Provider configuration belongs in Cloudflare Worker secrets, never in browser code or Markdown.
