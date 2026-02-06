/**
 * Query Editor Page
 */
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useWorkspace } from "../components/workspace/WorkspaceProvider";
import { Download, Bot, Loader2, Workflow, Database } from "lucide-react";
import Split from "react-split";
import { useQuery, useSchema } from "../hooks";
import { useQueryTabs } from "../hooks/query/useQueryTabs";
import { useQueryAutoFix } from "../hooks/query/useQueryAutoFix";
import { useConnectionReconnect } from "../hooks/connections/useConnectionReconnect";
import { useQueryExecution } from "../hooks/query/useQueryExecution";
import { useSettingsContext } from "../contexts/SettingsContext";
import { Button } from "../components/common/Button";
import { useToast } from "../contexts/ToastContext";
import { QueryEditor } from "../components/query/QueryEditor";
import { QueryResultsPanel } from "../components/query/QueryResultsPanel";
import { QueryTabBar } from "../components/query/QueryTabBar";
import { CsvExportModal } from "../components/csv";
import { AiAssistant } from "../components/query/AiAssistant";
import { QueryBuilder } from "../components/query-builder/QueryBuilder";
import { Tooltip } from "../components/common/Tooltip";

function QueryPage() {
  const { connectionId } = useParams();
  const location = useLocation();
  const { activeWorkspace, setHasUnsavedChanges } = useWorkspace();
  const initialQuery = location.state?.initialQuery || "";
  const toast = useToast();
  const { settings } = useSettingsContext();

  const {
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    activeTab,
    query,
    result,
    executionTime,
    error,
    setQuery: setQueryBase,
    updateActiveTab,
    addTab,
    closeTab,
    renameTab,
    closeOtherTabs,
    closeAllTabs,
    clearOutput,
  } = useQueryTabs(connectionId, initialQuery);

  const [showExport, setShowExport] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [showQueryBuilder, setShowQueryBuilder] = useState(false);

  const { loading, executeQuery } = useQuery(connectionId);
  const { schema, fetchSchemaTree } = useSchema(connectionId);

  const { reconnecting } = useConnectionReconnect(connectionId, fetchSchemaTree, toast);

  const {
    fixSuggestion,
    isFixingError,
    handleAcceptFix,
    handleRejectFix,
    clearFixSuggestion,
  } = useQueryAutoFix(connectionId, query, error, schema, toast);

  const { handleExecute } = useQueryExecution(query, executeQuery, updateActiveTab, clearFixSuggestion, settings);

  const setQuery = (newQuery) => {
    setQueryBase(newQuery);
    clearFixSuggestion();
  };

  // Track unsaved changes
  useEffect(() => {
    const hasUnsaved = tabs.some((t) => !t.saved && t.query.trim());
    if (activeWorkspace) {
      setHasUnsavedChanges(activeWorkspace.id, hasUnsaved);
    }
  }, [tabs, activeWorkspace?.id, setHasUnsavedChanges]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {reconnecting && (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
          <Loader2 className="w-4 h-4 animate-spin text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-300">
            Reconnecting to database...
          </span>
        </div>
      )}

      <div
        className="flex-shrink-0 flex justify-between items-center px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
        style={{
          opacity: reconnecting ? 0.5 : 1,
          pointerEvents: reconnecting ? "none" : "auto",
        }}
      >
        <QueryTabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onTabSelect={setActiveTabId}
          onAddTab={addTab}
          onCloseTab={closeTab}
          onRenameTab={renameTab}
          onCloseOtherTabs={closeOtherTabs}
          onCloseAllTabs={closeAllTabs}
          toast={toast}
        />
        <div className="flex gap-2 ml-4">
          <Tooltip text="Open visual query builder" position="bottom">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowQueryBuilder(true)}
            >
              <Workflow size={16} className="mr-2" />
              Visual Builder
            </Button>
          </Tooltip>
          <Tooltip text="Open AI assistant panel" position="bottom">
            <Button
              variant={showAiAssistant ? "primary" : "secondary"}
              size="sm"
              onClick={() => setShowAiAssistant(!showAiAssistant)}
            >
              <Bot size={16} className="mr-2" />
              AI Assistant
            </Button>
          </Tooltip>
          {result && (
            <Tooltip text="Export results as CSV" position="bottom">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowExport(true)}
              >
                <Download size={16} className="mr-2" />
                Export CSV
              </Button>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex relative">
        <Split
          sizes={showAiAssistant ? [75, 25] : [100, 0]}
          minSize={showAiAssistant ? [400, 300] : [0, 0]}
          gutterSize={showAiAssistant ? 8 : 0}
          className="flex h-full w-full"
          gutterStyle={() => ({
            display: showAiAssistant ? "flex" : "none",
            width: showAiAssistant ? "8px" : "0px",
          })}
        >
          <div className="h-full w-full flex flex-col overflow-hidden">
            <Split
              direction="vertical"
              sizes={[50, 50]}
              minSize={200}
              gutterSize={8}
              className="flex flex-col h-full w-full"
            >
              <div className="overflow-hidden h-full w-full relative">
                <QueryEditor
                  query={query}
                  onChange={setQuery}
                  onExecute={handleExecute}
                  loading={loading}
                  schema={schema}
                  error={error}
                  fixSuggestion={fixSuggestion}
                  onAcceptFix={() => handleAcceptFix(setQuery)}
                  onRejectFix={handleRejectFix}
                />
              </div>

              <div className="overflow-hidden h-full w-full relative">
                <QueryResultsPanel
                  connectionId={connectionId}
                  result={result}
                  executionTime={executionTime}
                  onSelectQuery={setQuery}
                  onRefresh={handleExecute}
                  currentQuery={query}
                  isFixingError={isFixingError}
                  onFixError={(errorMsg) => {
                    updateActiveTab({ error: errorMsg });
                  }}
                  onClearOutput={clearOutput}
                />
              </div>
            </Split>
          </div>

          <div
            className={`h-full flex flex-col overflow-hidden ${showAiAssistant ? "" : "hidden"}`}
          >
            <AiAssistant
              connectionId={connectionId}
              currentQuery={query}
              onQueryGenerated={setQuery}
              onQueryOptimized={(result) => {
                console.log("Query optimized:", result);
              }}
              lastError={error}
              schemaContext={schema}
              isVisible={showAiAssistant}
              onClose={() => setShowAiAssistant(false)}
              chatHistory={activeTab?.chatHistory || []}
              onChatUpdate={(newHistory) => {
                setTabs((prev) =>
                  prev.map((t) =>
                    t.id === activeTabId
                      ? { ...t, chatHistory: newHistory.slice(-10) }
                      : t,
                  ),
                );
              }}
            />
          </div>
        </Split>
      </div>

      <CsvExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        connectionId={connectionId}
        query={query}
        result={result}
      />

      {showQueryBuilder && schema && (
        <QueryBuilder
          schema={schema}
          onClose={() => setShowQueryBuilder(false)}
          onExecuteQuery={async (sql) => {
            setQuery(sql);
            setShowQueryBuilder(false);
            setTimeout(() => handleExecute(), 100);
          }}
        />
      )}
    </div>
  );
}

export default QueryPage;
