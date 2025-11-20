export const settingsData = {
  title: "Settings",
  sections: [
    {
      heading: "Appearance",
      content: `**Dark Mode**
- Automatic OS theme detection
- Manual toggle with Ctrl/Cmd+K
- Persists across sessions

**Theme Options:**
- Light mode
- Dark mode
- System (auto-detect)`
    },
    {
      heading: "Query Defaults",
      content: `**Row Limit**
- Default: 1000 rows
- Range: 10 - 10,000
- Prevents loading millions of rows

**Timeout**
- Default: 30 seconds
- Range: 5 - 300 seconds
- Cancels long-running queries`
    },
    {
      heading: "Editor Preferences",
      content: `**Font Size**
- Range: 12px - 24px
- Default: 14px

**Tab Size**
- 2 or 4 spaces
- Default: 2 spaces

**Word Wrap**
- Enable/disable
- Default: Enabled

**Minimap**
- Show/hide code overview
- Default: Shown`
    },
    {
      heading: "Connection Defaults",
      content: `**Default Ports:**
- PostgreSQL: 5432
- MySQL: 3306
- MongoDB: 27017

**Connection Timeout:**
- Default: 10 seconds
- Range: 5 - 60 seconds`
    },
    {
      heading: "AI Integration",
      content: `**Google Gemini API Key**
- Required for AI-powered query analysis
- Stored securely in system keychain
- Used for EXPLAIN ANALYZE insights

Get API key: https://makersuite.google.com/app/apikey`
    }
  ]
};
