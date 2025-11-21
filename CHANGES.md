# Development Changes

This file tracks changes during development before they are added to CHANGELOG.md.

## Unreleased

### Added
- AI Assistant resizable sidebar with drag-to-resize functionality
- Schema Explorer AI with schema-level and table-level analysis, IndexedDB caching (24 hours)
- Per-tab AI chat history in Query Editor (10 message limit)
- Terminal light mode support with theme-aware styling
- Terminal auto-scroll to bottom on new output


### Fixed
- AI explanation and optimization results now display correctly in sidebar
- CSV export now fully functional with custom delimiter and header options
- Query page scrolling isolated to individual sections (Results, Messages, History tabs)
- Auto-reconnect on QueryPage load prevents "Connection not found" errors after page refresh
- CSV export now correctly reads data from query results (handles both rows and data keys)
- Loading spinners added to Dashboard and Analytics pages to prevent empty state flash

### Removed
- Broken terminal session persistence code that did nothing