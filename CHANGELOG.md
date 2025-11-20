# Changelog

All notable changes to DB Toolkit will be documented in this file. Only the last two version changes are documented here. For complete changelog, visit [Documentation](https://docs-dbtoolkit.vercel.app).

## [0.4.1] Bug Fixes - 2025-01-21

### Fixed
- White screen flash on backups page loading
- Overview tab not auto-selected on app startup in production
- HashRouter implementation for proper Electron routing
- Navigation issues in packaged application

## [0.4.0] - 2025-01-20

### Added
- **Terminal Enhancements**
  - Multiple terminal tabs with + button
  - Session persistence (restores tabs, height, active tab, working directory)
  - Auto-reconnection with exponential backoff (1s to 30s)
  - Database CLI shortcuts (psql, mysql, mongo buttons)
  - Resizable terminal panel
- **Migration File Browser**
  - View migration files
  - Open files in system editor
  - Edit migraton files
  - Open migrations folder button
  - Drag divider to resize sidebar (250px-600px)
- **Migration UX Improvements**
  - Clear output button
  - Split layout with file browser
  - Better project management

### Improved
- Terminal starts in home directory by default
- Terminal properly restores last working directory on reconnect
- Migration documentation updated with new features
- Terminal documentation simplified and focused
