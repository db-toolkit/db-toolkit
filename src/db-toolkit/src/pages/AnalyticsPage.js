/**
 * Analytics page for database monitoring
 */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Database, Download } from "lucide-react";
import { useAnalytics } from "../hooks";
import { useConnectionReconnect } from "../hooks/connections/useConnectionReconnect";
import { useAnalyticsData } from "../hooks/analytics/useAnalyticsData";
import { useToast } from "../contexts/ToastContext";
import { connectionsAPI } from "../services/api";
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
import { AnalyticsOverview } from "../components/analytics/AnalyticsOverview";
import { AnalyticsPerformanceTab } from "../components/analytics/AnalyticsPerformanceTab";
import { AnalyticsQueriesTab } from "../components/analytics/AnalyticsQueriesTab";
import { AnalyticsTablesTab } from "../components/analytics/AnalyticsTablesTab";
import { AnalyticsConnectionsTab } from "../components/analytics/AnalyticsConnectionsTab";
import { AnalyticsAlertsTab } from "../components/analytics/AnalyticsAlertsTab";
import { pageTransition } from "../utils/animations";

function AnalyticsPage() {
  const { connectionId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [connections, setConnections] = useState([]);
  const [timeRange, setTimeRange] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [exportingPDF, setExportingPDF] = useState(false);

  useEffect(() => {
    const loadConnections = async () => {
      try {
        const response = await connectionsAPI.getAll();
        setConnections(response.data);
      } catch (err) {
        toast.error("Failed to load connections");
      }
    };
    loadConnections();
  }, []);

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

  const { reconnecting } = useConnectionReconnect(
    connectionId,
    () => fetchHistoricalData(timeRange),
    toast
  );

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
        onConnect={(connId) => navigate(`/analytics/${connId}`)}
        title="Database Analytics"
        description="Select a connection to view analytics"
        buttonText="Connect & Monitor"
      />
    );
  }

  return (
    <motion.div className="h-screen flex flex-col" {...pageTransition}>
      {loading || reconnecting ? (
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {reconnecting ? "Connecting to database..." : "Loading analytics..."}
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
                  {connections.find((c) => c.id === connectionId)?.name || ""}
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
                  onClick={() => navigate("/analytics")}
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
                  <AnalyticsOverview
                    analytics={analytics}
                    history={history}
                    poolStats={poolStats}
                  />
                )}

                {activeTab === "performance" && (
                  <AnalyticsPerformanceTab
                    analytics={analytics}
                    history={history}
                    timeRange={timeRange}
                    slowQueries={slowQueries}
                    tableStats={tableStats}
                  />
                )}

                {activeTab === "queries" && (
                  <AnalyticsQueriesTab
                    analytics={analytics}
                    slowQueries={slowQueries}
                    killQuery={killQuery}
                    handleViewPlan={handleViewPlan}
                  />
                )}

                {activeTab === "tables" && (
                  <AnalyticsTablesTab tableStats={tableStats} />
                )}

                {activeTab === "connections" && (
                  <AnalyticsConnectionsTab
                    analytics={analytics}
                    poolStats={poolStats}
                    killQuery={killQuery}
                    handleViewPlan={handleViewPlan}
                  />
                )}

                {activeTab === "alerts" && (
                  <AnalyticsAlertsTab analytics={analytics} />
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
