
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Database } from 'lucide-react';
import { useConnections } from '../hooks';
import { Button } from '../components/common/Button';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { ConnectionCard } from '../components/connections/ConnectionCard';
import { ConnectionModal } from '../components/connections/ConnectionModal';

function ConnectionsPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { connections, loading, error, createConnection, deleteConnection, connectToDatabase } = useConnections();

  const handleConnect = async (id) => {
    try {
      await connectToDatabase(id);
      navigate(`/schema/${id}`);
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this connection?')) {
      try {
        await deleteConnection(id);
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleCreate = async (data) => {
    try {
      await createConnection(data);
      setShowModal(false);
    } catch (err) {
      console.error('Create failed:', err);
    }
  };

  if (loading) return <LoadingState fullScreen message="Loading connections..." />;
  
  if (error) return (
    <div className="p-8">
      <ErrorMessage message={error} />
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Database Connections</h2>
        <Button icon={<Plus size={20} />} onClick={() => setShowModal(true)}>
          New Connection
        </Button>
      </div>
      
      {connections.length === 0 ? (
        <EmptyState
          icon={Database}
          title="No connections yet"
          description="Create your first database connection to get started"
          action={
            <Button icon={<Plus size={20} />} onClick={() => setShowModal(true)}>
              Create Connection
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map((conn) => (
            <ConnectionCard
              key={conn.id}
              connection={conn}
              onConnect={handleConnect}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ConnectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleCreate}
      />
    </div>
  );
}

export default ConnectionsPage;
