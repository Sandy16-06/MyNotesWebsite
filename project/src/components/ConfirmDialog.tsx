import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type = 'danger',
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: '#EF4444',
          confirmBg: 'rgba(220, 38, 38, 0.8)',
          confirmBorder: 'rgba(220, 38, 38, 1)',
        };
      case 'warning':
        return {
          iconColor: '#F59E0B',
          confirmBg: 'rgba(245, 158, 11, 0.8)',
          confirmBorder: 'rgba(245, 158, 11, 1)',
        };
      default:
        return {
          iconColor: '#3B82F6',
          confirmBg: 'rgba(59, 130, 246, 0.8)',
          confirmBorder: 'rgba(59, 130, 246, 1)',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 max-w-md w-full scale-in"
        style={{ boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle 
              size={24} 
              style={{ color: typeStyles.iconColor, filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
            />
            <h3 
              className="text-lg font-semibold"
              style={{ color: 'white', textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 transition-all hover:scale-110 ripple"
            style={{ 
              color: 'white', 
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <p 
          className="mb-6 leading-relaxed"
          style={{ color: 'rgba(255, 255, 255, 0.9)', textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}
        >
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg transition-all hover-lift ripple"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg transition-all hover-lift ripple font-medium"
            style={{
              background: typeStyles.confirmBg,
              color: 'white',
              border: `1px solid ${typeStyles.confirmBorder}`,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};