## Purpose

Make Markdown the sole human-maintained source of public content while giving authors and Agents enforceable formats, ownership boundaries, and validation feedback.

## ADDED Requirements

### Requirement: Content types have documented schemas
The repository SHALL document required and optional metadata for blog, project, resume, and For Agent Markdown content, including language requirements and publication state where relevant.

#### Scenario: Author creates content
- **WHEN** an author or Agent follows the repository content guidance
- **THEN** it SHALL be able to select the correct content type and supply its required metadata

### Requirement: Invalid published content fails validation
The project validation command SHALL fail when a published content document is missing required metadata or violates its declared content type schema.

#### Scenario: A required blog field is omitted
- **WHEN** a published blog document omits a required field
- **THEN** the validation command SHALL exit unsuccessfully and identify the invalid document

### Requirement: Development and contribution rules are repository-local
The repository SHALL include instructions for human and Agent contributors covering setup, validation, content placement, secrets handling, branch and commit conventions, and the release process.

#### Scenario: Agent begins a change
- **WHEN** an Agent reads the repository instructions before editing
- **THEN** it SHALL find the required validation and commit/deployment expectations

### Requirement: Commit messages follow a standard format
Repository contributions SHALL use Conventional Commit messages with a type and concise subject.

#### Scenario: Contributor prepares a change
- **WHEN** a contributor creates a Git commit
- **THEN** its message SHALL use the `type: subject` Conventional Commit form
