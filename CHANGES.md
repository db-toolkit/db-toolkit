# Development Changes

This file tracks changes during development before they are added to CHANGELOG.md.

## Unreleased

### Added
- Database URL connection option - Add checkbox to use full database URL instead of individual fields in connection modal
  - Support for async protocols: postgresql+asyncpg, mysql+aiomysql, mongodb+srv
  - Support for SQLite file paths: sqlite:///path/to/db.sqlite
  - URL validation with specific error messages
- Database Analytics page - Real-time monitoring dashboard
  - Current queries with kill query functionality and query type classification
  - Long-running queries detection (>30 seconds)
  - Blocked queries/locks monitoring
  - Database size tracking
  - Active/idle connections count
  - System metrics: CPU, memory, disk usage
  - Professional charts with Recharts (tooltips, legends, zoom)
  - Historical data storage (3 hours max)
  - Time range selector (1h, 2h, 3h)
  - Query execution plan visualization
  - Query distribution by type (SELECT/INSERT/UPDATE/DELETE)
  - Query duration tracking
  - Support for PostgreSQL, MySQL, MongoDB, SQLite

### Changed
- Split analytics operations into database-specific modules for better maintainability
- Enhanced MySQL analytics with query type classification and improved lock detection
- Enhanced MongoDB analytics with operation type classification and lock wait detection
- Enhanced SQLite analytics with table/index counts and database statistics

### Fixed
- Database URL parsing now handles async driver protocols correctly
- SQLite URL format (sqlite:///) now parsed correctly
- URL field clears when toggling checkbox off
- Parsed URL values auto-populate fields for immediate editing
- Visual feedback (toast) when URL is parsed successfully
- Create Connection button in Data Explorer now navigates correctly without page refresh
- JSX parent element error in AnalyticsPage

### Improved
- PostgreSQL: Full analytics support with all features
- MySQL: Enhanced with query type classification, improved lock detection, user info in blocked queries
- MongoDB: Enhanced with operation type classification, lock wait detection, query stats
- SQLite: Enhanced with table/index counts, page statistics, largest tables info

### Removed
