/**
 * Analytics Tables Tab
 */
import { TableStats } from './TableStats';

export function AnalyticsTablesTab({ tableStats }) {
  return (
    <div className="space-y-6">
      <TableStats stats={tableStats} />
    </div>
  );
}
