/**
 * Analytics Tabs Component - Tabbed interface for organizing analytics sections
 */
import { useState } from "react";
import {
  LayoutGrid,
  Gauge,
  Database,
  Activity,
  Network,
  Bell,
} from "lucide-react";

export function AnalyticsTabs({ activeTab, onTabChange, alertCount = 0 }) {
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutGrid,
      description: "High-level metrics and key insights",
    },
    {
      id: "performance",
      label: "Performance",
      icon: Gauge,
      description: "CPU, Memory, I/O, and Cache metrics",
    },
    {
      id: "queries",
      label: "Queries",
      icon: Database,
      description: "Current, long-running, and slow queries",
    },
    {
      id: "tables",
      label: "Tables",
      icon: Activity,
      description: "Table statistics and index usage",
    },
    {
      id: "connections",
      label: "Connections",
      icon: Network,
      description: "Connection pool and active connections",
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: Bell,
      description: "Alert history and configuration",
      badge: alertCount,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative
                border-b-2 flex-shrink-0
                ${
                  isActive
                    ? "border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }
              `}
              title={tab.description}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {tab.badge > 99 ? "99+" : tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
