import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer';

  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/25 focus:ring-indigo-500',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-md focus:ring-slate-900',
    outline: 'border-2 border-slate-300 bg-white hover:border-indigo-600 text-slate-800 hover:text-indigo-600 focus:ring-indigo-500 shadow-xs',
    'outline-light': 'border-2 border-white/40 bg-white/10 hover:bg-white/20 text-white focus:ring-white shadow-xs',
    white: 'bg-white text-slate-900 hover:bg-slate-100 shadow-lg focus:ring-white',
    ghost: 'text-slate-800 hover:text-indigo-600 hover:bg-slate-100 focus:ring-slate-300',
    accent: 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white shadow-lg shadow-cyan-500/25 focus:ring-cyan-500',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md focus:ring-rose-500'
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-4.5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-bold',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-4.5 h-4.5'} />}
      <span>{children}</span>
    </button>
  );
};
