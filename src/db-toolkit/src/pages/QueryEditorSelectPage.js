import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectionsAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ConnectionSelector } from '../components/data-explorer/ConnectionSelector';

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
    <ConnectionSelector
      connections={connections}
      onConnect={handleSelectConnection}
      title="Query Editor"
      description="Select a database connection to open the query editor"
      buttonText="Open Editor"
    />
  );
}

export default QueryEditorSelectPage;
