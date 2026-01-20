/**
 * Analytics page for database monitoring
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Database, Download } from "lucide-react";
import { useConnections, useAnalytics } from "../hooks";
import { useAnalyticsConnection } from "../hooks/useAnalyticsConnection";
import { useAnalyticsData } from "../hooks/useAnalyticsData";
import { useToast } from "../contexts/ToastContext";
import { useWorkspace } from "../components/workspace/WorkspaceProvider";
import { ConnectionSelector } from "../components/data-explorer/ConnectionSelector";
import { Button } from "../components/common/Button";

import { AnalyticsStats } from "../components/analytics/AnalyticsStats";
import { AnalyticsCharts } from "../components/analytics/AnalyticsCharts";
import { QueryStats } from "../components/analytics/QueryStats";
import { CurrentQueries } from "../components/analytics/CurrentQueries";
import { LongRunningQueries } from "../components/analytics/LongRunningQueries";
import { BlockedQueries } from "../components/analytics/BlockedQueries";
import { QueryPlanModal } from "../components/analytics/QueryPlanModal";
import { SlowQueryLog } from "../components/analytics/SlowQueryLog";
import { TableStats } from "../components/analytics/TableStats";
import { ConnectionPoolStats } from "../components/analytics/ConnectionPoolStats";
import { AnalyticsTabs } from "../components/analytics/AnalyticsTabs";
import { TimeRangePicker } from "../components/analytics/TimeRangePicker";
import { QueryPerformance } from "../components/analytics/QueryPerformance";
import { AlertsPanel } from "../components/analytics/AlertsPanel";
import { pageTransition } from "../utils/animations";

function AnalyticsPage() {
  const navigate = useNavigate();
  const { connections, connectToDatabase } = useConnections();
  const { getWorkspaceState, setWorkspaceState, activeWorkspaceId } =
    useWorkspace();
  const toast = useToast();

  const {
    connectionId,
    connectionName,
    connecting,
    handleConnect,
    handleDisconnect,
  } = useAnalyticsConnection(
    connections,
    connectToDatabase,
    getWorkspaceState,
    setWorkspaceState,
    activeWorkspaceId,
    toast
  );

  const [timeRange, setTimeRange] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [exportingPDF, setExportingPDF] = useState(false);

  const {
    analytics,
    loading,
    history,
    connectionLost,
    killQuery,
    getQueryPlan,
    fetchHistoricalData,
    getSlowQueries,
    getTableStats,
    getPoolStats,
    exportPDF,
  } = useAnalytics(connectionId);

  const {
    slowQueries,
    tableStats,
    poolStats,
    planModal,
    handleViewPlan,
    closePlanModal,
  } = useAnalyticsData(
    connectionId,
    getSlowQueries,
    getTableStats,
    getPoolStats,
    getQueryPlan
  );

  useEffect(() => {
    if (connectionId) {
      fetchHistoricalData(timeRange);
    }
  }, [connectionId, timeRange]);

  if (!connectionId) {
    if (connections.length === 0) {
      return (
        <motion.div
          className="p-8 flex items-center justify-center h-full"
          {...pageTransition}
        >
          <div className="text-center max-w-md">
            <Database className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              No Connections
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create a database connection first to view analytics
            </p>
            <Button onClick={() => navigate("/connections")}>
              Create Connection
            </Button>
          </div>
        </motion.div>
      );
    }

    return (
      <ConnectionSelector
        connections={connections}
        connecting={connecting}
        onConnect={handleConnect}
        title="Database Analytics"
        description="Select a connection to view analytics"
        buttonText="Connect & Monitor"
      />
    );
  }

  return (
    <motion.div className="h-screen flex flex-col" {...pageTransition}>
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading analytics...
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Database Analytics
                  </h2>
                  <div className="flex items-center gap-2 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">
                      Live Monitoring
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {connectionName}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <TimeRangePicker
                  value={timeRange}
                  onChange={setTimeRange}
                  showCompare={false}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Download size={16} />}
                  onClick={async () => {
                    setExportingPDF(true);
                    try {
                      await exportPDF();
                    } finally {
                      setExportingPDF(false);
                    }
                  }}
                  disabled={exportingPDF}
                >
                  {exportingPDF ? "Exporting..." : "Export PDF"}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDisconnect}
                >
                  Change Connection
                </Button>
              </div>
            </div>
          </div>

          <AnalyticsTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            alertCount={0}
          />

          <div className="flex-1 overflow-auto p-6">
            {connectionLost ? (
              <div className="text-center py-12">
                <Database className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Connection Lost
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Database connection was lost. Redirecting to connections...
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
              </div>
            ) : analytics ? (
              <>
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <AnalyticsStats analytics={analytics} history={history} />
                    <AnalyticsCharts history={history} timeRange={timeRange} />
                    {analytics.query_stats && (
                      <QueryStats stats={analytics.query_stats} />
                    )}
                    {poolStats && <ConnectionPoolStats stats={poolStats} />}
                  </div>
                )}

                {activeTab === "performance" && (
                  <div className="space-y-6">
                    <QueryPerformance
                      queries={analytics.current_queries || []}
                      slowQueries={slowQueries}
                    />
                    <AnalyticsCharts history={history} timeRange={timeRange} />
                    <SlowQueryLog queries={slowQueries} />
                    <TableStats stats={tableStats} />
                  </div>
                )}

                {activeTab === "queries" && (
                  <div className="space-y-6">
                    <QueryPerformance
                      queries={analytics.current_queries || []}
                      slowQueries={slowQueries}
                    />
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
                    <SlowQueryLog queries={slowQueries} />
                  </div>
                )}

                {activeTab === "tables" && (
                  <div className="space-y-6">
                    <TableStats stats={tableStats} />
                  </div>
                )}

                {activeTab === "connections" && (
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
                )}

                {activeTab === "alerts" && (
                  <div className="space-y-6">
                    <AlertsPanel analytics={analytics} />
                  </div>
                )}
                <QueryPlanModal
                  isOpen={planModal.isOpen}
                  onClose={closePlanModal}
                  query={planModal.query}
                  plan={planModal.plan}
                />
              </>
            ) : null}
          </div>
        </>
      )}
    </motion.div>
  );
}

export default AnalyticsPage;
