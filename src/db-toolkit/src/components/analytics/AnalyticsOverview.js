/**
 * Analytics Overview Tab
 */
import { AnalyticsStats } from './AnalyticsStats';
import { AnalyticsCharts } from './AnalyticsCharts';
import { QueryStats } from './QueryStats';
import { ConnectionPoolStats } from './ConnectionPoolStats';

export function AnalyticsOverview({ analytics, history, poolStats }) {
  return (
    <div className="space-y-6">
      <AnalyticsStats analytics={analytics} history={history} />
      <AnalyticsCharts history={history} timeRange={1} />
      {analytics.query_stats && (
        <QueryStats stats={analytics.query_stats} />
      )}
      {poolStats && <ConnectionPoolStats stats={poolStats} />}
    </div>
  );
}
