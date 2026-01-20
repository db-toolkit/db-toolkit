/**
 * Analytics Performance Tab
 */
import { QueryPerformance } from './QueryPerformance';
import { AnalyticsCharts } from './AnalyticsCharts';
import { SlowQueryLog } from './SlowQueryLog';
import { TableStats } from './TableStats';

export function AnalyticsPerformanceTab({ analytics, history, timeRange, slowQueries, tableStats }) {
  return (
    <div className="space-y-6">
      <QueryPerformance
        queries={analytics.current_queries || []}
        slowQueries={slowQueries}
      />
      <AnalyticsCharts history={history} timeRange={timeRange} />
      <SlowQueryLog queries={slowQueries} />
      <TableStats stats={tableStats} />
    </div>
  );
}
