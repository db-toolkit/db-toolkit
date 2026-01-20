/**
 * Analytics Connections Tab
 */
import { ConnectionPoolStats } from './ConnectionPoolStats';
import { CurrentQueries } from './CurrentQueries';
import { LongRunningQueries } from './LongRunningQueries';
import { BlockedQueries } from './BlockedQueries';

export function AnalyticsConnectionsTab({ analytics, poolStats, killQuery, handleViewPlan }) {
  return (
    <div className="space-y-6">
      {poolStats && <ConnectionPoolStats stats={poolStats} />}
      <CurrentQueries
        queries={analytics.current_queries}
        onKill={killQuery}
        onViewPlan={handleViewPlan}
      />
      <LongRunningQueries
        queries={analytics.long_running_queries}
        onKill={killQuery}
      />
      <BlockedQueries queries={analytics.blocked_queries} />
    </div>
  );
}
