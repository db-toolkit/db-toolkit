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
    appVersion: true,
    osInfo: true,
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
                <div className="flex items-center justify-between">
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subTelemetry.featureUsage}
                        onChange={() => handleSubToggle('featureUsage')}
                        className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Feature Usage
                      </span>
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Which features you use most frequently
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subTelemetry.sessionDuration}
                        onChange={() => handleSubToggle('sessionDuration')}
                        className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Session Duration
                      </span>
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      How long you use the application
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subTelemetry.appVersion}
                        onChange={() => handleSubToggle('appVersion')}
                        className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        App Version
                      </span>
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Which version of DB Toolkit you're using
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subTelemetry.osInfo}
                        onChange={() => handleSubToggle('osInfo')}
                        className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        OS Information
                      </span>
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Your operating system and architecture
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subTelemetry.databaseTypes}
                        onChange={() => handleSubToggle('databaseTypes')}
                        className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Database Types
                      </span>
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Which database types you connect to
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subTelemetry.workspaceUsage}
                        onChange={() => handleSubToggle('workspaceUsage')}
                        className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Workspace Usage
                      </span>
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      How many workspaces you use
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}