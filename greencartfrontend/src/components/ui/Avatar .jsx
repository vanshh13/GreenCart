import React from 'react';

export const Avatar = ({ src, alt = "Avatar", className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`inline-block rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}>
      <img
        src={src || '/path/to/default/avatar.png'}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};