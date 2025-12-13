/**
 * Enhanced Time Range Picker with presets and custom range
 */
import { useState } from "react";
import { Clock, ChevronDown } from "lucide-react";

export function TimeRangePicker({ value, onChange, showCompare = false }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [compareEnabled, setCompareEnabled] = useState(false);

  const presets = [
    { value: 0.25, label: "Last 15 minutes", hours: 0.25 },
    { value: 0.5, label: "Last 30 minutes", hours: 0.5 },
    { value: 1, label: "Last 1 hour", hours: 1 },
    { value: 3, label: "Last 3 hours", hours: 3 },
  ];

  const selectedPreset = presets.find((p) => p.value === value);

  const handlePresetClick = (preset) => {
    onChange(preset.value);
    setShowDropdown(false);
  };

  const handleCompareToggle = () => {
    setCompareEnabled(!compareEnabled);
    // TODO: Implement compare functionality
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        <Clock size={16} />
        <span>{selectedPreset?.label || "Select Range"}</span>
        <ChevronDown size={16} />
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
            <div className="p-2">
              <div className="mb-2 px-2 py-1">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Quick Select
                </span>
              </div>

              {/* Preset options */}
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handlePresetClick(preset)}
                    className={`
                      w-full text-left px-3 py-2 text-sm rounded transition
                      ${
                        value === preset.value
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Compare toggle */}
              {showCompare && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <label className="flex items-center gap-2 px-3 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={compareEnabled}
                      onChange={handleCompareToggle}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Compare with previous period
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
