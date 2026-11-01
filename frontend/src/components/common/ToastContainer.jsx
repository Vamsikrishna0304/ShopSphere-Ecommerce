import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="#10b981" />;
      case 'error':
        return <AlertCircle size={18} color="#ef4444" />;
      case 'warning':
        return <AlertTriangle size={18} color="#f59e0b" />;
      default:
        return <Info size={18} color="#3b82f6" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            background: 'white',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideIn 0.25s ease-out',
          }}
        >
          {getIcon(toast.type)}
          <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500, color: '#1e293b' }}>
            {toast.message}
          </span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ color: '#94a3b8', padding: '2px', display: 'flex' }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
