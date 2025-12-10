/**
 * Editor settings component
 */
import { Input } from '../common/Input';

export function EditorSettings({ settings, onChange }) {
  return (
    <div className="space-y-6">
      <Input
        label="Tab Size"
        type="number"
        value={settings.editor_tab_size}
        onChange={(e) => onChange('editor_tab_size', parseInt(e.target.value))}
        min={2}
        max={8}
      />

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="word-wrap"
          checked={settings.editor_word_wrap}
          onChange={(e) => onChange('editor_word_wrap', e.target.checked)}
          className="w-4 h-4 text-green-600 rounded"
        />
        <label htmlFor="word-wrap" className="text-sm text-gray-700 dark:text-gray-300">
          Enable word wrap
        </label>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="auto-complete"
          checked={settings.editor_auto_complete}
          onChange={(e) => onChange('editor_auto_complete', e.target.checked)}
          className="w-4 h-4 text-green-600 rounded"
        />
        <label htmlFor="auto-complete" className="text-sm text-gray-700 dark:text-gray-300">
          Enable auto-complete
        </label>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="snippets"
          checked={settings.editor_snippets_enabled}
          onChange={(e) => onChange('editor_snippets_enabled', e.target.checked)}
          className="w-4 h-4 text-green-600 rounded"
        />
        <label htmlFor="snippets" className="text-sm text-gray-700 dark:text-gray-300">
          Enable snippets
        </label>
      </div>
    </div>
  );
}
