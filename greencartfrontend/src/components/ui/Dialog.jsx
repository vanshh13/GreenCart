import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Dialog({ isOpen, onClose, title, children, maxWidth = 'md' }) {
  // Handle ESC key press to close dialog
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);

    // Prevent scrolling on body when dialog is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Determine max-width class based on prop
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  }[maxWidth] || 'max-w-md';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
      <div 
        className={`bg-white rounded-lg shadow-xl ${maxWidthClass} w-full overflow-hidden transform transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          <button
            onClick={onClose}
            className="ml-auto flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[calc(100vh-10rem)] overflow-y-auto text-gray-900">
          {children}
        </div>
      </div>
    </div>
  );
}

  
  export function DialogContent({ children }) {
    return <div className="p-6">{children}</div>;
  }
  
  export function DialogHeader({ children }) {
    return <div className="p-4 border-b border-gray-200">{children}</div>;
  }
  
  export function DialogTitle({ children }) {
    return <h2 className="text-lg font-semibold">{children}</h2>;
  }
  
  export function DialogFooter({ children }) {
    return <div className="p-4 border-t border-gray-200 flex justify-end">{children}</div>;
  }
  