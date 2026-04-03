import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  loading = false, 
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };

  return (
    <button 
      className={`${variants[variant]} flex items-center justify-center gap-2 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
