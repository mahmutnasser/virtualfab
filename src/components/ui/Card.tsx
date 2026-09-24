import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark' | 'feedback-correct' | 'feedback-wrong';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'light', className = '', children, ...props }, ref) => {
    const baseStyles = 'rounded-[16px] p-4 md:p-6 transition-colors';

    const variantStyles = {
      light:
        'bg-white text-text-primary border border-slate-200/80 shadow-sm',
      dark: 'bg-brand-navy/90 text-text-on-dark border border-white/10 backdrop-blur-md shadow-lg',
      'feedback-correct':
        'bg-[#ECFDF5] text-[#065F46] border border-status-success/30 border-l-[6px] border-l-status-success shadow-sm',
      'feedback-wrong':
        'bg-[#FFFBEB] text-[#92400E] border border-status-amber/30 border-l-[6px] border-l-status-amber shadow-sm',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export default Card;
