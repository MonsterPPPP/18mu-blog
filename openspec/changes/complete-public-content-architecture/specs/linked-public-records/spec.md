## Purpose

Give each public project, experience record, and reusable Agent document a stable place in the site while preserving the intentionally separate blog knowledge graph.

## ADDED Requirements

### Requirement: Project records have stable public detail routes
The site SHALL render every published project at a stable project-detail URL and SHALL retain a browsable project index with bilingual metadata.

#### Scenario: Reader opens a published project
- **WHEN** a reader follows a project from the project index
- **THEN** the reader sees the project's Chinese and English summaries, public body, latest update, and declared related records

### Requirement: Resume and project records can declare reciprocal links
Published project and resume records SHALL support stable content identifiers for declared related public records, and the site SHALL render both directions when a matching record exists.

#### Scenario: Related experience is declared on a project
- **WHEN** a published project declares a published resume record as related
- **THEN** the project detail links to that experience and the experience page lists the project

### Requirement: For Agent records have stable public detail routes
The site SHALL render every published de-identified Agent record at a stable detail URL without placing it in the blog semantic graph.

#### Scenario: Reader opens an Agent record
- **WHEN** a reader follows a published Agent record
- **THEN** the reader sees its standardized public content, tags, and latest update
