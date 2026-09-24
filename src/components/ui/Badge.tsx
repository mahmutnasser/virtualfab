import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'step' | 'completed' | 'active' | 'upcoming';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'step', className = '', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide select-none';

    const variantStyles = {
      step: 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 font-mono font-semibold uppercase',
      completed:
        'bg-status-success/15 text-status-success border border-status-success/30 font-body font-semibold',
      active:
        'bg-brand-cyan text-brand-navy border border-brand-cyan font-body font-bold',
      upcoming:
        'bg-slate-700/40 text-slate-300 border border-slate-600/50 font-body',
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`.trim()}
        {...props}
      >
        {variant === 'completed' && (
          <svg
            className="w-3.5 h-3.5 shrink-0 text-current"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
