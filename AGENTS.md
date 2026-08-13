# Agent Instructions

This repository is a Markdown-first public personal site. `docs/Agent 接手指南.md` is the operational handoff guide, and `docs/文档索引.md` is the documentation entry point. Read these files before changing content, UI, build tooling, or deployment:

1. `docs/文档索引.md` to identify the authoritative task documents.
2. `docs/博客描述.md` for product and content boundaries.
3. `docs/博客架构.md` and `docs/技术选型.md` for current architecture and deployment constraints.
4. `docs/部署踩坑记录.md` and `docs/Agent 内容更新协议.md` for proven operations and the required procedure.
5. The active OpenSpec change, when one exists, before implementing product changes.

## Source of truth

- Markdown under `src/content/` is the only human-maintained public content source.
- Astro Content Collections in `src/content.config.ts` are the executable metadata contract. Do not document or emit fields that the collection does not accept.
- Public images belong at `public/images/<content-slug>/`. Refer to them with absolute site paths such as `/images/<content-slug>/diagram.png`.
- Do not invent biographical facts, project outcomes, citations, semantic relationships, or translations. Ask for source material when it is absent.

## Content boundaries

- Blog and knowledge-base documents are Chinese, completed public writing. They alone participate in future semantic maps and random walks.
- Projects and resume are public Chinese/English paired descriptions. They may link outward to blog or For Agent material; those areas do not join their relationship loop.
- For Agent documents are public, reusable, de-identified operational knowledge. Remove names, client identifiers, credentials, private URLs, and project-specific confidential details.
- This site has no private mode, accounts, comments, CMS, payment, or browser-side embedding credentials.

## Required checks and release rules

1. Make the smallest scoped change needed.
2. Run `npm run validate` and `npm run build` before committing.
3. Inspect changed files and `git diff --check` before committing.
4. Use a Conventional Commit: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, or `test:`.
5. Never commit `.dev.vars`, API keys, Cloudflare tokens, embedding credentials, generated `.deploy/`, or `dist/`.
6. Deploy only after successful validation and build. Local production deployment is `npm run deploy`; pushes to `main` deploy through GitHub Actions once its Cloudflare secrets exist.

## Semantic feature boundary

The map and random walk must use generated semantic data from published blog content. Until the configured embedding service and Worker synchronization are implemented, do not fabricate relationships or represent manual tags as semantic similarity. Provider endpoint, model identifier, authentication, and secrets remain in Cloudflare Worker configuration, never in Markdown or browser code.

## Documentation maintenance

- Keep `docs/文档索引.md` current whenever a long-lived document is added, moved, or removed.
- Update architecture, configuration, and pitfall documentation in the same change as a Worker, workflow, Secret-name, binding, public API, schema, or operational-process change.
- Record only verified incidents in `docs/部署踩坑记录.md`; include symptoms, cause, remediation, verification, and prevention without secret values.
