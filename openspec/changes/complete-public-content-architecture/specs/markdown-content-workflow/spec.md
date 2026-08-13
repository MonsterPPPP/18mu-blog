## ADDED Requirements

### Requirement: Public record relationship metadata is documented
The author and Agent manuals SHALL document the supported project, resume, and Agent source fields, stable identifiers, relationship rules, and validation commands.

#### Scenario: Author adds a related project
- **WHEN** an author follows the project or resume template
- **THEN** the author can declare a public relationship using the documented stable identifier and verify the resulting route locally

### Requirement: Normal content publishing triggers semantic synchronization
The publishing manual SHALL state that pushing validated blog content to the production branch triggers the protected semantic synchronization automatically and SHALL not require an author to expose the sync token.

#### Scenario: Author publishes a blog article
- **WHEN** a validated blog update is pushed to the production branch
- **THEN** the release workflow deploys the site and rebuilds the public semantic snapshot without the author entering embedding credentials
