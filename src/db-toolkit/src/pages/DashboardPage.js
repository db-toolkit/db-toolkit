import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, FileText, HardDrive, ArrowRight } from 'lucide-react';
import { useConnections } from '../hooks';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { ConnectionSidebar } from '../components/connections/ConnectionSidebar';
import { AddConnectionButton } from '../components/connections/AddConnectionButton';

const ipc = {
  invoke: (channel, ...args) => window.electron.ipcRenderer.invoke(channel, ...args)
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { connections, loading, createConnection, connectedIds } = useConnections();
  const [stats, setStats] = useState({ queries: 0, backups: 0 });
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      const queryTabs = JSON.parse(localStorage.getItem('query-tabs') || '[]');
      
      let backupCount = 0;
      try {
        const result = await ipc.invoke('backup:schedule:list');
        backupCount = result?.schedules?.length || 0;
      } catch (err) {
        console.error('Failed to fetch backup schedules:', err);
      }
      
      setStats({
        queries: queryTabs.length,
        backups: backupCount
      });
    };
    
    loadStats();
  }, []);

  // Get recent connections sorted by last used time
  const recentConnections = connections
    .map(conn => ({
      ...conn,
      lastUsed: localStorage.getItem(`connection_time_${conn.id}`) || '0'
    }))
    .sort((a, b) => parseInt(b.lastUsed) - parseInt(a.lastUsed))
    .slice(0, 2);

  const handleSaveConnection = async (connectionData) => {
    try {
      await createConnection(connectionData);
      toast.success('Connection created successfully');
      setShowSidebar(false);
    } catch (err) {
      toast.error(err.message || 'Failed to create connection');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to DB Toolkit</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Modern database management made simple</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-green-300 dark:hover:border-green-700 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{connections.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Connections</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.queries}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Saved Queries</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <HardDrive className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.backups}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Backup Schedules</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => navigate('/backups')}>
            <HardDrive size={16} className="mr-1" /> Create Backup
          </Button>
        </div>
      </div>

      {connections.length === 0 ? (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-8 border border-green-200 dark:border-green-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Getting Started</h2>
          <ol className="space-y-3 text-gray-700 dark:text-gray-300 mb-6">
            <li className="flex items-start gap-2">
              <span className="font-semibold">1.</span>
              <span>Create your first database connection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">2.</span>
              <span>Explore your schema and tables</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">3.</span>
              <span>Run queries and manage your data</span>
            </li>
          </ol>
          <Button onClick={() => setShowModal(true)}>
            Get Started <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Connections</h2>
              {connections.length > 2 && (
                <Button size="sm" variant="secondary" onClick={() => navigate('/connections')}>
                  View All
                </Button>
              )}
            </div>
            {recentConnections.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No connections yet</p>
            ) : (
              <div className="space-y-3">
                {recentConnections.map((conn) => (
                  <div
                    key={conn.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${connectedIds.has(conn.id) ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{conn.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {conn.db_type} • {conn.host}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => navigate(`/schema/${conn.id}`)}>
                        Open Schema
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => navigate(`/query/${conn.id}`)}>
                        Open Query
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <ConnectionSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onSave={handleSaveConnection}
        connection={null}
      />

      <AddConnectionButton 
        onClick={() => setShowSidebar(true)} 
        isVisible={!showSidebar}
      />
    </div>
  );
}
