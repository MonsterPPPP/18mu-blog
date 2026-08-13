## Purpose

Provide a public, responsive initial site that establishes the agreed personal blog information architecture and lets visitors navigate its available content.

## ADDED Requirements

### Requirement: Public top-level navigation
The site SHALL expose public navigation to Home, Blog, Projects, Resume, and For Agent on desktop and mobile viewports.

#### Scenario: Visitor uses the main navigation
- **WHEN** a visitor selects a top-level navigation destination
- **THEN** the site SHALL render the selected public section without requiring authentication

### Requirement: Home provides a site overview
The home page SHALL display a personal introduction and a distinct summary and entry point for Blog, Projects, Resume, and For Agent.

#### Scenario: Visitor opens the home page
- **WHEN** a visitor requests the root URL
- **THEN** the page SHALL show the introduction and all four section entries

### Requirement: Public content routes render readable content
The site SHALL render published blog entries, projects, resume content, and For Agent documents as readable public pages with their title and last-updated information where applicable.

#### Scenario: Visitor opens a published blog entry
- **WHEN** a visitor requests a published blog URL
- **THEN** the site SHALL render its title, category or tags, last-updated date, and Markdown body

### Requirement: Blog discovery is available
The Blog section SHALL provide links to published articles, category or tag context, and a client-usable search interaction over published blog metadata.

#### Scenario: Visitor searches for article metadata
- **WHEN** a visitor enters a matching keyword in Blog search
- **THEN** the site SHALL show matching published articles without a server-side login or request requirement

### Requirement: Knowledge feature entry points are available
The Blog section SHALL expose Cognition Map and Random Walk entry points. Before semantic data is configured, each entry SHALL clearly state that it is awaiting the configured embedding synchronization rather than presenting invented semantic relationships.

#### Scenario: Visitor opens a knowledge feature before semantic synchronization
- **WHEN** semantic graph data is unavailable
- **THEN** the selected feature page SHALL remain navigable and disclose that semantic data has not been configured
