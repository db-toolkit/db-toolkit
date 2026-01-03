/**
 * Telemetry Settings Component
 * Privacy-first opt-in telemetry configuration
 */

import { useState, useEffect } from "react";
import { useTelemetry } from "../../hooks/useTelemetry";
import { Button } from "./Button";
import { Card } from "./Card";

export function TelemetrySettings() {
  const { enabled, status, enableTelemetry, getTelemetryReport, clearTelemetryData } = useTelemetry();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    loadReport();
  }, [enabled, getTelemetryReport]);

  const loadReport = async () => {
    if (enabled) {
      setLoading(true);
      const data = await getTelemetryReport();
      setReport(data);
      setLoading(false);
    }
  };

  const handleToggleTelemetry = async () => {
    await enableTelemetry(!enabled);
  };

  const handleClearData = async () => {
    const confirmed = window.confirm(
      'This will delete all telemetry data. This action cannot be undone. Are you sure?'
    );
    
    if (confirmed) {
      await clearTelemetryData();
      setReport(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Telemetry & Analytics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Help improve DB Toolkit by sharing anonymous usage data
            </p>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={handleToggleTelemetry}
                className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Enable Telemetry
              </span>
            </label>
          </div>
        </div>

        {enabled && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Status: {status?.pendingEvents || 0} pending events
              </div>
              
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowData(!showData)}
                >
                  {showData ? 'Hide Data' : 'Show Data'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadReport}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
                
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleClearData}
                >
                  Clear Data
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {showData && report && (
        <Card>
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Telemetry Report
          </h4>
          
          {/* Feature Usage */}
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Most Used Features
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {report.features?.topUsed?.slice(0, 6).map((feature, index) => (
                <div key={feature.feature} className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {feature.feature.replace(/_/g, ' ')}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {feature.usageCount} uses
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Stats */}
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Session Statistics (30 days)
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {report.sessions?.stats?.totalSessions || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Sessions
                </div>
              </div>
              
              <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {Math.round((report.sessions?.stats?.avgDuration || 0) / 60000)}m
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Avg Duration
                </div>
              </div>
              
              <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {report.sessions?.stats?.peakHours?.[0]?.percentage || 0}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Peak Hour
                </div>
              </div>
              
              <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {report.databases?.topTypes?.[0]?.dbType || 'N/A'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Top Database
                </div>
              </div>
            </div>
          </div>

          {/* Database Distribution */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Database Type Distribution
            </h5>
            <div className="space-y-1">
              {Object.entries(report.databases?.distribution || {}).map(([dbType, data]) => (
                <div key={dbType} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {dbType}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {data.percentage}% ({data.count} connections)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}