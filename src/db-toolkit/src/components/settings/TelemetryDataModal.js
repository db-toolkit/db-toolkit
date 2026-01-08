/**
 * Telemetry Data Modal - View collected telemetry data
 */

import { useState, useEffect } from "react";
import { X, Loader2, Trash2, Database, Clock, Layout, Activity } from "lucide-react";
import { Button } from "../common/Button";

export function TelemetryDataModal({ isOpen, onClose, getTelemetryReport, clearTelemetryData }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadReport();
    }
  }, [isOpen]);

  const loadReport = async () => {
    setLoading(true);
    const data = await getTelemetryReport();
    setReport(data);
    setLoading(false);
  };

  const handleClear = async () => {
    const confirmed = window.confirm(
      'This will delete all collected telemetry data. This action cannot be undone. Are you sure?'
    );
    if (confirmed) {
      await clearTelemetryData();
      setReport(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Your Telemetry Data</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-500" />
            </div>
          ) : !report || report.error ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>No telemetry data collected yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Status</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Pending Events:</span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">{report.status?.pendingEvents || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Last Upload:</span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {report.status?.lastUpload ? new Date(report.status.lastUpload).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature Usage */}
              {report.features?.topUsed?.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Activity size={16} />
                    Feature Usage
                  </h3>
                  <div className="space-y-2">
                    {report.features.topUsed.slice(0, 5).map((feature, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">{feature.name || feature.feature}</span>
                        <span className="text-gray-900 dark:text-gray-100">{feature.count} uses</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Session Stats */}
              {report.sessions?.stats && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    Session Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Total Sessions:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">{report.sessions.stats.totalSessions || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Avg Duration:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {report.sessions.stats.avgDuration ? `${Math.round(report.sessions.stats.avgDuration / 60000)}m` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Database Usage */}
              {report.databases?.topTypes?.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Database size={16} />
                    Database Types Used
                  </h3>
                  <div className="space-y-2">
                    {report.databases.topTypes.map((db, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">{db.type || db.name}</span>
                        <span className="text-gray-900 dark:text-gray-100">{db.count} connections</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Workspace Usage */}
              {report.workspaces && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Layout size={16} />
                    Workspace Usage
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {report.workspaces.avgCount ? `Average ${report.workspaces.avgCount} workspaces` : 'No data'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="danger" size="sm" onClick={handleClear} disabled={loading || !report}>
            <Trash2 size={16} className="mr-2" />
            Clear All Data
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
