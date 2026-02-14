import { memo } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../../contexts/ToastContext';

export const ConnectionFormFields = memo(({ formData, handleChange, showPassword, setShowPassword }) => {
  const toast = useToast();

  return (
    <>
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
          Connection Details
        </h3>

        {formData.db_type !== 'sqlite' && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Host
                </label>
                <input
                  type="text"
                  value={formData.host}
                  onChange={(e) => handleChange('host', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Port
                </label>
                <input
                  type="number"
                  value={formData.port}
                  onChange={(e) => handleChange('port', parseInt(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </>
        )}

        {formData.db_type === 'sqlite' ? (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Database File
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.database}
                onChange={(e) => handleChange('database', e.target.value)}
                placeholder="/path/to/database.sqlite"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  try {
                    const filePath = await window.electron.ipcRenderer.invoke('dialog:showOpenDialog', {
                      properties: ['openFile'],
                      filters: [
                        { name: 'SQLite Database', extensions: ['sqlite', 'sqlite3', 'db'] },
                        { name: 'All Files', extensions: ['*'] }
                      ]
                    });
                    if (filePath) {
                      handleChange('database', filePath);
                    }
                  } catch (err) {
                    toast.error('Failed to open file dialog');
                  }
                }}
              >
                Browse
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Database
              </label>
              <input
                type="text"
                value={formData.database}
                onChange={(e) => handleChange('database', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        )}

        {formData.db_type !== 'sqlite' && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {formData.db_type !== 'sqlite' && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            🔒 SSL/TLS Configuration
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={formData.ssl_enabled}
                onChange={(e) => handleChange('ssl_enabled', e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Enable SSL/TLS Connection
              </span>
            </label>

            {formData.ssl_enabled && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  SSL Mode
                </label>
                <select
                  value={formData.ssl_mode}
                  onChange={(e) => handleChange('ssl_mode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  {formData.db_type === 'postgresql' && (
                    <>
                      <option value="disable">Disable</option>
                      <option value="allow">Allow</option>
                      <option value="prefer">Prefer</option>
                      <option value="require">Require</option>
                      <option value="verify-ca">Verify CA</option>
                      <option value="verify-full">Verify Full</option>
                    </>
                  )}
                  {(formData.db_type === 'mysql' || formData.db_type === 'mariadb') && (
                    <>
                      <option value="disable">Disable</option>
                      <option value="require">Require</option>
                      <option value="verify-ca">Verify CA</option>
                      <option value="verify-full">Verify Full</option>
                    </>
                  )}
                  {formData.db_type === 'mongodb' && (
                    <>
                      <option value="disable">Disable</option>
                      <option value="require">Require</option>
                    </>
                  )}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.ssl_mode === 'require' && 'Requires SSL but does not verify certificates'}
                  {formData.ssl_mode === 'verify-ca' && 'Requires SSL and verifies CA certificate'}
                  {formData.ssl_mode === 'verify-full' && 'Requires SSL and verifies full certificate chain'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
});

ConnectionFormFields.displayName = 'ConnectionFormFields';
