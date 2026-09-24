import React from 'react';

export interface FabBasicsHeroProps {
  onStartWithWafer: () => void;
  onBrowseAllTerms: () => void;
  className?: string;
}

export const FabBasicsHero: React.FC<FabBasicsHeroProps> = ({
  onStartWithWafer,
  onBrowseAllTerms,
  className = '',
}) => {
  return (
    <section
      id="basics-top"
      aria-labelledby="hero-title"
      className={`relative overflow-hidden bg-white pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-slate-200/80 ${className}`.trim()}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: ~42% Editorial Introduction */}
          <div className="lg:col-span-5 space-y-6 text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-[#00A6A6] animate-pulse" aria-hidden="true" />
              <span className="font-semibold text-[#102A43]">FOUNDATION MODULE</span>
              <span className="text-slate-400">·</span>
              <span>5–10 min visual sequence</span>
            </div>

            <div className="space-y-3">
              <span className="text-xs tracking-wider uppercase text-slate-500 font-semibold block">
                Silicon Journey · Fab Basics
              </span>
              <h1
                id="hero-title"
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#102A43] tracking-tight leading-[1.12]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Speak the Language of the Fab
              </h1>
            </div>

            <p className="font-body text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Before entering the cleanroom, explore the physical objects, nanometer dimensions, and chemical transformations that turn raw silicon discs into billions of functioning transistors.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onStartWithWafer}
                className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#102A43] hover:bg-[#1B3D5E] active:bg-[#0C1E33] text-white text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00A6A6] focus-visible:outline-offset-2"
              >
                <span>Start with the Wafer</span>
                <svg className="w-4 h-4 text-[#00A6A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </button>

              <button
                type="button"
                onClick={onBrowseAllTerms}
                className="min-h-[46px] px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold transition-all shadow-xs hover:border-slate-300 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00A6A6] focus-visible:outline-offset-2"
              >
                Browse All Terms (28)
              </button>
            </div>

            {/* Quick Metrics Bar - Inter text with Plex Mono values */}
            <div className="pt-5 border-t border-slate-100 grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="text-xs text-slate-500 block font-medium">Substrate</span>
                <span className="font-mono font-bold text-sm text-[#102A43]">300 mm Silicon</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block font-medium">Min. Feature</span>
                <span className="font-mono font-bold text-sm text-[#00A6A6]">Nanoscale</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block font-medium">Curriculum</span>
                <span className="text-sm font-semibold text-[#102A43]">5 Visual Lessons</span>
              </div>
            </div>
          </div>

          {/* RIGHT: ~58% Dominant Visual Showcase (Cleanroom Wafer Photo Asset) */}
          <div className="lg:col-span-7 flex justify-center items-center relative order-1 lg:order-2">
            
            {/* Ambient Cleanroom Glow */}
            <div
              className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-cyan-100/30 via-slate-100/40 to-blue-100/20 blur-2xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Hero Visual Container: Real 300 mm Silicon Wafer in Cleanroom */}
            <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg bg-slate-900 group">
              <img
                src="/images/basics/hero-wafer-cleanroom.jpg"
                alt="Semiconductor technician in cleanroom holding a 300 mm silicon wafer showing vibrant rainbow diffraction pattern across printed microchip dies"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
                loading="eager"
              />

              {/* Subtle Live Annotation Overlay Badge */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-white shadow-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00A6A6] animate-pulse" />
                <span className="text-xs font-semibold">300 mm Silicon Wafer</span>
                <span className="text-slate-400 text-xs hidden sm:inline">· Monocrystalline Substrate</span>
              </div>

              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 text-white font-mono text-xs hidden sm:flex items-center gap-1.5">
                <span className="text-[#00A6A6]">Ø</span> 300 mm (~12 in)
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FabBasicsHero;
