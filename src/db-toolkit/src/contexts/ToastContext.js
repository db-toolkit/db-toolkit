import { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message) => addToast(message, 'success');
  const error = (message) => addToast(message, 'error');
  const info = (message) => addToast(message, 'info');

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    return () => setIsExiting(true);
  }, []);

  const icons = {
    success: <CheckCircle size={18} className="text-white" />,
    error: <XCircle size={18} className="text-white" />,
    info: <AlertCircle size={18} className="text-white" />,
  };

  const styles = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-gray-800 dark:bg-gray-700 text-white',
  };

  const iconStyles = {
    success: 'text-white',
    error: 'text-white',
    info: 'text-white',
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-full shadow-lg ${styles[toast.type]} ${isExiting ? 'toast-exit' : 'toast-enter'}`}
    >
      <div className={iconStyles[toast.type]}>
        {icons[toast.type]}
      </div>
      <p className="text-sm font-medium">{toast.message}</p>
      <button onClick={onClose} className="text-white/80 hover:text-white transition-colors ml-2">
        <X size={16} />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
