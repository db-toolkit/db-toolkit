import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '../hooks';

function QueryPage() {
  const { connectionId } = useParams();
  const [query, setQuery] = useState('');
  const { result, loading, error, executeQuery } = useQuery(connectionId);

  const handleExecute = async () => {
    if (!query.trim()) return;
    try {
      await executeQuery(query);
    } catch (err) {
      console.error('Query failed:', err);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Query Editor</h2>

      <div className="mb-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query..."
          className="w-full h-40 p-4 border rounded-lg font-mono text-sm"
        />
      </div>

      <button
        onClick={handleExecute}
        disabled={loading || !query.trim()}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Executing...' : 'Execute Query'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            Results ({result.total_rows} rows)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  {result.columns?.map((col) => (
                    <th key={col} className="px-4 py-2 border text-left">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows?.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-2 border">
                        {cell !== null ? String(cell) : 'NULL'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default QueryPage;
