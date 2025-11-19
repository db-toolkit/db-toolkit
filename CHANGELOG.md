# Changelog

All notable changes to DB Toolkit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-XX

### Initial Release

First public release of DB Toolkit - a modern, cross-platform database management application.

#### Core Features

**Connection Management**
- Support for PostgreSQL, MySQL, SQLite, and MongoDB
- Create, edit, and delete database connections
- Test connection before saving
- Connection status indicator (green/gray dot)
- Session persistence (auto-restore connections on startup)

**Query Editor**
- SQL syntax highlighting with Monaco Editor
- Schema-aware autocomplete (tables and columns)
- SQL code snippets (SELECT, INSERT, UPDATE, DELETE, JOIN, etc.)
- Query formatting (Ctrl+Shift+F)
- Error highlighting with jump-to-line
- AI-powered Explain Plan analysis using Google Gemini
- Query history with search and reuse
- Multiple query tabs with auto-save
- Query execution time display
- Export results to CSV

**Data Explorer**
- Visual data browser with connection selector
- Schema and table navigation with search
- Data grid with pagination (100 rows per page)
- Column sorting (ascending/descending)
- Column filtering with apply/clear functionality
- Cell preview modal for large text/blob fields
- Export data to CSV and JSON formats
- View table relationships (foreign keys)
- Refresh data button

**Schema Browser**
- Tree view of databases, schemas, and tables
- View table columns with data types
- View indexes and constraints
- Quick navigation between tables

**Settings System**
- Global settings with backend storage
- Appearance settings (theme: light/dark/auto)
- Query defaults (row limit, timeout, history retention)
- Editor preferences (font size, tab size, word wrap, autocomplete, snippets)
- Connection defaults (timeout, auto-reconnect)
- Settings modal with tabbed interface

**User Interface**
- Dark mode with system theme detection
- Custom app icon for macOS, Windows, Linux
- Custom About dialog
- Toast notifications for user feedback
- Error boundaries for graceful error handling
- Responsive layout with split panels

#### Technical Stack
- **Backend**: Python 3.11+ with FastAPI
- **Frontend**: Electron + React 18 + Tailwind CSS
- **Database Drivers**: SQLAlchemy, AsyncPG, AIOMySQL, Motor
- **Code Editor**: Monaco Editor (VS Code engine)
- **AI Integration**: Google Gemini 2.5 Flash
- **Build System**: Vite + Electron Builder

#### Security
- Environment variables for sensitive configuration
- Parameterized queries to prevent SQL injection
- Input validation on backend and frontend
- Secure credential storage
- No hardcoded secrets or credentials

---

## [Unreleased]

### Planned Features
- Query Builder (visual SQL generator)
- SQL Documentation reference
- Credentials Manager (secure vault)
- Database Backup & Restore
- Table data editing (inline edit)
- Import CSV to database
- Query performance optimization suggestions
- Database schema comparison
- ER diagram visualization

---

## Release Notes

### Version 1.0.0
Initial release of DB Toolkit - a modern, cross-platform database management application.

**Highlights:**
- Multi-database support (PostgreSQL, MySQL, SQLite, MongoDB)
- Advanced query editor with AI-powered analysis
- Visual data explorer with filtering and export
- Comprehensive settings system
- Multiple query tabs with auto-save
- Dark mode support

**System Requirements:**
- macOS 10.13+, Windows 10+, or Linux (Ubuntu 18.04+)
- 4GB RAM minimum
- 200MB disk space

**Download:**
- macOS: DB Toolkit-1.0.0.dmg
- Windows: DB Toolkit-Setup-1.0.0.exe
- Linux: DB Toolkit-1.0.0.AppImage

---

[1.0.0]: https://github.com/yourusername/db-toolkit/releases/tag/v1.0.0
