import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'large',
  icon,
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  type = 'button',
}) => {
  const baseClasses = 'touch-feedback font-semibold rounded-kiosk transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-kiosk hover:shadow-kiosk-lg',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 shadow-kiosk',
    outline: 'bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-50 shadow-kiosk',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-kiosk',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-kiosk',
  };
  
  const sizeClasses = {
    small: 'min-h-touch px-6 py-3 text-kiosk-sm',
    medium: 'min-h-touch-lg px-8 py-4 text-kiosk-base',
    large: 'min-h-touch-xl px-10 py-5 text-kiosk-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      {loading && (
        <div className="spinner border-t-white"></div>
      )}
      {!loading && icon && <span className="text-2xl">{icon}</span>}
      {!loading && <span>{children}</span>}
    </button>
  );
};

export default Button;
