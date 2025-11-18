/**
 * Query settings component
 */
import { Input } from '../common/Input';

export function QuerySettings({ settings, onChange }) {
  return (
    <div className="space-y-6">
      <Input
        label="Default Row Limit"
        type="number"
        value={settings.default_query_limit}
        onChange={(e) => onChange('default_query_limit', parseInt(e.target.value))}
        min={10}
        max={10000}
      />

      <Input
        label="Default Timeout (seconds)"
        type="number"
        value={settings.default_query_timeout}
        onChange={(e) => onChange('default_query_timeout', parseInt(e.target.value))}
        min={5}
        max={300}
      />

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="auto-format"
          checked={settings.auto_format_on_paste}
          onChange={(e) => onChange('auto_format_on_paste', e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded"
        />
        <label htmlFor="auto-format" className="text-sm text-gray-700 dark:text-gray-300">
          Auto-format SQL on paste
        </label>
      </div>

      <Input
        label="Query History Retention (days)"
        type="number"
        value={settings.query_history_retention_days}
        onChange={(e) => onChange('query_history_retention_days', parseInt(e.target.value))}
        min={1}
        max={365}
      />
    </div>
  );
}
