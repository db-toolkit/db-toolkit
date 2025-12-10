/**
 * Query statistics by type
 */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

export function QueryStats({ stats }) {
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

  if (!stats) return null;

  const data = Object.entries(stats).map(([type, count]) => ({
    type,
    count
  }));

  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const axisColor = isDark ? '#9CA3AF' : '#6B7280';
  const tooltipBg = isDark ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDark ? '#374151' : '#E5E7EB';
  const tooltipText = isDark ? '#F3F4F6' : '#111827';

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Query Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="type" stroke={axisColor} tick={{ fill: axisColor }} />
          <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '8px',
              color: tooltipText
            }}
            labelStyle={{ color: tooltipText }}
          />
          <Bar dataKey="count" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
