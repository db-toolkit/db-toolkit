import { useState } from 'react';

export const useConfirmDialog = () => {
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'danger',
    onConfirm: () => {}
  });

  const showConfirm = ({
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
  }) => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        variant,
        onConfirm: () => {
          resolve(true);
          setDialog(prev => ({ ...prev, isOpen: false }));
        }
      });
    });
  };

  const closeDialog = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  };

  return {
    dialog,
    showConfirm,
    closeDialog
  };
};
