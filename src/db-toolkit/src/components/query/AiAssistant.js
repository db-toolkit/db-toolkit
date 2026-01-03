/**
 * AI Assistant panel for Query Editor
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  AlertCircle,
  Loader2,
  X,
  ArrowRight
} from 'lucide-react';
import { Button } from '../common/Button';
import { useAiAssistant } from '../../hooks/useAiAssistant';
import { useToast } from '../../contexts/ToastContext';

export function AiAssistant({
  connectionId,
  currentQuery,
  onQueryGenerated,
  onQueryOptimized,
  lastError,
  schemaContext = {},
  isVisible,
  onClose,
  chatHistory = [],
  onChatUpdate
}) {
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [copiedStates, setCopiedStates] = useState({});
  const chatContainerRef = useRef(null);

  const { generateQuery, optimizeQuery, explainQuery, fixQueryError, isLoading, error, clearError } = useAiAssistant(connectionId);
  const toast = useToast();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Scope for schema context: 'table' | 'schema' | 'all'
  const [schemaScope, setSchemaScope] = useState('all');

  const extractTableFromQuery = (query) => {
    if (!query) return null;
    const match = query.match(/FROM\s+(?:([\w"]+)\.)?([\w"]+)/i);
    if (match) {
      const table = match[2]?.replace(/"/g, '');
      return table || null;
    }
    return null;
  };

  const buildSchemaContext = useMemo(() => {
    const normalizeColumns = (cols = []) =>
      (cols || []).map(col => ({
        name: col.name || col.column_name,
        type: col.type || col.data_type,
      }));

    const tableMap = {};
    const targetTable = extractTableFromQuery(currentQuery);

    if (!schemaContext) return { tables: tableMap };

    const addTable = (tableName, tableDef = {}) => {
      if (!tableName || tableMap[tableName]) return;
      tableMap[tableName] = {
        columns: normalizeColumns(tableDef.columns || []),
        sample_data: tableDef.sample_data || [],
      };
    };

    if (schemaContext.schemas) {
      const schemas = Object.values(schemaContext.schemas);
      const selectedSchema = () => {
        if (schemaScope === 'schema' && targetTable) {
          return schemas.find(s => s.tables && s.tables[targetTable]) || schemas[0];
        }
        return schemas[0];
      };

      schemas.forEach(s => {
        Object.entries(s.tables || {}).forEach(([tableName, tableDef]) => {
          if (schemaScope === 'table' && targetTable) {
            if (tableName === targetTable) addTable(tableName, tableDef);
          } else if (schemaScope === 'schema') {
            if (selectedSchema() === s) addTable(tableName, tableDef);
          } else {
            addTable(tableName, tableDef);
          }
        });
      });
    } else if (schemaContext.tables) {
      Object.entries(schemaContext.tables || {}).forEach(([tableName, tableDef]) => {
        if (schemaScope === 'table' && targetTable) {
          if (tableName === targetTable) addTable(tableName, tableDef);
        } else {
          addTable(tableName, tableDef);
        }
      });
    } else {
      // Fallback: if schemaContext is already a map of tables
      Object.entries(schemaContext || {}).forEach(([tableName, tableDef]) => {
        addTable(tableName, tableDef);
      });
    }

    return { tables: tableMap };
  }, [schemaContext, schemaScope, currentQuery]);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, error]);

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const isQueryRequest = (text) => {
    const lowerText = text.toLowerCase().trim();

    // Greetings and conversational phrases
    const conversational = [
      'hi', 'hello', 'hey', 'thanks', 'thank you', 'bye', 'goodbye',
      'how are you', 'what can you do', 'help', 'who are you'
    ];

    if (conversational.some(phrase => lowerText === phrase || lowerText.startsWith(phrase + ' '))) {
      return false;
    }

    // Query keywords
    const queryKeywords = [
      'show', 'get', 'find', 'list', 'select', 'fetch', 'retrieve',
      'count', 'sum', 'average', 'total', 'how many', 'display',
      'all', 'where', 'from', 'with', 'having', 'group by'
    ];

    return queryKeywords.some(keyword => lowerText.includes(keyword));
  };

  const handleGenerateQuery = async () => {
    if (!naturalLanguage.trim()) {
      toast.error('Please enter a description');
      return;
    }

    const input = naturalLanguage.trim();
    const userMessage = { id: `user-${Date.now()}`, role: 'user', content: input, type: 'text' };
    const baseHistory = [...chatHistory, userMessage];
    const loadingId = `assistant-${Date.now()}`;
    const loadingMessage = { id: loadingId, role: 'assistant', content: 'Generating...', type: 'loading' };
    onChatUpdate([...baseHistory, loadingMessage]);

    // Check if it's a conversational input
    if (!isQueryRequest(input)) {
      const responses = {
        'hi': 'Hello! I can help you generate SQL queries. Try asking me to "show all users" or "find orders from last week".',
        'hello': 'Hi there! Describe what data you want to query and I\'ll generate the SQL for you.',
        'hey': 'Hey! What would you like to query from your database?',
        'help': 'I can generate SQL queries from natural language. For example:\n• "Show all users created this month"\n• "Find top 10 products by sales"\n• "List orders with status pending"',
        'what can you do': 'I can convert your natural language descriptions into SQL queries. Just tell me what data you want to retrieve!',
        'who are you': 'I\'m DBAssist, your AI-powered SQL query generator. I help you write SQL queries using plain English.',
        'thanks': 'You\'re welcome! Let me know if you need help with any queries.',
        'thank you': 'Happy to help! Feel free to ask for more queries anytime.'
      };

      const lowerInput = input.toLowerCase();
      let response = responses[lowerInput] || 'I\'m here to help you generate SQL queries. Try describing what data you want to retrieve from your database.';

      const assistantMessage = { id: loadingId, role: 'assistant', content: response, type: 'text' };
      onChatUpdate([...baseHistory, assistantMessage]);
      setNaturalLanguage('');
      return;
    }

    // Generate SQL for query requests
    try {
      // Check if schema is valid
      if (!buildSchemaContext || !buildSchemaContext.tables || Object.keys(buildSchemaContext.tables).length === 0) {
        const errorMsg = 'Cannot generate query: Database schema not loaded. Please reconnect to the database.';
        const assistantMessage = { role: 'assistant', content: errorMsg, type: 'error' };
        onChatUpdate([...baseHistory, assistantMessage]);
        toast.error(errorMsg);
        setNaturalLanguage('');
        return;
      }

      console.log('Generating query with schema:', buildSchemaContext);
      const result = await generateQuery(input, buildSchemaContext);
      if (result.success && result.sql) {
        const assistantMessage = { id: loadingId, role: 'assistant', content: result.sql, type: 'sql' };
        onChatUpdate([...baseHistory, assistantMessage]);
        onQueryGenerated(result.sql);
        toast.success('Query generated successfully');
        setNaturalLanguage('');
      } else {
        const errorMessage = { role: 'assistant', content: result.error || 'Failed to generate query', type: 'error' };
        onChatUpdate([...baseHistory, errorMessage]);
        toast.error(result.error || 'Failed to generate query');
        setNaturalLanguage('');
      }
    } catch (err) {
      const errorMessage = { role: 'assistant', content: err.message, type: 'error' };
      onChatUpdate([...baseHistory, errorMessage]);
      toast.error(err.message);
      setNaturalLanguage('');
    }
  };



  return (
    <div className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">DBAssist</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Close AI Assistant"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Scope controls */}
      <div className="flex-shrink-0 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <span className="font-medium text-gray-700 dark:text-gray-200">Schema scope:</span>
        {['table', 'schema', 'all'].map(scope => (
          <button
            key={scope}
            onClick={() => setSchemaScope(scope)}
            className={`px-2 py-1 rounded border text-xs transition ${
              schemaScope === scope
                ? 'border-green-500 text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {scope === 'table' ? 'Current table' : scope === 'schema' ? 'Schema' : 'All tables'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto min-h-0">
        <div className="space-y-3 mb-4">
          {chatHistory.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
              Start by describing what you want to query
            </div>
          ) : (
            chatHistory.map((msg, idx) => (
              <div key={msg.id || idx} className={`p-3 rounded-lg ${msg.role === 'user'
                ? 'bg-green-50 dark:bg-green-900/20 ml-4'
                : 'bg-gray-50 dark:bg-gray-900 mr-4'
                }`}>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {msg.role === 'user' ? 'You' : 'DBAssist'}
                </div>
                <div className={`text-sm ${
                  msg.type === 'sql'
                    ? 'font-mono bg-gray-800 dark:bg-gray-950 text-green-400 p-2 rounded'
                    : 'text-gray-700 dark:text-gray-300'
                  }`}>
                  {msg.type === 'loading' ? (
                    <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Streaming response...</span>
                    </span>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                <Button
                  onClick={clearError}
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-red-600 dark:text-red-400"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="relative">
          <textarea
            value={naturalLanguage}
            onChange={(e) => setNaturalLanguage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (naturalLanguage.trim() && !isLoading) {
                  handleGenerateQuery();
                }
              }
            }}
            placeholder="Describe what you want to query..."
            className="w-full h-24 px-3 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={handleGenerateQuery}
            disabled={isLoading || !naturalLanguage.trim()}
            className={`absolute right-2 bottom-2 p-2 rounded-lg transition-colors ${naturalLanguage.trim() && !isLoading
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}