import React from 'react';

export interface KeyIdeaProps {
  text?: string;
  className?: string;
}

export const KeyIdea: React.FC<KeyIdeaProps> = ({
  text = 'Builds the layer stack, one step at a time.',
  className = '',
}) => {
  return (
    <div
      className={`p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 select-none ${className}`.trim()}
    >
      <span className="text-xl shrink-0" aria-hidden="true">
        💡
      </span>
      <div>
        <span className="font-display font-bold text-xs uppercase tracking-wider text-amber-900 block">
          KEY IDEA
        </span>
        <p className="font-body text-sm font-medium text-amber-950 mt-0.5 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
};

export default KeyIdea;
