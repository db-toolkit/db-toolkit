/**
 * Telemetry Settings Component
 * Privacy-first opt-in telemetry configuration
 */

import { useState, useEffect } from "react";
import { useTelemetry } from "../../hooks/useTelemetry";
import { Button } from "../common/Button";
import { Card } from "../common/Card";

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
              Telemetry
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Share anonymous usage analytics to help improve DB Toolkit. No personal data is collected.
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
      </Card>
    </div>
  );
}