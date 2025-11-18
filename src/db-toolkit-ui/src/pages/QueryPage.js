import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '../hooks';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { QueryEditor } from '../components/query/QueryEditor';
import { ResultsTable } from '../components/query/ResultsTable';

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

      <QueryEditor
        query={query}
        onChange={setQuery}
        onExecute={handleExecute}
        loading={loading}
      />

      {error && <ErrorMessage message={error} />}

      <ResultsTable result={result} />
    </div>
  );
}

export default QueryPage;
