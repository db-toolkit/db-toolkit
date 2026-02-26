# Telemetry Removal Checklist

## Files to Delete

### Backend (Electron)
- [ ] `electron/backend/handlers/telemetry.js` - IPC handlers
- [ ] `electron/backend/telemetry/telemetry-service.js` - Main service
- [ ] `electron/backend/telemetry/telemetry-manager.js` - Manager
- [ ] `electron/backend/telemetry/telemetry-storage.js` - Storage
- [ ] `electron/backend/telemetry/telemetry-tracker.js` - Tracker
- [ ] `electron/backend/telemetry/database-usage-analytics.js` - DB analytics
- [ ] `electron/backend/telemetry/feature-usage-analytics.js` - Feature analytics

### Frontend (React)
- [ ] `src/components/settings/TelemetrySettings.js` - Settings component
- [ ] `src/components/settings/TelemetryDataModal.js` - Data modal
- [ ] `src/hooks/system/useTelemetry.js` - React hook

### API (Vercel)
- [ ] `src/api/api/telemetry/upload.js` - Upload endpoint
- [ ] `src/api/api/telemetry/stats.js` - Stats endpoint
- [ ] `src/api/utils/telemetry-db.js` - Database utilities

## Files to Edit

### Backend
- [ ] `electron/backend/handlers/index.js`
  - Remove: `const { registerTelemetryHandlers } = require('./telemetry');`
  - Remove: `registerTelemetryHandlers();`

- [ ] `electron/backend/utils/constants.js`
  - Remove: `TELEMETRY_UPLOAD: 'https://db-toolkit-api.vercel.app/api/telemetry/upload',`

### Frontend
- [ ] `src/components/settings/SettingsModal.js`
  - Remove: `import { TelemetrySettings } from './TelemetrySettings';`
  - Remove: `{ id: 'telemetry', label: 'Telemetry', icon: BarChart3 }` from tabs
  - Remove: telemetry tab rendering

- [ ] `src/components/workspace/WorkspaceProvider.js`
  - Remove: `import { useTelemetry } from "../../hooks/system/useTelemetry";`
  - Remove: `const { trackFeature } = useTelemetry();`
  - Remove: all `trackFeature()` calls

- [ ] `src/hooks/connections/useConnections.js`
  - Remove: `import { useTelemetry } from "../system/useTelemetry";`
  - Remove: `const { trackDatabase } = useTelemetry();`
  - Remove: all `trackDatabase()` calls

- [ ] `src/App.js`
  - Remove: `import { useTelemetry } from './hooks/system/useTelemetry';`
  - Remove: `const { trackFeature } = useTelemetry();`
  - Remove: all `trackFeature()` calls

### API
- [ ] `src/api/api/init.js`
  - Remove: `import { initTelemetryTable } from '../utils/telemetry-db.js';`
  - Remove: telemetry table initialization
  - Update success response to remove telemetry references

- [ ] `src/api/api/cron/daily-report.js`
  - Remove: `import { getTelemetryStats } from '../../utils/telemetry-db.js';`
  - Remove: `const telemetryStats = await getTelemetryStats();`
  - Update email template call to remove telemetry stats

- [ ] `src/api/utils/email-template.js`
  - Remove: `telemetryStats` parameter from `generateStatsEmailHTML()`
  - Remove: entire telemetry section from email HTML

## Database Cleanup
- [ ] Drop `telemetry_events` table from production database (if exists)
- [ ] Remove telemetry indexes

## Documentation
- [ ] Update README.md - remove telemetry mentions
- [ ] Update privacy policy (if exists)
- [ ] Update settings documentation

## Testing After Removal
- [ ] App starts without errors
- [ ] Settings modal works without telemetry tab
- [ ] Connections work without tracking
- [ ] Workspaces work without tracking
- [ ] Daily report email works without telemetry stats
- [ ] No console errors related to telemetry

## Total Files
- **Delete**: 10 files
- **Edit**: 9 files
