/**
 * Data Explorer Modals Component
 */
import { CellViewModal } from './CellViewModal';
import { AddRowModal } from './AddRowModal';

export function DataExplorerModals({
  cellModal,
  showAddRowModal,
  columnMetadata,
  selectedTable,
  onCloseCellModal,
  onCloseAddRowModal,
  onAddRow,
}) {
  return (
    <>
      <CellViewModal
        isOpen={cellModal.isOpen}
        onClose={onCloseCellModal}
        data={cellModal.data}
        column={cellModal.column}
      />

      <AddRowModal
        isOpen={showAddRowModal}
        onClose={onCloseAddRowModal}
        columns={columnMetadata}
        onSave={onAddRow}
        tableName={selectedTable ? `${selectedTable.schema}.${selectedTable.table}` : ''}
      />
    </>
  );
}
