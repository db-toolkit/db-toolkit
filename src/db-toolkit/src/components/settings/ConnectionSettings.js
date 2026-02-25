/**
 * Connection settings component
 */
import { Input } from '../common/Input';

export function ConnectionSettings({ settings, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Default Database Type
        </label>
        <select
          value={settings.default_db_type}
          onChange={(e) => onChange('default_db_type', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="postgresql">PostgreSQL</option>
          <option value="mysql">MySQL</option>
          <option value="sqlite">SQLite</option>
          <option value="mongodb">MongoDB</option>
        </select>
      </div>

      <Input
        label="Connection Timeout (seconds)"
        type="number"
        value={settings.connection_timeout}
        onChange={(e) => onChange('connection_timeout', parseInt(e.target.value))}
        min={5}
        max={60}
      />
    </div>
  );
}
