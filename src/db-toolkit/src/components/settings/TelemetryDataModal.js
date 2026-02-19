/**
 * Telemetry Data Modal - View collected telemetry data
 */

import { useState, useEffect } from "react";
import { X, Loader2, Trash2, Database, Clock, Layout, Activity } from "lucide-react";
import { Button } from "../common/Button";
import ConfirmDialog from '../common/ConfirmDialog';
import { useConfirmDialog } from '../../hooks/common/useConfirmDialog';

export function TelemetryDataModal({ isOpen, onClose, getTelemetryReport, clearTelemetryData }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const { dialog, showConfirm, closeDialog } = useConfirmDialog();

  useEffect(() => {
    if (isOpen) {
      loadReport();
    } else {
      setReport(null);
    }
  }, [isOpen]);

  const loadReport = async () => {
    setLoading(true);
    const data = await getTelemetryReport();
    setReport(normalizeReport(data));
    setLoading(false);
  };

  const handleClear = async () => {
    const confirmed = await showConfirm({
      title: 'Clear Telemetry Data',
      message: 'This will delete all collected telemetry data. This action cannot be undone. Are you sure?',
      confirmText: 'Delete All'
    });
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
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 space-y-2">
              <p>No telemetry data collected yet.</p>
              <p className="text-xs text-gray-400">
                Telemetry only tracks your usage when the feature is enabled.
              </p>
            </div>
          ) : (
            <>
              <TelemetryStatus status={report.status} />
              <TelemetryListBlock
                title="Feature Usage"
                icon={<Activity size={16} />}
                items={report.features.topUsed}
                labelParser={(item) => item.label}
                valueParser={(item) => `${item.count} uses`}
              />
              <TelemetryListBlock
                title="Database Types Used"
                icon={<Database size={16} />}
                items={report.databases.topTypes}
                labelParser={(item) => item.label}
                valueParser={(item) => `${item.count} connections`}
              />
              {report.sessions && (
                <TelemetryBlock title="Session Statistics" icon={<Clock size={16} />}>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Total Sessions:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">{report.sessions.totalSessions}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Avg Duration:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {report.sessions.avgDuration ? `${report.sessions.avgDuration}m` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </TelemetryBlock>
              )}
              {report.workspaces && (
                <TelemetryBlock title="Workspace Usage" icon={<Layout size={16} />}>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {report.workspaces.avgCount ? `Average ${report.workspaces.avgCount} workspaces` : 'No data'}
                  </div>
                </TelemetryBlock>
              )}
            </>
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

        <ConfirmDialog
          isOpen={dialog.isOpen}
          onClose={closeDialog}
          onConfirm={dialog.onConfirm}
          title={dialog.title}
          message={dialog.message}
          confirmText={dialog.confirmText}
          cancelText={dialog.cancelText}
          variant={dialog.variant}
        />
      </div>
    </div>
  );
}

function normalizeReport(payload) {
  if (!payload || payload.error) {
    return { error: payload?.error || 'Telemetry report unavailable' };
  }

  const status = {
    pendingEvents: payload.status?.pendingEvents ?? 0,
    lastUpload: payload.status?.lastUpload || null
  };

  const featuresTop = (payload.features?.topUsed || []).map((feature) => ({
    label: feature.name || feature.feature || 'Feature',
    count: feature.count || 0
  }));

  const databasesTop = (payload.databases?.topTypes || []).map((db) => ({
    label: db.type || db.name || 'Database',
    count: db.count || 0
  }));

  const sessions = payload.sessions?.stats
    ? {
        totalSessions: payload.sessions.stats.totalSessions || 0,
        avgDuration: payload.sessions.stats.avgDuration
          ? Math.round(payload.sessions.stats.avgDuration / 60000)
          : 0
      }
    : null;

  const workspaces = payload.workspaces
    ? { avgCount: payload.workspaces.avgCount || 0 }
    : null;

  return {
    ...payload,
    status,
    features: { topUsed: featuresTop },
    databases: { topTypes: databasesTop },
    sessions,
    workspaces
  };
}

function TelemetryStatus({ status }) {
  return (
    <TelemetryBlock title="Status" icon={<Activity size={16} />}>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Pending Events:</span>
          <span className="ml-2 text-gray-900 dark:text-gray-100">{status.pendingEvents}</span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Last Upload:</span>
          <span className="ml-2 text-gray-900 dark:text-gray-100">
            {status.lastUpload ? new Date(status.lastUpload).toLocaleDateString() : 'Never'}
          </span>
        </div>
      </div>
    </TelemetryBlock>
  );
}

function TelemetryBlock({ title, icon, children }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function TelemetryListBlock({ title, icon, items, labelParser, valueParser }) {
  if (!items || items.length === 0) return null;

  return (
    <TelemetryBlock title={title} icon={icon}>
      <div className="space-y-2 text-sm">
        {items.slice(0, 5).map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">{labelParser(item)}</span>
            <span className="text-gray-900 dark:text-gray-100">{valueParser(item)}</span>
          </div>
        ))}
      </div>
    </TelemetryBlock>
  );
}
