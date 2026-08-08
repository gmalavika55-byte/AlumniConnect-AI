import React from 'react';

export const Input = ({
  label,
  error,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full text-sm rounded-xl border bg-white/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400 ${
            Icon ? 'pl-11' : 'pl-4'
          } pr-4 py-2.5 ${
            error
              ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500'
              : 'border-slate-200/80 hover:border-slate-300'
          }`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};
