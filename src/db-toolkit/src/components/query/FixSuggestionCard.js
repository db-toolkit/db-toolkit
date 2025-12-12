import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export function FixSuggestionCard({ suggestion, onAccept, onReject }) {
    if (!suggestion) return null;

    return (
        <div className="fixed sm:absolute bottom-3 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-50 w-full sm:w-80 max-w-sm sm:max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-green-200 dark:border-green-800 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-sm text-green-800 dark:text-green-300">AI Fix Suggestion</h4>
            </div>

            <div className="p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {suggestion.explanation}
                </p>

                <div className="bg-gray-50 dark:bg-gray-900 rounded p-2 mb-3 border border-gray-200 dark:border-gray-700 max-h-48 overflow-auto">
                    <code className="text-xs font-mono text-gray-800 dark:text-gray-200 block whitespace-pre-wrap break-words">
                        {suggestion.fixed}
                    </code>
                </div>

                <div className="flex gap-2 justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onReject}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={14} className="mr-1" />
                        Reject
                    </Button>
                    <Button
                        size="sm"
                        onClick={onAccept}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Check size={14} className="mr-1" />
                        Accept
                    </Button>
                </div>
            </div>
        </div>
    );
}
