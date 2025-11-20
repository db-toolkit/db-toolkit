import { memo } from 'react';

interface KeyboardShortcutProps {
  keys: string;
}

function KeyboardShortcut({ keys }: KeyboardShortcutProps) {
  return (
    <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
      {keys}
    </kbd>
  );
}

export default memo(KeyboardShortcut);
