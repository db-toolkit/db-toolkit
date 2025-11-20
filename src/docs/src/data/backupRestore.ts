export const backupRestoreData = {
  title: "Backup & Restore",
  sections: [
    {
      heading: "Automated Backups",
      content: `Schedule backups:
- **Daily** - Every day at specified time
- **Weekly** - Once per week
- **Monthly** - Once per month

Features:
- Compression
- Retention policies
- Automatic cleanup of old backups`
    },
    {
      heading: "Manual Backups",
      content: `Create on-demand backups:

1. Click **"Backup"** tab
2. Click **"Create Backup"**
3. Choose location
4. Wait for completion

Backup includes:
- All tables
- Schemas
- Indexes
- Constraints`
    },
    {
      heading: "Backup Tools",
      content: `Supports native tools:
- **PostgreSQL** - pg_dump
- **MySQL** - mysqldump
- **MongoDB** - mongodump

Falls back to Python implementation if tools not installed.`
    },
    {
      heading: "Restore Database",
      content: `1. Click **"Restore"** tab
2. Select backup file
3. Choose target database
4. Click **"Restore"**
5. Confirm operation

⚠️ Warning: Restore will overwrite existing data.`
    },
    {
      heading: "Backup Verification",
      content: `Automatic verification:
- File integrity check
- Size validation
- Compression test

Status shown in backup list.`
    },
    {
      heading: "Real-time Status",
      content: `WebSocket updates show:
- Backup progress
- Completion status
- Error messages
- Notifications`
    }
  ]
};
