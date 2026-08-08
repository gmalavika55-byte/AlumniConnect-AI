import React from 'react';

export const Badge = ({
  children,
  variant = 'brand',
  size = 'md',
  icon: Icon,
  className = ''
}) => {
  const base = 'inline-flex items-center font-medium rounded-full transition-colors duration-150';

  const variants = {
    brand: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200/60',
    accent: 'bg-cyan-50 text-cyan-800 border border-cyan-200/60',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/60',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200',
    gradient: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-xs gap-1.5 font-semibold',
    lg: 'px-3.5 py-1.5 text-sm gap-2 font-semibold'
  };

  return (
    <span className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {Icon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      {children}
    </span>
  );
};
