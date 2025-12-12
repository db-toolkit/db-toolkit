import { X } from 'lucide-react';
import { Button } from './Button';

export function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'General',
      items: [
        { keys: ['Ctrl/Cmd', 'K'], description: 'Open Command Palette' },
        { keys: ['Ctrl/Cmd', 'N'], description: 'New Connection' },
        { keys: ['Ctrl/Cmd', 'T'], description: 'New Query Tab' },
        { keys: ['Ctrl/Cmd', 'W'], description: 'Close Tab' },
        { keys: ['Ctrl/Cmd', 'B'], description: 'Toggle Sidebar' },
        { keys: ['Ctrl/Cmd', 'Shift', 'D'], description: 'Toggle Dark Mode' },
        { keys: ['F1'], description: 'Open Documentation' },
        { keys: ['Ctrl/Cmd', '/'], description: 'Keyboard Shortcuts' },
      ]
    },
    {
      category: 'Query Editor',
      items: [
        { keys: ['Ctrl/Cmd', 'Enter'], description: 'Run Query' },
        { keys: ['Ctrl/Cmd', 'Shift', 'F'], description: 'Format SQL' },
        { keys: ['Ctrl/Cmd', '/'], description: 'Toggle Comment' },
        { keys: ['Ctrl/Cmd', 'F'], description: 'Find' },
        { keys: ['Ctrl/Cmd', 'E'], description: 'Export Results' },
        { keys: ['Ctrl/Cmd', 'Shift', 'A'], description: 'Toggle AI Assistant' },
      ]
    },
    {
      category: 'Database',
      items: [
        { keys: ['Ctrl/Cmd', 'Shift', 'C'], description: 'Connect to Database' },
        { keys: ['Ctrl/Cmd', 'R'], description: 'Refresh Schema' },
        { keys: ['Ctrl/Cmd', '.'], description: 'Stop Query' },
      ]
    },
    {
      category: 'Editor',
      items: [
        { keys: ['Ctrl/Cmd', 'Z'], description: 'Undo' },
        { keys: ['Ctrl/Cmd', 'Shift', 'Z'], description: 'Redo' },
        { keys: ['Ctrl/Cmd', 'X'], description: 'Cut' },
        { keys: ['Ctrl/Cmd', 'C'], description: 'Copy' },
        { keys: ['Ctrl/Cmd', 'V'], description: 'Paste' },
        { keys: ['Ctrl/Cmd', 'A'], description: 'Select All' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shortcuts.map((section) => (
              <div key={section.category}>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.items.map((shortcut, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIdx) => (
                          <span key={keyIdx}>
                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                              {key}
                            </kbd>
                            {keyIdx < shortcut.keys.length - 1 && (
                              <span className="mx-1 text-gray-500">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
