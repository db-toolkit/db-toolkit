/**
 * Analytics charts with Recharts
 */
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

export function AnalyticsCharts({ history, timeRange }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (!history || history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">No historical data available</p>
      </div>
    );
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const chartData = history.map(item => ({
    time: formatTime(item.timestamp),
    connections: item.connections
  }));

  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const axisColor = isDark ? '#9CA3AF' : '#6B7280';
  const tooltipBg = isDark ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDark ? '#374151' : '#E5E7EB';
  const tooltipText = isDark ? '#F3F4F6' : '#111827';

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Database Connections Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="time" 
            stroke={axisColor} 
            tick={{ fontSize: 12, fill: axisColor }}
            interval="preserveStartEnd"
          />
          <YAxis stroke={axisColor} tick={{ fontSize: 12, fill: axisColor }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '8px',
              color: tooltipText
            }}
            labelStyle={{ color: tooltipText }}
          />
          <Line 
            type="monotone" 
            dataKey="connections" 
            stroke="#22C55E" 
            strokeWidth={2}
            dot={false}
            name="Active Connections"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
