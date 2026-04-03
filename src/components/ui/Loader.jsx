import React from 'react';

const Loader = ({ size = 'md', className = '', fullPage = false }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const loader = (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className={`${sizes[size]} border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin`} />
      {size === 'lg' && <p className="text-surface-500 font-medium">Loading...</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;
