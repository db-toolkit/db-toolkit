/**
 * Telemetry Settings Component
 * Privacy-first opt-in telemetry configuration
 */

import { useState, useEffect } from "react";
import { useTelemetry } from "../../hooks/useTelemetry";
import { Button } from "../common/Button";

export function TelemetrySettings() {
  const { enabled, status, enableTelemetry, getTelemetryReport, clearTelemetryData } = useTelemetry();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  
  // Sub-telemetry toggles
  const [subTelemetry, setSubTelemetry] = useState({
    featureUsage: true,
    sessionDuration: true,
    systemInfo: true,
    databaseTypes: true,
    workspaceUsage: true
  });

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

  const handleSubToggle = (key) => {
    setSubTelemetry(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Telemetry
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Share anonymous usage analytics to help improve DB Toolkit. No personal data is collected.
            </p>
          </div>
          
          <button
            onClick={handleToggleTelemetry}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              enabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {enabled && (
          <div className="mt-6 space-y-4">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Select which analytics to share:
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Feature Usage
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Which features you use most frequently
                    </p>
                  </div>
                  <button
                    onClick={() => handleSubToggle('featureUsage')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      subTelemetry.featureUsage ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      subTelemetry.featureUsage ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Session Duration
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      How long you use the application
                    </p>
                  </div>
                  <button
                    onClick={() => handleSubToggle('sessionDuration')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      subTelemetry.sessionDuration ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      subTelemetry.sessionDuration ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      System Information
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      App version, OS, and architecture
                    </p>
                  </div>
                  <button
                    onClick={() => handleSubToggle('systemInfo')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      subTelemetry.systemInfo ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      subTelemetry.systemInfo ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Database Types
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Which database types you connect to
                    </p>
                  </div>
                  <button
                    onClick={() => handleSubToggle('databaseTypes')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      subTelemetry.databaseTypes ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      subTelemetry.databaseTypes ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Workspace Usage
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      How many workspaces you use
                    </p>
                  </div>
                  <button
                    onClick={() => handleSubToggle('workspaceUsage')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      subTelemetry.workspaceUsage ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      subTelemetry.workspaceUsage ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}