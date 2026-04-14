import React from 'react';

const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-kiosk-base font-semibold text-gray-700 mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-6 py-4
          text-kiosk-base
          bg-white border-2 rounded-kiosk
          ${error ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'}
          focus:outline-none focus:ring-4 focus:ring-primary-200
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200
          resize-none
        `}
      />
      <div className="flex justify-between items-center mt-2">
        {error ? (
          <p className="text-kiosk-sm text-red-600 font-medium">{error}</p>
        ) : (
          <div></div>
        )}
        {maxLength && (
          <p className="text-kiosk-sm text-gray-500">
            {value?.length || 0}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

export default Textarea;
