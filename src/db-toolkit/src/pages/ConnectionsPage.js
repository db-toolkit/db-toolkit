import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Database, Search, Users } from 'lucide-react';
import { useDebounce } from '../utils/debounce';
import { useConnections } from '../hooks';
import { useSession } from '../hooks/system/useSession';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { ConnectionCard } from '../components/connections/ConnectionCard';
import { ConnectionSidebar } from '../components/connections/ConnectionSidebar';
import { AddConnectionButton } from '../components/connections/AddConnectionButton';
import { GroupManagementSidebar } from '../components/connections/GroupManagementSidebar';
import { GroupCard } from '../components/connections/GroupCard';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useConfirmDialog } from '../hooks/common/useConfirmDialog';

function ConnectionsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { dialog, showConfirm, closeDialog } = useConfirmDialog();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showGroupSidebar, setShowGroupSidebar] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalError, setModalError] = useState('');
  const [editingConnection, setEditingConnection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { connections, loading, error, connectedIds, createConnection, updateConnection, deleteConnection, connectToDatabase } = useConnections();
  const { sessionState, restoreSession } = useSession();

  const handleConnect = useCallback(async (id) => {
    try {
      const response = await connectToDatabase(id);
      if (response.success === false) {
        setShowErrorModal(true);
        setModalError('Failed to connect. Please check your credentials and database server.');
        return;
      }

      toast.success('Connected successfully');
      navigate(`/schema/${id}`);
    } catch (err) {
      setShowErrorModal(true);
      setModalError(err.message);
    }
  }, [connectToDatabase, toast, navigate]);

  const handleDelete = useCallback(async (id) => {
    const confirmed = await showConfirm({
      title: 'Delete Connection',
      message: 'Delete this connection?',
      confirmText: 'Delete'
    });
    if (confirmed) {
      try {
        await deleteConnection(id);
        toast.success('Connection deleted');
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  }, [deleteConnection, toast, showConfirm]);

  const handleSave = useCallback(async (data) => {
    try {
      if (data.id) {
        const { id, ...updateData } = data;
        await updateConnection(id, updateData);
        toast.success('Connection updated');
      } else {
        await createConnection(data);
        toast.success('Connection created');
      }
      setShowSidebar(false);
      setEditingConnection(null);
    } catch (err) {
      toast.error(data.id ? 'Failed to update connection' : 'Failed to create connection');
    }
  }, [updateConnection, createConnection, toast]);

  const handleEdit = useCallback((connection) => {
    setEditingConnection(connection);
    setShowSidebar(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setShowSidebar(false);
    setEditingConnection(null);
  }, []);

  // Memoize filtered connections to avoid re-filtering on every render
  const filteredConnections = useMemo(() => {
    const searchLower = debouncedSearch.toLowerCase();
    return connections.filter(conn => 
      conn.name.toLowerCase().includes(searchLower) ||
      conn.db_type.toLowerCase().includes(searchLower) ||
      (conn.host && conn.host.toLowerCase().includes(searchLower))
    );
  }, [connections, debouncedSearch]);

  const [groupsWithCounts, setGroupsWithCounts] = useState([]);

  // Load groups with connection counts
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const result = await window.electron.ipcRenderer.invoke('groups:getAll');
        const groupsWithCounts = result.map(group => ({
          ...group,
          connectionCount: connections.filter(conn => conn.group === group.name).length
        })).filter(group => group.connectionCount > 0);
        setGroupsWithCounts(groupsWithCounts);
      } catch (error) {
        console.error('Failed to load groups:', error);
        setGroupsWithCounts([]);
      }
    };
    loadGroups();
  }, [connections]);

  const handleGroupDoubleClick = useCallback((groupName) => {
    navigate(`/connections/group/${encodeURIComponent(groupName)}`);
  }, [navigate]);

  if (loading) return <LoadingState fullScreen message="Loading connections..." />;
  
  if (error) return (
    <div className="p-8">
      <ErrorMessage message={error} />
    </div>
  );

  return (
    <>
      <div className="p-8 animate-page-transition">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Database Connections</h2>
        </div>
        
        {connections.length > 0 && (
          <div className="mb-6 flex gap-4 items-center">
            <div className="relative max-w-md flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<Users size={16} />}
              onClick={() => setShowGroupSidebar(true)}
            >
              Manage Groups
            </Button>
          </div>
        )}

        {/* Group Cards */}
        {groupsWithCounts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Connection Groups
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupsWithCounts.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  connectionCount={group.connectionCount}
                  onDoubleClick={handleGroupDoubleClick}
                />
              ))}
            </div>
          </div>
        )}
      
      {filteredConnections.length === 0 && searchQuery ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No connections found matching "{searchQuery}"</p>
        </div>
      ) : connections.length === 0 ? (
        <EmptyState
          icon={Database}
          title="No connections yet"
          description="Create your first database connection to get started"
          action={
            <Button icon={<Plus size={20} />} onClick={() => { setEditingConnection(null); setShowSidebar(true); }}>
              Create Connection
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConnections.map((conn) => (
            <ConnectionCard
              key={conn.id}
              connection={conn}
              onConnect={handleConnect}
              onDelete={handleDelete}
              onEdit={handleEdit}
              isActive={connectedIds.has(conn.id)}
            />
          ))}
        </div>
      )}

      <ConnectionSidebar
        isOpen={showSidebar}
        onClose={handleCloseSidebar}
        onSave={handleSave}
        connection={editingConnection}
      />

      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Connection Failed</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{modalError}</p>
            <Button onClick={() => setShowErrorModal(false)} className="w-full">
              Back
            </Button>
          </div>
        </div>
      )}
      </div>

      <AddConnectionButton 
        onClick={() => setShowSidebar(true)} 
        isVisible={!showSidebar}
      />

      <GroupManagementSidebar
        isOpen={showGroupSidebar}
        onClose={() => setShowGroupSidebar(false)}
      />

      <ConfirmDialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        variant={dialog.variant}
      />
    </>
  );
}

export default ConnectionsPage;
