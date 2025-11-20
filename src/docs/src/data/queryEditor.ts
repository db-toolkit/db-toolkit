export const queryEditorData = {
  title: "Query Editor",
  sections: [
    {
      heading: "Features",
      content: `- **Syntax Highlighting** - SQL syntax highlighting
- **Auto-Complete** - Press Ctrl+Space for suggestions
- **Multiple Tabs** - Work on multiple queries
- **Query History** - Track previous queries
- **Format SQL** - Press Ctrl/Cmd+Shift+F`
    },
    {
      heading: "Query Execution",
      content: `Press **Ctrl/Cmd + Enter** or click **"Run"**

Results show:
- Column headers
- Row data
- Execution time
- Row count`
    },
    {
      heading: "AI-Powered Analysis",
      content: `Explain query execution plans with Google Gemini:

1. Execute query with EXPLAIN ANALYZE
2. Click **"Explain with AI"**
3. Get optimization suggestions

Requires Google Gemini API key in Settings.`
    },
    {
      heading: "Keyboard Shortcuts",
      content: `- **Ctrl/Cmd + Enter** - Execute query
- **Ctrl/Cmd + Shift + F** - Format SQL
- **Ctrl/Cmd + /** - Toggle comment
- **Ctrl + Space** - Auto-complete
- **Ctrl/Cmd + Z** - Undo
- **Ctrl/Cmd + F** - Find`
    }
  ]
};
