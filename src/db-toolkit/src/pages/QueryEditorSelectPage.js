import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Database, ChevronRight } from 'lucide-react';
import { connectionsAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';

function QueryEditorSelectPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const response = await connectionsAPI.getAll();
      setConnections(response.data);
    } catch (err) {
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConnection = (connectionId) => {
    navigate(`/query/${connectionId}`);
  };

  if (loading) return <LoadingState fullScreen message="Loading connections..." />;

  if (connections.length === 0) {
    return (
      <div className="p-8">
        <EmptyState
          icon={Database}
          title="No Connections"
          description="Create a database connection first to use the query editor."
          action={
            <button
              onClick={() => navigate('/connections')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Go to Connections
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Code size={32} className="text-green-600 dark:text-green-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Query Editor</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Select a database connection to open the query editor
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((conn) => (
          <button
            key={conn.id}
            onClick={() => handleSelectConnection(conn.id)}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Database size={24} className="text-green-600 dark:text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {conn.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {conn.db_type}
                  </p>
                </div>
              </div>
              <ChevronRight 
                size={20} 
                className="text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors" 
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="truncate">{conn.host}:{conn.port}</p>
              <p className="truncate">{conn.database}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QueryEditorSelectPage;
