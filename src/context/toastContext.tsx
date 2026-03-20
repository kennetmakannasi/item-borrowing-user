import { createContext, useContext, useState, type ReactNode } from 'react';
import { Toast } from 'konsta/react';

interface ToastOptions {
  message: string;
  type?: 'success' | 'error' | 'info';
  opened: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastOptions>({
    message: '',
    type: 'info',
    opened: false,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, opened: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, opened: false }));
    }, 10000);
  };

//   const getColors = () => {
//     if (toast.type === 'error') return 'bg-red-600';
//     if (toast.type === 'success') return 'bg-green-600';
//     return 'bg-zinc-800'; 
//   };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      <Toast
        opened={toast.opened}
        button={
          <button onClick={() => setToast({ ...toast, opened: false })} className="text-white font-bold px-2">
            OK
          </button>
        }
        position='right'
      >
        <div className="flex items-center gap-2 py-1">
          <span>{toast.message}</span>
        </div>
      </Toast>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};