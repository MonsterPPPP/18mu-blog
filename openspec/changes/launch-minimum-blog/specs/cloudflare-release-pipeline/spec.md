## Purpose

Provide a repeatable and observable path from validated repository content to a public Cloudflare Workers Static Assets deployment.

## ADDED Requirements

### Requirement: Production build is reproducible
The repository SHALL provide documented commands that install dependencies, validate content, and produce the deployable site without requiring interactive input.

#### Scenario: Contributor runs the production build
- **WHEN** dependencies are installed and the documented build command is run
- **THEN** validation SHALL execute and a deployable static asset directory SHALL be produced

### Requirement: Cloudflare deployment is scriptable
The repository SHALL define a named Cloudflare Worker deployment and a non-interactive deployment command that publishes the static site assets to the authenticated Cloudflare account.

#### Scenario: Maintainer deploys production
- **WHEN** the documented deployment command runs with valid Wrangler credentials
- **THEN** Cloudflare SHALL publish the Worker and return a public workers.dev URL

### Requirement: GitHub main releases are automated
The repository SHALL include a GitHub Actions workflow that validates and deploys changes pushed to `main`, using Cloudflare credentials supplied as GitHub repository secrets.

#### Scenario: Main receives a valid change
- **WHEN** a valid commit is pushed to `main` and required GitHub secrets exist
- **THEN** the workflow SHALL validate, build, and deploy the site

### Requirement: Deployment configuration does not expose secrets
The repository SHALL not commit Cloudflare API tokens, embedding provider keys, synchronization tokens, or any other production secret.

#### Scenario: Contributor inspects versioned configuration
- **WHEN** configuration and workflow files are reviewed
- **THEN** they SHALL reference secrets by name without containing credential values
