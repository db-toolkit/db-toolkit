/**
 * Analytics Queries Tab
 */
import { QueryPerformance } from './QueryPerformance';
import { CurrentQueries } from './CurrentQueries';
import { LongRunningQueries } from './LongRunningQueries';
import { BlockedQueries } from './BlockedQueries';
import { SlowQueryLog } from './SlowQueryLog';

export function AnalyticsQueriesTab({ analytics, slowQueries, killQuery }) {
  return (
    <div className="space-y-6">
      <QueryPerformance
        queries={analytics.current_queries || []}
        slowQueries={slowQueries}
      />
      <CurrentQueries
        queries={analytics.current_queries}
        onKill={killQuery}
      />
      <LongRunningQueries
        queries={analytics.long_running_queries}
        onKill={killQuery}
      />
      <BlockedQueries queries={analytics.blocked_queries} />
      <SlowQueryLog queries={slowQueries} />
    </div>
  );
}
