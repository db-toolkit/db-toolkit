/**
 * Analytics Alerts Tab
 */
import { AlertsPanel } from './AlertsPanel';

export function AnalyticsAlertsTab({ analytics }) {
  return (
    <div className="space-y-6">
      <AlertsPanel analytics={analytics} />
    </div>
  );
}
