import React from 'react';

const Input = ({ label, error, icon: Icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1.5 text-surface-700 dark:text-surface-300">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          className={`input-field ${Icon ? 'pl-11' : ''} ${error ? 'border-red-500 focus:ring-red-500/50' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
