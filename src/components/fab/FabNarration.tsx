import React from 'react';

export interface FabNarrationProps {
  onExploreProcess?: () => void;
  className?: string;
}

export const FabNarration: React.FC<FabNarrationProps> = ({
  onExploreProcess,
  className = '',
}) => {
  return (
    <div
      className={`max-w-[420px] w-full bg-white/95 border border-slate-200/80 backdrop-blur-xl rounded-2xl p-5 shadow-2xl shadow-slate-900/15 text-slate-800 select-none ${className}`.trim()}
    >
      <div className="flex items-start gap-4">
        {/* 3D Wafer Cylinder Stack Graphic */}
        <div
          className="w-16 h-16 shrink-0 relative flex items-center justify-center"
          aria-hidden="true"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top wafer disc glow */}
            <ellipse
              cx="32"
              cy="22"
              rx="24"
              ry="10"
              fill="#00A6A6"
              fillOpacity="0.25"
              stroke="#00A6A6"
              strokeWidth="1.5"
            />
            {/* Cylinder body */}
            <path
              d="M8 22v16c0 5.5 10.7 10 24 10s24-4.5 24-10V22"
              stroke="#00A6A6"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              strokeOpacity="0.6"
            />
            {/* Bottom wafer disc with silicon grid */}
            <ellipse
              cx="32"
              cy="38"
              rx="24"
              ry="10"
              fill="#F0F4F8"
              fillOpacity="0.9"
              stroke="#00A6A6"
              strokeWidth="1.5"
            />
            {/* Interior wafer grid pattern lines */}
            <path
              d="M16 38h32 M24 33v10 M32 30v14 M40 33v10"
              stroke="#00A6A6"
              strokeOpacity="0.4"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Text Content */}
        <div className="flex-1 flex flex-col items-start">
          <p className="font-display text-sm font-bold text-[#102a43] leading-snug tracking-tight mb-1.5">
            Follow one wafer through a simplified patterning cycle.
          </p>
          <p className="font-body text-xs text-slate-600 leading-relaxed mb-3">
            See how each step adds, changes, or removes material &mdash; and how
            many cycles build a modern chip.
          </p>
          <button
            type="button"
            onClick={onExploreProcess}
            className="text-xs font-semibold text-[#007f7f] hover:text-[#005f5f] inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>Explore the Process</span>
            <span className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FabNarration;
