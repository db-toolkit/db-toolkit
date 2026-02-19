import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Plus } from 'lucide-react';
import { useConnections } from '../hooks';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { ConnectionCard } from '../components/connections/ConnectionCard';
import { ConnectionSidebar } from '../components/connections/ConnectionSidebar';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useConfirmDialog } from '../hooks/common/useConfirmDialog';

function ConnectionGroupPage() {
  const { groupName } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { dialog, showConfirm, closeDialog } = useConfirmDialog();
  const [showSidebar, setShowSidebar] = useState(false);
  const [editingConnection, setEditingConnection] = useState(null);
  const { connections, loading, error, connectedIds, createConnection, updateConnection, deleteConnection, connectToDatabase } = useConnections();

  const decodedGroupName = decodeURIComponent(groupName);

  // Filter connections for this group
  const groupConnections = useMemo(() => {
    return connections.filter(conn => conn.group === decodedGroupName);
  }, [connections, decodedGroupName]);

  const handleConnect = useCallback(async (id) => {
    try {
      await connectToDatabase(id);
      toast.success('Connected successfully');
      navigate(`/schema/${id}`);
    } catch (err) {
      toast.error('Connection failed: ' + err.message);
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

  const handleEdit = useCallback((connection) => {
    setEditingConnection(connection);
    setShowSidebar(true);
  }, []);

  const handleSave = useCallback(async (data) => {
    try {
      if (editingConnection) {
        await updateConnection(editingConnection.id, data);
        toast.success('Connection updated');
      } else {
        await createConnection(data);
        toast.success('Connection created');
      }
      setShowSidebar(false);
      setEditingConnection(null);
    } catch (err) {
      toast.error(editingConnection ? 'Update failed' : 'Creation failed');
    }
  }, [editingConnection, createConnection, updateConnection, toast]);

  const handleCloseSidebar = useCallback(() => {
    setShowSidebar(false);
    setEditingConnection(null);
  }, []);

  if (loading) return <LoadingState fullScreen message="Loading connections..." />;
  
  if (error) return (
    <div className="p-8">
      <ErrorMessage message={error} />
    </div>
  );

  return (
    <>
      <div className="p-8 animate-page-transition">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="secondary"
            size="sm"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/connections')}
          >
            Back to Connections
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {decodedGroupName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {groupConnections.length} connection{groupConnections.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {groupConnections.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No connections in this group"
            description="Add connections to this group from the main connections page"
            action={
              <Button 
                icon={<Plus size={20} />} 
                onClick={() => { 
                  setEditingConnection(null); 
                  setShowSidebar(true); 
                }}
              >
                Add Connection
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupConnections.map((conn) => (
              <ConnectionCard
                key={conn.id}
                connection={conn}
                isConnected={connectedIds?.includes?.(conn.id) || false}
                onConnect={() => handleConnect(conn.id)}
                onEdit={() => handleEdit(conn)}
                onDelete={() => handleDelete(conn.id)}
              />
            ))}
          </div>
        )}
      </div>

      <ConnectionSidebar
        isOpen={showSidebar}
        onClose={handleCloseSidebar}
        onSave={handleSave}
        connection={editingConnection}
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

export default ConnectionGroupPage;
