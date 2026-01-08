import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export function FixSuggestionCard({ suggestion, onAccept, onReject }) {
    if (!suggestion) return null;

    return (
        <div className="fixed sm:absolute bottom-2 sm:bottom-4 left-2 right-2 sm:left-auto sm:right-4 z-50 w-auto sm:w-72 max-w-[calc(100vw-1rem)] sm:max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-green-200 dark:border-green-800 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="px-3 py-2 bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-xs text-green-800 dark:text-green-300">AI Fix Suggestion</h4>
            </div>

            <div className="p-2.5 sm:p-3">
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">
                    {suggestion.explanation}
                </p>

                <div className="bg-gray-50 dark:bg-gray-900 rounded p-2 mb-2.5 border border-gray-200 dark:border-gray-700 max-h-32 sm:max-h-40 overflow-auto">
                    <code className="text-[11px] sm:text-xs font-mono text-gray-800 dark:text-gray-200 block whitespace-pre-wrap break-words">
                        {suggestion.fixed}
                    </code>
                </div>

                <div className="flex gap-2 justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onReject}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xs px-2 py-1"
                    >
                        <X size={12} className="mr-1" />
                        Reject
                    </Button>
                    <Button
                        size="sm"
                        onClick={onAccept}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                    >
                        <Check size={12} className="mr-1" />
                        Accept
                    </Button>
                </div>
            </div>
        </div>
    );
}
