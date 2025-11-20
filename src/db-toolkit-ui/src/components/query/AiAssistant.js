/**
 * AI Assistant panel for Query Editor
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Wand2, 
  MessageSquare, 
  Zap, 
  AlertCircle,
  Copy,
  Check,
  Loader2,
  X
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
  onClose 
}) {
  const [activeTab, setActiveTab] = useState('generate');
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [copiedStates, setCopiedStates] = useState({});
  
  const { generateQuery, optimizeQuery, explainQuery, fixQueryError, isLoading, error, clearError } = useAiAssistant(connectionId);
  const toast = useToast();

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

  const handleGenerateQuery = async () => {
    if (!naturalLanguage.trim()) {
      toast.error('Please enter a description');
      return;
    }

    try {
      const result = await generateQuery(naturalLanguage, schemaContext);
      if (result.success && result.sql) {
        onQueryGenerated(result.sql);
        toast.success('Query generated successfully');
        setNaturalLanguage('');
      } else {
        toast.error(result.error || 'Failed to generate query');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleOptimizeQuery = async () => {
    if (!currentQuery.trim()) {
      toast.error('No query to optimize');
      return;
    }

    try {
      const result = await optimizeQuery(currentQuery, null, schemaContext);
      if (result.success) {
        onQueryOptimized(result);
        toast.success('Query optimization complete');
      } else {
        toast.error(result.error || 'Failed to optimize query');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleExplainQuery = async () => {
    if (!currentQuery.trim()) {
      toast.error('No query to explain');
      return;
    }

    try {
      const result = await explainQuery(currentQuery, schemaContext);
      if (result.success) {
        setActiveTab('explain');
        // Store explanation in state or pass to parent
      } else {
        toast.error(result.error || 'Failed to explain query');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleFixError = async () => {
    if (!currentQuery.trim() || !lastError) {
      toast.error('No query error to fix');
      return;
    }

    try {
      const result = await fixQueryError(currentQuery, lastError, schemaContext);
      if (result.success && result.fixed_query) {
        onQueryGenerated(result.fixed_query);
        toast.success('Query error fixed');
      } else {
        toast.error(result.error || 'Failed to fix query');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">DBAssist</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'generate', label: 'Generate', icon: Wand2 },
          { id: 'optimize', label: 'Optimize', icon: Zap },
          { id: 'explain', label: 'Explain', icon: MessageSquare }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2 text-sm font-medium flex items-center justify-center gap-1 transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'generate' && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Describe what you want to query:
                </label>
                <textarea
                  value={naturalLanguage}
                  onChange={(e) => setNaturalLanguage(e.target.value)}
                  placeholder="e.g., Show all users created in the last 30 days"
                  className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <Button
                onClick={handleGenerateQuery}
                disabled={isLoading || !naturalLanguage.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate SQL
                  </>
                )}
              </Button>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p className="mb-2">Examples:</p>
                <ul className="space-y-1">
                  <li>• "Find all orders from last week"</li>
                  <li>• "Show top 10 customers by sales"</li>
                  <li>• "List products with low stock"</li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'optimize' && (
            <motion.div
              key="optimize"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Analyze and optimize your current query for better performance.
              </div>

              <Button
                onClick={handleOptimizeQuery}
                disabled={isLoading || !currentQuery.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Optimize Query
                  </>
                )}
              </Button>

              <Button
                onClick={handleExplainQuery}
                disabled={isLoading || !currentQuery.trim()}
                variant="secondary"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Explaining...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Explain Query
                  </>
                )}
              </Button>

              {lastError && (
                <Button
                  onClick={handleFixError}
                  disabled={isLoading}
                  variant="danger"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Fixing...
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Fix Error
                    </>
                  )}
                </Button>
              )}
            </motion.div>
          )}

          {activeTab === 'explain' && (
            <motion.div
              key="explain"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Get a plain English explanation of your SQL query.
              </div>

              <Button
                onClick={handleExplainQuery}
                disabled={isLoading || !currentQuery.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Explaining...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Explain Query
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
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
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}