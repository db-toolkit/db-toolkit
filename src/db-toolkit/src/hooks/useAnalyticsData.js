/**
 * Hook for loading additional analytics data
 */
import { useState, useEffect } from 'react';

export function useAnalyticsData(connectionId, getSlowQueries, getTableStats, getPoolStats, getQueryPlan) {
  const [slowQueries, setSlowQueries] = useState([]);
  const [tableStats, setTableStats] = useState([]);
  const [poolStats, setPoolStats] = useState(null);
  const [planModal, setPlanModal] = useState({
    isOpen: false,
    query: "",
    plan: null,
  });

  useEffect(() => {
    if (connectionId) {
      loadAdditionalData();
    }
  }, [connectionId]);

  const loadAdditionalData = async () => {
    const [slow, tables, pool] = await Promise.all([
      getSlowQueries(24),
      getTableStats(),
      getPoolStats(),
    ]);
    setSlowQueries(slow);
    setTableStats(tables);
    setPoolStats(pool);
  };

  const handleViewPlan = async (query) => {
    const result = await getQueryPlan(query);
    if (result?.success) {
      setPlanModal({ isOpen: true, query, plan: result.plan });
    }
  };

  const closePlanModal = () => {
    setPlanModal({ isOpen: false, query: "", plan: null });
  };

  return {
    slowQueries,
    tableStats,
    poolStats,
    planModal,
    handleViewPlan,
    closePlanModal,
    loadAdditionalData,
  };
}
