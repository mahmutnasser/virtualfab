import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'small';
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'default',
      loading = false,
      loadingText = 'Loading…',
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-body font-semibold select-none rounded-[10px] transition-all duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-brand-cyan focus-visible:outline-offset-2';

    const variantStyles = {
      primary:
        'bg-brand-cyan text-brand-navy hover:brightness-110 active:brightness-95 shadow-sm',
      secondary:
        'border border-brand-blue/40 text-brand-blue hover:bg-brand-blue/10 active:bg-brand-blue/20 bg-transparent',
      ghost:
        'bg-transparent text-brand-cyan hover:bg-brand-cyan/10 active:bg-brand-cyan/20',
    };

    const sizeStyles = {
      default: 'min-h-[44px] px-5 py-2.5 text-base',
      small: 'min-h-[36px] px-3.5 py-1.5 text-sm',
    };

    const widthStyle = fullWidth ? 'w-full' : '';
    const stateStyle =
      disabled || loading
        ? 'opacity-50 cursor-not-allowed pointer-events-none'
        : 'cursor-pointer';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading ? 'true' : undefined}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${stateStyle} ${className}`.trim()}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{loadingText}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
