/**
 * AI Assistant panel for Query Editor
 */
import { useState, useCallback } from 'react';
import { Bot, AlertCircle, Loader2, X, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { useAiAssistant } from '../../hooks/ai/useAiAssistant';
import { useToast } from '../../contexts/ToastContext';
import { useSchemaContext } from '../../hooks/schema/useSchemaContext';
import { useChatMessages } from '../../hooks/ai/useChatMessages';
import { isQueryRequest, getConversationalResponse } from '../../utils/aiHelpers';
import { ChatMessage } from '../ai/ChatMessage';
import { SchemaScope } from '../ai/SchemaScope';

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
  const [schemaScope, setSchemaScope] = useState('all');

  const { generateQuery, optimizeQuery, explainQuery, fixQueryError, isLoading, error, clearError } = useAiAssistant(connectionId);
  const toast = useToast();
  
  const buildSchemaContext = useSchemaContext(schemaContext, schemaScope, currentQuery);
  const { chatContainerRef, messagesEndRef } = useChatMessages(chatHistory);
  const handleGenerateQuery = useCallback(async () => {
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

    if (!isQueryRequest(input)) {
      const response = getConversationalResponse(input);
      const assistantMessage = { id: loadingId, role: 'assistant', content: response, type: 'text' };
      onChatUpdate([...baseHistory, assistantMessage]);
      setNaturalLanguage('');
      return;
    }

    try {
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
  }, [naturalLanguage, chatHistory, buildSchemaContext, generateQuery, onQueryGenerated, onChatUpdate, toast]);



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

      <SchemaScope schemaScope={schemaScope} setSchemaScope={setSchemaScope} />

      {/* Content */}
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto min-h-0">
        <div className="space-y-3 mb-4">
          {chatHistory.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
              Start by describing what you want to query
            </div>
          ) : (
            chatHistory.map((msg, idx) => (
              <ChatMessage key={msg.id || idx} message={msg} index={idx} />
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