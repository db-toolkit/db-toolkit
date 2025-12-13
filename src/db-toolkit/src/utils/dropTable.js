/**
 * Drop table utility with confirmation dialog
 */
import { toast } from 'react-hot-toast';

export async function dropTable(tableName, connectionId, onSuccess) {
    const confirmed = window.confirm(
        `Are you sure you want to drop table "${tableName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
        const query = `DROP TABLE IF EXISTS ${tableName}`;
        await window.electron.ipcRenderer.invoke('query:execute', {
            connectionId,
            query
        });

        toast.success(`Table "${tableName}" dropped successfully`);
        
        if (onSuccess) {
            onSuccess();
        }
    } catch (error) {
        console.error('Drop table error:', error);
        toast.error(`Failed to drop table: ${error.message}`);
    }
}
