
import { useNavigate } from 'react-router-dom';
import { useConnections } from '../hooks';

function ConnectionsPage() {
  const navigate = useNavigate();
  const { connections, loading, error, deleteConnection, connectToDatabase } = useConnections();

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

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Database Connections</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          New Connection
        </button>
      </div>
      
      {connections.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No connections yet. Create your first connection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map((conn) => (
            <div key={conn.id} className="border rounded-lg p-4 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2">{conn.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{conn.db_type}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleConnect(conn.id)}
                  className="flex-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Connect
                </button>
                <button
                  onClick={() => handleDelete(conn.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ConnectionsPage;
