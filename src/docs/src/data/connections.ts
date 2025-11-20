export const connectionsData = {
  title: "Connection Management",
  sections: [
    {
      heading: "Adding a Connection",
      content: `1. Click **"Add Connection"**
2. Fill in connection details
3. Click **"Test Connection"** to verify
4. Click **"Save"** to store the profile`
    },
    {
      heading: "Connection Types",
      content: `**PostgreSQL**
- Host: localhost
- Port: 5432

**MySQL**
- Host: localhost
- Port: 3306

**SQLite**
- Database Path: /path/to/database.db

**MongoDB**
- Host: localhost
- Port: 27017`
    },
    {
      heading: "Managing Connections",
      content: `- **Edit** - Click edit icon to update details
- **Delete** - Click delete icon to remove
- **Test** - Verify credentials before saving`
    },
    {
      heading: "Connection Status",
      content: `🟢 **Connected** - Active connection
🔴 **Disconnected** - Not connected
🟡 **Testing** - Connection test in progress`
    },
    {
      heading: "Session Persistence",
      content: `DB Toolkit automatically saves your last connected database and restores it on next launch.`
    }
  ]
};
