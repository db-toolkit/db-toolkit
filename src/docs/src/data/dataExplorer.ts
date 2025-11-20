export const dataExplorerData = {
  title: "Data Explorer",
  sections: [
    {
      heading: "Viewing Data",
      content: `1. Navigate to table in Schema Explorer
2. Right-click → **"Browse Data"**
3. Data loads in Data Explorer tab`
    },
    {
      heading: "Inline Editing",
      content: `1. Double-click cell
2. Modify value
3. Press **Enter** to save
4. Press **Escape** to cancel

Changes save immediately to database.`
    },
    {
      heading: "Insert & Delete Rows",
      content: `**Insert:**
1. Click **"Insert Row"**
2. Fill in values
3. Click **"Save"**

**Delete:**
1. Select row(s) with checkbox
2. Click **"Delete"**
3. Confirm deletion`
    },
    {
      heading: "Pagination",
      content: `- Rows per page: 10, 25, 50, 100
- Previous/Next buttons
- Page number input
- Total rows display

Default: 50 rows per page`
    },
    {
      heading: "Sorting & Filtering",
      content: `**Sorting:**
- Click column header to sort
- First click: Ascending
- Second click: Descending
- Third click: Remove sort

**Filtering:**
- Click filter icon in header
- Enter filter value
- Select operator (Equals, Contains, etc.)
- Click **"Apply"**`
    },
    {
      heading: "Export Data",
      content: `**CSV Export:**
1. Click **"Export"**
2. Select **"CSV"**
3. Choose location

**JSON Export:**
1. Click **"Export"**
2. Select **"JSON"**
3. Choose location

Export options:
- Current page only
- All pages
- Filtered results only`
    },
    {
      heading: "Import Data",
      content: `**CSV Import:**
1. Click **"Import"**
2. Select CSV file
3. Map columns to table fields
4. Click **"Import"**

Features:
- Header row detection
- Column mapping
- Data validation
- Error reporting`
    }
  ]
};
