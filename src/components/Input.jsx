import React from 'react';

const Input = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  required = false,
  disabled = false,
  maxLength,
  className = '',
  inputMode,
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-kiosk-base font-semibold text-gray-700 mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        inputMode={inputMode}
        className={`
          w-full min-h-touch-lg px-6 py-4
          text-kiosk-base
          bg-white border-2 rounded-kiosk
          ${error ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'}
          focus:outline-none focus:ring-4 focus:ring-primary-200
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200
        `}
      />
      {error && (
        <p className="mt-2 text-kiosk-sm text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
