import React from 'react';
import ProcessMapDisclosure from './ProcessMapDisclosure';
import FabOverviewHero from './FabOverviewHero';

export interface FabHUDProps {
  activeStepId?: string;
  completedStepIds?: string[];
  onSelectStep?: (stepId: string) => void;
  onStartTour?: () => void;
  onOpenBasics?: () => void;
  className?: string;
}

export const FabHUD: React.FC<FabHUDProps> = ({
  activeStepId = 'deposition',
  completedStepIds = ['start'],
  onSelectStep,
  onStartTour,
  onOpenBasics,
  className = '',
}) => (
  <div className={`min-h-full bg-[#F6F9FE] text-[#102A43] ${className}`.trim()}>
    <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-9 sm:px-6 lg:px-8 lg:pt-11">
      <header className="mb-8 lg:mb-9">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#145DB4]">Virtual Fab / Cleanroom overview</p>
        <h1 aria-label="Virtual Fab cleanroom overview" className="font-display text-[clamp(2.3rem,4vw,3.4rem)] font-bold leading-[1.08] tracking-[-0.04em]">
          <span className="hidden md:inline">Follow a wafer through the fab.</span>
          <span className="md:hidden">Step into the cleanroom.</span>
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-[#476176] sm:text-lg sm:leading-7">
          <span className="hidden md:inline">Choose a station, inspect the wafer, and see what changes at every step.</span>
          <span className="md:hidden">Follow a wafer through the tools and see what changes at each station.</span>
        </p>
      </header>

      <section aria-label="Cleanroom introduction" className="relative">
        <picture>
          <source media="(max-width: 767px)" srcSet="/images/plates/mobile_overview.jpg" />
          <img
            src="/images/plates/fab_overview.jpg"
            alt="Bright semiconductor cleanroom with process equipment along the aisle"
            className="h-[min(128vw,520px)] w-full rounded-lg object-cover object-center md:h-[clamp(500px,48vw,640px)]"
            fetchPriority="high"
          />
        </picture>

        <div className="absolute left-7 top-10 hidden md:block lg:left-10">
          <FabOverviewHero onStartTour={onStartTour} onOpenBasics={onOpenBasics} />
        </div>

        <div className="absolute bottom-5 left-5 right-5 rounded-md bg-white px-4 py-3 shadow-lg md:hidden">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#145DB4]">Cleanroom overview</p>
          <p className="mt-1 text-sm font-semibold text-[#102A43]">6 stations / one connected process</p>
        </div>
      </section>

      <div className="mt-5 md:hidden">
        <button type="button" onClick={onStartTour} className="flex min-h-[52px] w-full items-center justify-between rounded-lg bg-[#166FE5] px-5 text-sm font-bold text-white hover:bg-[#145DB4] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#166FE5] focus-visible:outline-offset-2">
          Start the guided tour <span aria-hidden="true">→</span>
        </button>
        <button type="button" onClick={onOpenBasics} className="mt-2 min-h-[44px] text-sm font-bold text-[#145DB4] hover:underline">Start with Fab Basics →</button>
      </div>

      <div className="relative z-20 mt-7 md:mt-0">
        <ProcessMapDisclosure variant="overview" activeStepId={activeStepId} completedStepIds={completedStepIds} onSelectStep={(stepId) => onSelectStep?.(stepId)} />
      </div>

      <section aria-labelledby="fab-explore-heading" className="pt-16 lg:pt-20">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#145DB4]">What you can explore</p>
        <h2 id="fab-explore-heading" className="mt-5 font-display text-3xl font-bold tracking-[-0.035em] sm:text-4xl">See the process. Inspect the result.</h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#476176]">A guided tour for the big picture, with deeper controls when you want them.</p>
        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {[
            ['01', 'The station', 'Understand the equipment and its role.'],
            ['02', 'The wafer', 'Compare the cross-section before and after.'],
            ['03', 'The evidence', 'Inspect measurements and source notes.'],
          ].map(([number, title, description]) => (
            <li key={number} className="border-t-2 border-[#BBD0E9] pt-7">
              <span className="text-sm font-bold text-[#166FE5]">{number}</span>
              <h3 className="mt-5 font-display text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#476176]">{description}</p>
            </li>
          ))}
        </ol>
        <div className="mt-14 border-t border-[#DCE5F2] pt-6 text-sm text-[#476176]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#145DB4]">Real fab reference</p>
          <a href="https://www.youtube.com/watch?v=5a8xjH2tOkM" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-[44px] items-center font-semibold text-[#145DB4] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5]">
            Watch Texas Instruments’ 300mm wafer fab virtual tour <span aria-hidden="true" className="ml-2">↗</span>
          </a>
          <p className="text-xs text-[#667F94]">4 min 31 sec · Opens on YouTube</p>
        </div>
      </section>
    </div>
  </div>
);

export default FabHUD;
