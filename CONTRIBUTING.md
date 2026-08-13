# Contributing and Release Workflow

## Setup

```powershell
npm install
npm run dev
```

## Content workflow

Create or update Markdown in `src/content/` using `docs/templates/`. Published content must pass the collection schema. Blog content is Chinese; projects and resume content provide Chinese and English fields; For Agent content is public, reusable, and de-identified.

## Validation and commit

```powershell
npm run validate
npm run build
git add <files>
git commit -m "feat: concise change description"
git push origin main
```

Commit messages use Conventional Commits in `type: subject` form. Do not commit generated `dist/`, credentials, or local environment files.

## Cloudflare deployment

The authenticated local release command is:

```powershell
npm run deploy
```

Production URL: `https://18mu-blog.15589866906.workers.dev`

For GitHub automation, configure these repository secrets:

- `CLOUDFLARE_API_TOKEN`: API token with Worker deployment permission.
- `CLOUDFLARE_ACCOUNT_ID`: `8b26118de1720b6efeec0dfdd715b7ad`.

The workflow validates, builds, and deploys every push to `main`. Embedding provider variables are future Worker secrets and are not required for the draft site.
