import React from 'react';

export interface SkipLinkProps {
  targetId?: string;
  children?: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  children = 'Skip to main content',
  className = '',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className={`sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-brand-cyan focus:text-brand-navy focus:font-body focus:font-bold focus:rounded-[10px] focus:shadow-xl focus:outline focus:outline-[3px] focus:outline-brand-cyan focus:outline-offset-2 ${className}`.trim()}
    >
      {children}
    </a>
  );
};

export default SkipLink;
