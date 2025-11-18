import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSchema } from '../hooks';

function SchemaPage() {
  const { connectionId } = useParams();
  const navigate = useNavigate();
  const { schema, loading, error, fetchSchemaTree, refreshSchema } = useSchema(connectionId);

  useEffect(() => {
    fetchSchemaTree();
  }, [fetchSchemaTree]);

  if (loading) return <div className="p-8">Loading schema...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Schema Explorer</h2>
        <div className="flex gap-2">
          <button
            onClick={refreshSchema}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Refresh
          </button>
          <button
            onClick={() => navigate(`/query/${connectionId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Query Editor
          </button>
        </div>
      </div>

      {schema ? (
        <div className="bg-white rounded-lg shadow p-4">
          <pre className="text-sm">{JSON.stringify(schema, null, 2)}</pre>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No schema data available</p>
        </div>
      )}
    </div>
  );
}

export default SchemaPage;
