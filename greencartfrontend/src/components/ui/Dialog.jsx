export function Dialog({ isOpen, onClose, children }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg">
          {children}
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
  