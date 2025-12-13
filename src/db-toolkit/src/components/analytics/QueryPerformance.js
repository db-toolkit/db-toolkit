/**
 * Query Performance Analysis Component
 * Shows query performance distribution, slowest queries, and frequency analysis
 */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { Zap, TrendingUp, Clock, AlertTriangle } from "lucide-react";

export function QueryPerformance({ queries = [], slowQueries = [] }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Calculate performance distribution
  const getPerformanceDistribution = () => {
    const buckets = {
      "0-10ms": 0,
      "10-100ms": 0,
      "100ms-1s": 0,
      "1s-10s": 0,
      "10s+": 0,
    };

    queries.forEach((query) => {
      const duration = query.duration * 1000; // Convert to ms
      if (duration < 10) buckets["0-10ms"]++;
      else if (duration < 100) buckets["10-100ms"]++;
      else if (duration < 1000) buckets["100ms-1s"]++;
      else if (duration < 10000) buckets["1s-10s"]++;
      else buckets["10s+"]++;
    });

    return Object.entries(buckets).map(([range, count]) => ({
      range,
      count,
      fill: getBarColor(range),
    }));
  };

  const getBarColor = (range) => {
    const colors = {
      "0-10ms": "#22C55E", // Green - Fast
      "10-100ms": "#3B82F6", // Blue - Normal
      "100ms-1s": "#F59E0B", // Orange - Slow
      "1s-10s": "#EF4444", // Red - Very Slow
      "10s+": "#DC2626", // Dark Red - Critical
    };
    return colors[range] || "#6B7280";
  };

  const distributionData = getPerformanceDistribution();
  const totalQueries = queries.length;
  const avgDuration = totalQueries
    ? (
        queries.reduce((sum, q) => sum + (q.duration || 0), 0) / totalQueries
      ).toFixed(3)
    : 0;

  // Get top 5 slowest queries
  const topSlowest = [...queries]
    .sort((a, b) => (b.duration || 0) - (a.duration || 0))
    .slice(0, 5);

  const gridColor = isDark ? "#374151" : "#E5E7EB";
  const axisColor = isDark ? "#9CA3AF" : "#6B7280";
  const tooltipBg = isDark ? "#1F2937" : "#FFFFFF";
  const tooltipBorder = isDark ? "#374151" : "#E5E7EB";
  const tooltipText = isDark ? "#F3F4F6" : "#111827";

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percent = totalQueries
        ? ((payload[0].value / totalQueries) * 100).toFixed(1)
        : 0;
      return (
        <div
          style={{
            backgroundColor: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: "8px",
            padding: "8px 12px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p
            style={{
              color: tooltipText,
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            {payload[0].payload.range}
          </p>
          <p style={{ color: tooltipText, fontSize: "14px" }}>
            Queries: {payload[0].value}
          </p>
          <p style={{ color: tooltipText, fontSize: "14px" }}>
            Percentage: {percent}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Total Queries
            </span>
            <Zap className="text-purple-600 dark:text-purple-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalQueries}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Avg Duration
            </span>
            <Clock className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {avgDuration}s
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Slow Queries
            </span>
            <AlertTriangle
              className="text-orange-600 dark:text-orange-400"
              size={20}
            />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {slowQueries.length}
          </p>
        </div>
      </div>

      {/* Performance Distribution Chart */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp
            className="text-green-600 dark:text-green-400"
            size={20}
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Query Performance Distribution
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Distribution of queries by execution time
        </p>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={distributionData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="range"
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 12 }}
            />
            <YAxis
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 12 }}
              label={{
                value: "Query Count",
                angle: -90,
                position: "insideLeft",
                style: { fill: axisColor, fontSize: 12 },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Fast (&lt;10ms)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Normal (10-100ms)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Slow (100ms-1s)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Very Slow (&gt;1s)
            </span>
          </div>
        </div>
      </div>

      {/* Top Slowest Queries */}
      {topSlowest.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Top 5 Slowest Queries
          </h3>
          <div className="space-y-3">
            {topSlowest.map((query, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-gray-900 dark:text-gray-100 truncate">
                    {query.query}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Duration: <span className="font-medium text-red-600 dark:text-red-400">{(query.duration || 0).toFixed(3)}s</span>
                    </span>
                    {query.usename && (
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        User: {query.usename}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
