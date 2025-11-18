# DB Toolkit

A modern desktop database management application built with **Electron + React** frontend and **Python FastAPI** backend, providing a seamless, cross-platform experience for database exploration, query execution, and data management.

## Architecture

```
Electron (React Frontend) ←→ FastAPI (Python Backend) ←→ Database Connectors
```

## Features

- **Multi-Database Support**: PostgreSQL, MySQL, SQLite, and MongoDB
- **Modern Web UI**: Responsive React interface with dynamic theming
- **Database Explorer**: Browse schemas, tables, views, columns, and collections
- **Query Editor**: SQL editor with syntax highlighting and auto-completion
- **Data Management**: Inline row editing and CSV import/export
- **Connection Manager**: Manage multiple local and remote database connections
- **Real-time Updates**: WebSocket connections for live data updates

## Tech Stack

### Backend (Python)
- **FastAPI** - High-performance async web framework
- **SQLAlchemy** - Database ORM and connection management
- **Pydantic** - Data validation and serialization
- **AsyncPG/AIOMySQL** - Async database drivers

### Frontend (Electron + React)
- **Electron** - Cross-platform desktop framework
- **React** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

## Requirements

- Python 3.11+
- Node.js 18+

## Installation

```bash
# Install Python dependencies
uv install

# Install frontend dependencies
cd frontend && npm install
```

## Development

```bash
# Start Python backend
uv run python -m backend.main

# Start Electron frontend (in another terminal)
cd frontend && npm run dev
```

## Production Build

```bash
# Build frontend
cd frontend && npm run build

# Package Electron app
npm run package
```