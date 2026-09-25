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
      className={`relative overflow-hidden rounded-[2rem] bg-[#FAFCFF] px-2 py-10 sm:px-4 sm:py-16 ${className}`.trim()}
      style={{ backgroundImage: 'radial-gradient(#DFEAF7 1px, transparent 1px)', backgroundSize: '24px 24px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: ~42% Editorial Introduction */}
          <div className="lg:col-span-5 space-y-6 text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EAF2FF] text-[#145DB4] text-xs font-bold tracking-wide">
              VISUAL LEARNING PATH
            </div>

            <div className="space-y-3">
              <h1
                id="hero-title"
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-[#173348] tracking-tight leading-[1.15]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                A clearer view of how chips are made.
              </h1>
            </div>

            <p className="font-body text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Explore the objects, patterns, and material changes inside a semiconductor fab—one visible step at a time.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onStartWithWafer}
                className="min-h-[48px] px-6 py-2.5 rounded-xl bg-[#166FE5] hover:bg-[#145DB4] text-white text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5] focus-visible:outline-offset-2"
              >
                <span>Explore the scale journey</span>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </button>

              <button
                type="button"
                onClick={onBrowseAllTerms}
                className="min-h-[48px] px-5 py-2.5 rounded-xl bg-white hover:bg-[#EAF2FF] border border-[#B8D1F7] text-[#145DB4] text-sm font-semibold transition-all shadow-xs cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5] focus-visible:outline-offset-2"
              >
                Browse terms
              </button>
            </div>

            <div className="pt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-600" aria-label="Learning sequence">
              <span className="text-[#145DB4]">01 Wafer to feature</span>
              <span>02 Patterning</span>
              <span>03 Fab vocabulary</span>
            </div>
          </div>

          {/* RIGHT: ~58% Dominant Visual Showcase (Cleanroom Wafer Photo Asset) */}
          <div className="lg:col-span-7 flex justify-center items-center relative order-1 lg:order-2">
            
            {/* Ambient Cleanroom Glow */}
            <div
              className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-blue-100/50 via-slate-100/40 to-blue-100/20 blur-2xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Hero Visual Container: Real 300 mm Silicon Wafer in Cleanroom */}
            <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border-[14px] border-white shadow-lg bg-[#EDF3FA] group">
              <img
                src="/images/basics/hero-wafer-cleanroom.jpg"
                alt="Semiconductor technician in cleanroom holding a 300 mm silicon wafer showing vibrant rainbow diffraction pattern across printed microchip dies"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
                loading="eager"
              />

              {/* Subtle Live Annotation Overlay Badge */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg border border-[#DCE5F2] text-[#173348] shadow-md flex items-center gap-2">
                <span className="text-xs font-semibold">300 mm patterned wafer</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FabBasicsHero;
