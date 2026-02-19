import { useMemo } from 'react';
import { ConnectionCard } from './ConnectionCard';

export function GroupSection({ 
  connections, 
  connectedIds, 
  onConnect, 
  onEdit, 
  onDelete 
}) {
  // Get all groups and organize connections by group
  const { groupedConnections, ungroupedConnections, groupsWithConnections } = useMemo(() => {
    const groups = JSON.parse(localStorage.getItem('connection-groups') || '[]');
    const grouped = {};
    const ungrouped = [];
    
    // Initialize all groups
    groups.forEach(group => {
      grouped[group.name] = [];
    });
    
    // Organize connections by group
    connections.forEach(conn => {
      if (conn.group && grouped[conn.group] !== undefined) {
        grouped[conn.group].push(conn);
      } else {
        ungrouped.push(conn);
      }
    });
    
    // Filter out groups with no connections
    const groupsWithConns = Object.keys(grouped).filter(groupName => grouped[groupName].length > 0);
    
    return {
      groupedConnections: grouped,
      ungroupedConnections: ungrouped,
      groupsWithConnections: groupsWithConns
    };
  }, [connections]);

  // Don't render if no groups have connections
  if (groupsWithConnections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Render groups with connections */}
      {groupsWithConnections.map(groupName => (
        <div key={groupName} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {groupName}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              {groupedConnections[groupName].length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedConnections[groupName].map((conn) => (
              <ConnectionCard
                key={conn.id}
                connection={conn}
                isConnected={connectedIds.includes(conn.id)}
                onConnect={() => onConnect(conn.id)}
                onEdit={() => onEdit(conn)}
                onDelete={() => onDelete(conn.id)}
              />
            ))}
          </div>
        </div>
      ))}
      
      {/* Render ungrouped connections only if there are some AND not all connections are grouped */}
      {ungroupedConnections.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Other Connections
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              {ungroupedConnections.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ungroupedConnections.map((conn) => (
              <ConnectionCard
                key={conn.id}
                connection={conn}
                isConnected={connectedIds.includes(conn.id)}
                onConnect={() => onConnect(conn.id)}
                onEdit={() => onEdit(conn)}
                onDelete={() => onDelete(conn.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
