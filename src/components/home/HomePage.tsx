import React from 'react';
import SiteHeader from '../app/SiteHeader';

interface HomePageProps {
  onOpenBasics: () => void;
  onOpenFab: () => void;
}

const Arrow = () => <span aria-hidden="true">→</span>;

export const HomePage: React.FC<HomePageProps> = ({ onOpenBasics, onOpenFab }) => (
  <div className="min-h-screen bg-white font-body text-[#102A43] selection:bg-[#D9E9FF]">
    <SiteHeader activeSection="home" onOpenHome={() => document.getElementById('main-content')?.scrollIntoView?.()} onOpenBasics={onOpenBasics} onOpenFab={onOpenFab} />

    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <section aria-labelledby="home-heading" className="relative overflow-hidden bg-[linear-gradient(130deg,#F9FCFF,#EAF2FF)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 mx-auto hidden max-w-7xl grid-cols-4 divide-x divide-[#E2EBF7] lg:grid" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-9 px-5 pb-14 pt-10 sm:px-8 sm:pt-16 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:pb-24 lg:pt-20">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#145DB4]">Silicon Journey / An interactive learning experience</p>
            <h1 id="home-heading" className="mt-7 font-display text-[clamp(2.55rem,5vw,4.7rem)] font-bold leading-[1.08] tracking-[-0.05em]">
              See how a chip <span className="block text-[#166FE5]">takes shape.</span>
            </h1>
            <div className="mt-6 h-1 w-12 bg-[#166FE5]" aria-hidden="true" />
            <p className="mt-7 max-w-[52ch] text-base leading-7 text-[#476176] sm:text-lg sm:leading-8">From a 300 mm wafer to nanoscale features, follow the science and decisions behind every layer.</p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
              <button type="button" onClick={onOpenBasics} className="inline-flex min-h-[50px] w-full items-center justify-between gap-5 rounded-lg bg-[#166FE5] px-5 text-sm font-bold text-white hover:bg-[#145DB4] sm:w-auto">
                Start with Fab Basics <Arrow />
              </button>
              <button type="button" onClick={onOpenFab} className="inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-[#145DB4] hover:underline">Explore Virtual Fab <Arrow /></button>
            </div>
          </div>

          <figure className="overflow-hidden rounded-[4px] bg-white">
            <img src="/images/basics/hero-wafer-cleanroom.jpg" alt="A cleanroom operator holds a patterned silicon wafer showing iridescent rectangular fields" className="aspect-[1.28] w-full object-cover object-center sm:aspect-[1.5] lg:aspect-[1.45]" fetchPriority="high" />
            <figcaption className="flex items-center justify-between gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#145DB4] sm:px-6">
              <span>01 / The wafer</span><span className="text-[#667F94]">300 mm</span>
            </figcaption>
          </figure>
        </div>
        <div className="relative mx-auto max-w-7xl px-5 pb-5 sm:px-8 lg:px-10">
          <p className="border-b border-[#BBD0E9] pb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#145DB4]">Learn the structure</p>
        </div>
      </section>

      <section aria-label="Learning path" className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ol className="grid divide-y divide-[#DCE5F2] border-b border-[#DCE5F2] py-2 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:py-8">
          {[
            ['01', 'Fab Basics', 'Understand the ideas'],
            ['02', 'Virtual Fab', 'Follow the process'],
            ['03', 'Wafer Lab', 'Inspect the result'],
          ].map(([number, title, description]) => (
            <li key={number} className="flex gap-6 py-5 sm:px-5 sm:py-0 first:sm:pl-0">
              <span className="pt-1 text-sm font-bold text-[#166FE5]">{number}</span>
              <div><h2 className="font-display text-xl font-bold">{title}</h2><p className="mt-1 text-sm text-[#476176]">{description}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="scale-intro-heading" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#145DB4]">From the visible to the invisible</p>
        <h2 id="scale-intro-heading" className="mt-5 font-display text-3xl font-bold tracking-[-0.04em] sm:text-4xl">One journey. Many scales.</h2>
        <p className="mt-4 text-base leading-7 text-[#476176]">Explore a connected story of patterns, materials, and tools.</p>

        <div className="mt-10 grid overflow-hidden rounded-[4px] lg:grid-cols-2">
          <img src="/images/basics/patterning-02-optical-exposure.png" alt="Conceptual rendering of light transferring a pattern onto photoresist" className="h-56 w-full object-cover sm:h-72 lg:h-full" loading="lazy" />
          <div className="flex flex-col items-start justify-center bg-[#EAF2FF] p-7 sm:p-10 lg:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#145DB4]">01 / Fab Basics</p>
            <h3 className="mt-6 max-w-[17ch] font-display text-3xl font-bold leading-[1.15] tracking-[-0.04em] sm:text-4xl">See the pattern before the process.</h3>
            <p className="mt-5 max-w-[45ch] text-base leading-7 text-[#476176]">Start with scale, lithography, and the six steps that transfer an image into silicon.</p>
            <button type="button" onClick={onOpenBasics} className="mt-7 inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-[#145DB4] hover:underline">Explore the fundamentals <Arrow /></button>
          </div>
        </div>
      </section>
    </main>

    <footer className="border-t border-[#DCE5F2] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-[#667F94] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <span className="font-display font-bold uppercase tracking-wide text-[#102A43]">Silicon Journey</span>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-5">
          <button type="button" onClick={onOpenBasics} className="min-h-[44px] text-[#145DB4] hover:underline">Fab Basics</button>
          <button type="button" onClick={onOpenFab} className="min-h-[44px] text-[#145DB4] hover:underline">Virtual Fab</button>
        </nav>
      </div>
    </footer>
  </div>
);

export default HomePage;
