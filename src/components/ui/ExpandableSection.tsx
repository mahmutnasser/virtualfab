import React, { useState, useId } from 'react';

export interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  id?: string;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  id: customId,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const generatedId = useId();
  const contentId = customId ? `${customId}-content` : `expandable-${generatedId}`;

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div
      className={`border border-slate-200/60 dark:border-white/10 rounded-[12px] overflow-hidden transition-colors ${className}`.trim()}
    >
      <h3>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className="w-full flex items-center justify-between p-4 text-left font-body font-semibold text-base transition-colors hover:bg-slate-100/50 dark:hover:bg-white/5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-brand-cyan focus-visible:outline-offset-[-2px] cursor-pointer"
        >
          <span>{title}</span>
          <svg
            className={`w-5 h-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none text-current opacity-70 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </h3>
      <div
        id={contentId}
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-1 border-t border-slate-100 dark:border-white/5 text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandableSection;
