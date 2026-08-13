## Purpose

Ensure the public site and its semantic exploration tools remain understandable and operable across small screens, keyboards, and incomplete runtime data.

## ADDED Requirements

### Requirement: Global navigation remains available on narrow screens
The site SHALL provide a clearly labelled global navigation path on small screens without hiding the core public areas.

#### Scenario: Reader opens the site on a narrow screen
- **WHEN** the viewport cannot display every global navigation item in one row
- **THEN** the reader can still reveal and operate every core navigation link

### Requirement: Semantic exploration exposes accessible states
The knowledge map and random walk SHALL expose loading, empty, selection, and restart states through labelled controls and status text.

#### Scenario: Semantic snapshot is unavailable
- **WHEN** the browser cannot obtain a semantic snapshot
- **THEN** the reader sees an accurate empty state and can continue browsing the regular blog
