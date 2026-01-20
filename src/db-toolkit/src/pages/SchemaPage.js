import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw, Code, FolderTree, Upload, Sparkles, Network } from 'lucide-react';
import { useSchema } from '../hooks';
import { useSchemaAI } from '../hooks/useSchemaAI';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { SchemaTree } from '../components/schema/SchemaTree';
import { TableDetails } from '../components/schema/TableDetails';
import { CsvImportModal } from '../components/csv';
import { SchemaAiPanel } from '../components/schema/SchemaAiPanel';
import { ERDiagram } from '../components/schema/ERDiagram';
import { ReactFlowProvider } from 'reactflow';
import { dropTable } from '../utils/dropTable';

function SchemaPage() {
  const { connectionId } = useParams();
  const navigate = useNavigate();
  const { schema, loading, error, fetchSchemaTree, refreshSchema } = useSchema(connectionId);
  const { analyzeSchema, loading: aiLoading } = useSchemaAI(connectionId);
  const toast = useToast();
  const [selectedTable, setSelectedTable] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [schemaAnalysis, setSchemaAnalysis] = useState(null);
  const [showERDiagram, setShowERDiagram] = useState(false);

  useEffect(() => {
    fetchSchemaTree().catch((err) => {
      if (err.response?.data?.error) {
        console.error('Schema fetch error:', err.response.data.error);
      }
    });
  }, [fetchSchemaTree]);

  const handleTableClick = useCallback((schemaName, tableName) => {
    setSelectedTable({ schema: schemaName, table: tableName });
  }, []);

  const handleRefreshTable = useCallback(async (schemaName, tableName) => {
    try {
      await refreshSchema();
      toast.success(`Refreshed ${tableName}`);
    } catch (err) {
      toast.error('Failed to refresh table');
    }
  }, [refreshSchema, toast]);

  const handleDropTable = useCallback(async (schemaName, tableName) => {
    await dropTable(`${schemaName}.${tableName}`, connectionId, () => {
      refreshSchema();
      if (selectedTable?.schema === schemaName && selectedTable?.table === tableName) {
        setSelectedTable(null);
      }
    }, toast);
  }, [connectionId, refreshSchema, selectedTable, toast]);

  const handleAnalyzeSchema = useCallback(async (forceRefresh = false) => {
    if (!schema?.schemas || Object.keys(schema.schemas).length === 0) {
      toast.error('No schema to analyze');
      return;
    }

    try {
      const schemaName = Object.keys(schema.schemas)[0];
      const result = await analyzeSchema(schemaName, forceRefresh);
      setSchemaAnalysis(result);
      setShowAiPanel(true);
      toast.success('Schema analysis complete');
    } catch (err) {
      console.error('Schema analysis error:', err);
      toast.error('Failed to analyze schema');
    }
  }, [schema, analyzeSchema, toast]);

  if (loading) return <LoadingState fullScreen message="Loading schema..." />;

  if (error) return (
    <div className="p-8">
      <ErrorMessage message={error.message || "Failed to load schema. Please ensure you are connected to the database."} />
      <div className="flex gap-2 mt-4">
        <Button
          variant="primary"
          icon={<RefreshCw size={16} />}
          onClick={() => fetchSchemaTree()}
        >
          Retry Connection
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate('/connections')}
        >
          Back to Connections
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Schema Explorer</h2>
        <div className="flex gap-2">
          {selectedTable && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowImport(true)}
            >
              <Upload size={16} className="mr-2" />
              Import CSV
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={<Network size={16} />}
            onClick={() => setShowERDiagram(true)}
          >
            ER Diagram
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Sparkles size={16} />}
            onClick={() => handleAnalyzeSchema()}
            disabled={aiLoading}
          >
            {aiLoading ? 'Analyzing...' : 'Analyze with AI'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw size={16} />}
            onClick={refreshSchema}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            icon={<Code size={16} />}
            onClick={() => navigate(`/query/${connectionId}`)}
          >
            Query Editor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {schema && !schema.error ? (
            <SchemaTree 
              schema={schema} 
              onTableClick={handleTableClick}
              onRefreshTable={handleRefreshTable}
              onDropTable={handleDropTable}
            />
          ) : (
            <EmptyState
              icon={FolderTree}
              title="No schema data"
              description={schema?.error || "Unable to load database schema. Please connect to the database first."}
              action={
                <div className="flex gap-2">
                  <Button icon={<RefreshCw size={16} />} onClick={() => fetchSchemaTree()}>
                    Retry Connection
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/connections')}>
                    Back to Connections
                  </Button>
                </div>
              }
            />
          )}
        </div>

        {schema && !schema.error && (
          <div className="lg:col-span-2">
            {selectedTable ? (
              <TableDetails
                connectionId={connectionId}
                schemaName={selectedTable.schema}
                tableName={selectedTable.table}
              />
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
                <p>Select a table to view details</p>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedTable && (
        <CsvImportModal
          isOpen={showImport}
          onClose={() => setShowImport(false)}
          connectionId={connectionId}
          schema={selectedTable.schema}
          table={selectedTable.table}
          onSuccess={() => {
            setShowImport(false);
            refreshSchema();
          }}
        />
      )}

      {showAiPanel && (
        <SchemaAiPanel
          analysis={schemaAnalysis}
          loading={aiLoading}
          onClose={() => setShowAiPanel(false)}
          onRefresh={() => handleAnalyzeSchema(true)}
        />
      )}

      {showERDiagram && (
        <ReactFlowProvider>
          <ERDiagram
            schema={schema}
            onClose={() => setShowERDiagram(false)}
          />
        </ReactFlowProvider>
      )}
    </div>
  );
}

export default SchemaPage;
