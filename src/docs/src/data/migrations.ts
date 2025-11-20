export const migrationsData = {
  title: "Database Migrations",
  sections: [
    {
      heading: "Overview",
      content: `DB Toolkit provides a built-in Migration Panel powered by Migrator CLI.

Manage database schema changes with:
- Project-based migrations - Link migration folders to database connections
- Real-time terminal output via WebSocket
- Execute migration commands directly from the UI
- Track migration history and status
- No manual configuration needed`
    },
    {
      heading: "Getting Started",
      content: `**1. Open Migration Panel**
Click "Migrations" in the sidebar

**2. Create Migration Project**
- Click "New Project" or go to Settings > Migrations
- Select your project folder (where your Python code lives)
- Link it to a database connection
- DB Toolkit will remember this setup

**3. Initialize Migrations**
In the terminal panel, run:
migrator init

This creates a migrations/ folder in your project with all necessary files.`
    },
    {
      heading: "Creating Migrations",
      content: `**1. Make changes to your SQLAlchemy models**
Edit your Python files with model definitions

**2. Generate migration**
In the Migration Panel terminal:
migrator makemigrations "describe your changes"

Example:
migrator makemigrations "add email column to users"

**3. Review the migration**
DB Toolkit shows the generated migration file
Check the upgrade() and downgrade() functions

**4. Apply migration**
migrator migrate

The terminal shows real-time output as the migration runs.`
    },
    {
      heading: "Migration Projects",
      content: `DB Toolkit uses a project-based approach:

**What is a Migration Project?**
A migration project links:
- Your project folder (where Python code lives)
- A database connection
- Migration settings (auto-detected or custom)

**Managing Projects:**
1. Go to Settings > Migrations
2. Click "Add Project"
3. Select folder with your SQLAlchemy models
4. Choose database connection
5. Save

**Switching Projects:**
Use the dropdown in Migration Panel to switch between projects.
Each project has its own migration history and settings.`
    },
    {
      heading: "Commands",
      content: `**Initialize migration environment:**
migrator init

**Create new migration:**
migrator makemigrations "add email to users"

**Apply migrations:**
migrator migrate

**Rollback migrations:**
migrator downgrade

**Show migration history:**
migrator history

**Show current revision:**
migrator current

**Mark database as migrated (for existing databases):**
migrator stamp head

**Show migration status:**
migrator status`
    },

    {
      heading: "Migration Terminal",
      content: `The Migration Panel includes an integrated terminal:

**Features:**
- Real-time command output via WebSocket
- Drag to resize terminal height
- Auto-scroll to latest output
- Command history
- Color-coded output (errors in red)

**Available Commands:**
migrator init - Initialize migrations
migrator makemigrations "message" - Create migration
migrator migrate - Apply migrations
migrator downgrade - Rollback last migration
migrator history - Show migration history
migrator current - Show current revision
migrator status - Show migration status
migrator stamp head - Mark existing DB as migrated`
    },
    {
      heading: "Working with Existing Databases",
      content: `If you have an existing database with tables:

**1. Initialize migrations**
migrator init

**2. Mark current state**
migrator stamp head

This tells Migrator your database is already at the "head" revision.

**3. Make changes**
Now you can create new migrations for future changes:
migrator makemigrations "add new column"
migrator migrate`
    },
    {
      heading: "Troubleshooting",
      content: `**Project not showing?**
Go to Settings > Migrations and verify:
- Folder path is correct
- Database connection is active
- Project is saved

**Base class not found?**
Use --base flag in terminal:
migrator init --base app.database:Base

**Migration failed?**
- Check terminal output for errors
- Verify database connection is active
- Check your model definitions
- Try: migrator downgrade (to rollback)

**Terminal not responding?**
- Check WebSocket connection
- Refresh the page
- Verify backend is running`
    }
  ]
};
