## Why

The deployed baseline demonstrates the technology path, but it does not yet express all of the agreed public information architecture. Projects and Agent knowledge need their own durable, navigable records, and the resume-project loop needs explicit content relationships instead of page-level placeholders.

## What Changes

- Add public project detail pages and a typed project-to-resume relationship that produces bidirectional navigation when related content exists.
- Add a public For Agent index, tag views, detail pages, and client-side metadata search without mixing Agent material into the blog knowledge graph.
- Make the global shell and interactive knowledge features accessible and robust across keyboard, small-screen, and empty-data states.
- Improve the author and Agent instructions so the new source fields, routes, and automatic semantic synchronization are executable and clear.

## Capabilities

### New Capabilities
- `linked-public-records`: Navigate projects, experience records, and For Agent documents as separate public content systems with declared relationships.
- `agent-knowledge-discovery`: Browse and search de-identified Agent knowledge independently of blog search and semantic features.
- `public-site-accessibility`: Provide usable global navigation and interactive knowledge exploration for keyboard and responsive users.

### Modified Capabilities
- `markdown-content-workflow`: Extend the Markdown collection contract and publishing manual for project, experience, and Agent relationships.
- `public-blog-shell`: Extend public routes and cross-area links while retaining the blog-only semantic boundary.

## Impact

Affected areas include `src/content.config.ts`, content templates and examples, Astro routes and shared UI, interactive React islands, contributor/Agent documentation, and the GitHub deployment validation workflow. No credentials, provider configuration, or browser-side embedding access are added.
