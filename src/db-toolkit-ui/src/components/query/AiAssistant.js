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
  onClose,
  chatHistory = [],
  onChatUpdate
}) {
  const [activeTab, setActiveTab] = useState('chat');
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [copiedStates, setCopiedStates] = useState({});
  const [explanation, setExplanation] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [chatInput, setChatInput] = useState('');
  
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
      const userMessage = { role: 'user', content: naturalLanguage, type: 'generate' };
      onChatUpdate([...chatHistory, userMessage]);
      
      const result = await generateQuery(naturalLanguage, schemaContext);
      if (result.success && result.sql) {
        const assistantMessage = { role: 'assistant', content: result.sql, type: 'sql' };
        onChatUpdate([...chatHistory, userMessage, assistantMessage]);
        onQueryGenerated(result.sql);
        toast.success('Query generated successfully');
        setNaturalLanguage('');
      } else {
        const errorMessage = { role: 'assistant', content: result.error || 'Failed to generate query', type: 'error' };
        onChatUpdate([...chatHistory, userMessage, errorMessage]);
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
      const userMessage = { role: 'user', content: 'Optimize: ' + currentQuery, type: 'optimize' };
      onChatUpdate([...chatHistory, userMessage]);
      
      const result = await optimizeQuery(currentQuery, null, schemaContext);
      if (result.success) {
        const assistantMessage = { role: 'assistant', content: result.suggestions?.[0] || result.explanation, type: 'text' };
        onChatUpdate([...chatHistory, userMessage, assistantMessage]);
        setOptimization(result);
        setActiveTab('optimize');
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
      const userMessage = { role: 'user', content: 'Explain: ' + currentQuery, type: 'explain' };
      onChatUpdate([...chatHistory, userMessage]);
      
      const result = await explainQuery(currentQuery, schemaContext);
      if (result.success) {
        const assistantMessage = { role: 'assistant', content: result.explanation, type: 'text' };
        onChatUpdate([...chatHistory, userMessage, assistantMessage]);
        setExplanation(result);
        setActiveTab('explain');
        toast.success('Query explained successfully');
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

  return (
    <div className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-500" />
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

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'chat', label: 'Chat', icon: MessageSquare },
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
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 h-full flex flex-col"
            >
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
                    No chat history yet. Start by generating, optimizing, or explaining a query.
                  </div>
                ) : (
                  chatHistory.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 ml-4' 
                        : 'bg-gray-50 dark:bg-gray-900 mr-4'
                    }`}>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {msg.role === 'user' ? 'You' : 'DBAssist'}
                      </div>
                      <div className={`text-sm ${
                        msg.type === 'sql' ? 'font-mono bg-gray-800 dark:bg-gray-950 text-green-400 p-2 rounded' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

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

              {optimization && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Optimization Suggestions:</h4>
                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {optimization.suggestions?.[0] || optimization.explanation}
                  </div>
                </div>
              )}

              {lastError && (
                <Button
                  onClick={handleFixError}
                  disabled={isLoading}
                  variant="danger"
                  className="w-full mt-4"
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

              {explanation && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Explanation:</h4>
                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {explanation.explanation}
                  </div>
                  {explanation.complexity && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Complexity: </span>
                      <span className={`text-xs font-semibold ${
                        explanation.complexity === 'low' ? 'text-green-600 dark:text-green-400' :
                        explanation.complexity === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {explanation.complexity.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              )}
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
    </div>
  );
}