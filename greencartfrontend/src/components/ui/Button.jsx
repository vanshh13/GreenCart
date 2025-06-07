export function Button({ children, onClick, className }) {
    return (
      <button className={`bg-green-600 text-white py-2 px-4 rounded ${className}`} onClick={onClick}>
        {children}
      </button>
    );
  }
  