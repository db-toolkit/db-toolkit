/**
 * Telemetry Settings Component
 * Privacy-first opt-in telemetry configuration
 */

import { useState, useEffect } from "react";
import { Eye, Trash2 } from "lucide-react";
import { useTelemetry } from "../../hooks/useTelemetry";
import { Button } from "../common/Button";
import { TelemetryDataModal } from "./TelemetryDataModal";

export function TelemetrySettings() {
  const { enabled, preferences, enableTelemetry, updatePreferences, getTelemetryReport, clearTelemetryData } = useTelemetry();
  const [showDataModal, setShowDataModal] = useState(false);

  const handleToggleTelemetry = async () => {
    await enableTelemetry(!enabled);
  };

  const handleSubToggle = async (key) => {
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    await updatePreferences(newPreferences);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Telemetry
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Share anonymous usage analytics to help improve DB Toolkit. No personal data is collected.
            </p>
          </div>
          
          <button
            onClick={handleToggleTelemetry}
            className={`flex-shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
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
                <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Feature Usage
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Which features you use most frequently
                    </p>
                  </div>
                  <button
                    onClick={() => handleSubToggle('featureUsage')}
                    className={`flex-shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      preferences.featureUsage ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.featureUsage ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      System Information
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      App version, OS, and architecture
                    </p>
                  </div>
                  <button
                    onClick={() => handleSubToggle('systemInfo')}
                    className={`flex-shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      preferences.systemInfo ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.systemInfo ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Database Types
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Which database types you connect to
                    </p>
                  </div>
                  <button
                    onClick={() => handleSubToggle('databaseTypes')}
                    className={`flex-shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      preferences.databaseTypes ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.databaseTypes ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Workspace Usage
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      How many workspaces you use
                    </p>
                  </div>
                  <button
                    onClick={() => handleSubToggle('workspaceUsage')}
                    className={`flex-shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      preferences.workspaceUsage ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.workspaceUsage ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Data Management Buttons */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDataModal(true)}
              >
                <Eye size={16} className="mr-2" />
                View My Data
              </Button>
            </div>
          </div>
        )}
      </div>

      <TelemetryDataModal
        isOpen={showDataModal}
        onClose={() => setShowDataModal(false)}
        getTelemetryReport={getTelemetryReport}
        clearTelemetryData={clearTelemetryData}
      />
    </div>
  );
}