## Purpose

Let people and other Agents discover public reusable operational knowledge independently from the blog and its embedding-based cognitive features.

## ADDED Requirements

### Requirement: Agent knowledge has independent search and tag navigation
The site SHALL provide client-side search and tag navigation for published Agent records, scoped only to the Agent collection.

#### Scenario: Reader searches Agent knowledge
- **WHEN** a reader enters a query on the For Agent index
- **THEN** only matching published Agent titles, descriptions, and tags are shown

### Requirement: Agent knowledge empty states are truthful
The site SHALL describe an empty Agent index without implying that unavailable records exist. Tag URLs SHALL be generated only for tags with published records.

#### Scenario: No Agent records are published
- **WHEN** there are no published Agent records
- **THEN** the Agent index returns a visible empty state without listing unavailable tags
