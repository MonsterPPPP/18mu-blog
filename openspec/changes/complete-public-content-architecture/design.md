## Context

The current Astro collections render blog detail routes and collection indexes, but projects, resume content, and Agent knowledge have incomplete route and metadata contracts. The Worker already owns the public semantic snapshot and must remain scoped to published blog articles.

## Goals / Non-Goals

**Goals:**
- Use content-collection metadata for public relationships, not a separate database.
- Add static routes and typed helper functions that resolve only published content.
- Keep public content source Markdown-first and give every interaction a non-JavaScript-readable route where appropriate.

**Non-Goals:**
- No invented career, project, or Agent facts.
- No CMS, authentication, comments, content editing UI, or extension of the embedding graph beyond blog records.

## Decisions

- Collection records use their file-derived slug as their stable public identity. Relationship frontmatter stores these slugs, which avoids duplicate IDs and gives authors a direct route contract. A separate generated identifier layer was rejected because it adds another public source of truth.
- Projects become individual static routes and resume records remain a composed public experience page. This keeps the user-facing `/resume` experience coherent while allowing multiple source records later.
- Agent documents receive list, tag, and detail routes plus a small client-side metadata search. Search is intentionally local, avoiding an unnecessary server index for a small Markdown collection.
- A compact accessible disclosure menu supplements the desktop navigation at narrow widths. Links remain actual anchors so routing works without client JavaScript.
- Shared helpers resolve relations from published collections and silently omit stale draft references in public output. Validation tooling will report unresolved declared public links during build instead of rendering broken links.

## Risks / Trade-offs

- [Slug changes break relationships] -> Manuals require stable public slugs; validation reports unresolved relation values.
- [Sparse content can look unfinished] -> Empty states are explicit and source templates make expanding each area straightforward.
- [Large local metadata search lists] -> Current content volume is small; replace only if site growth proves a server index necessary.

## Migration Plan

1. Extend schemas and templates with optional relations.
2. Add static routes, relation helpers, and validation.
3. Add existing sample relations only where source facts already exist.
4. Verify build and public release; rollback consists of reverting the feature commit because no data migration occurs.
