/**
 * AI Insights for individual table
 */
import { Sparkles, Database, Zap, Code, AlertCircle } from 'lucide-react';

export function TableAiInsights({ analysis, loading }) {
  if (loading) {
    return (
      <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
          <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100">AI Insights</h4>
        </div>
        <p className="text-sm text-purple-700 dark:text-purple-300">Analyzing table...</p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="mt-4 space-y-4">
      {analysis.summary && (
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Database className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">Table Purpose</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">{analysis.summary}</p>
            </div>
          </div>
        </div>
      )}

      {analysis.index_suggestions && analysis.index_suggestions.length > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">Index Suggestions</h4>
              <ul className="space-y-1">
                {analysis.index_suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-sm text-green-700 dark:text-green-300">• {suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {analysis.common_queries && analysis.common_queries.length > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Code className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">Common Queries</h4>
              <div className="space-y-2">
                {analysis.common_queries.map((query, idx) => (
                  <div key={idx} className="p-2 bg-white dark:bg-gray-800 rounded border border-green-200 dark:border-green-800">
                    <code className="text-xs text-green-700 dark:text-green-300 font-mono">{query}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {analysis.potential_issues && analysis.potential_issues.length > 0 && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Potential Issues</h4>
              <ul className="space-y-1">
                {analysis.potential_issues.map((issue, idx) => (
                  <li key={idx} className="text-sm text-yellow-700 dark:text-yellow-300">• {issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
