## ADDED Requirements

### Requirement: Cross-area navigation preserves content boundaries
The public shell SHALL make blog, projects, experience, and For Agent routes discoverable while keeping semantic map and random-walk inputs scoped exclusively to published blog articles.

#### Scenario: Reader moves from a project to a related blog article
- **WHEN** a project exposes an optional one-way blog link
- **THEN** the reader can open the article without adding the project to the blog knowledge graph
