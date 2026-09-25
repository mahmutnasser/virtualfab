import React from 'react';

interface HomePageProps {
  onOpenBasics: () => void;
  onOpenFab: () => void;
}

const Arrow = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 10h12m0 0-5-5m5 5-5 5" />
  </svg>
);

export const HomePage: React.FC<HomePageProps> = ({ onOpenBasics, onOpenFab }) => (
  <div className="min-h-screen bg-[#F6F9FE] font-body text-[#173348] selection:bg-[#D9E9FF]">
    <header className="sticky top-0 z-30 border-b border-[#DFE8F4] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5" aria-label="Silicon Journey">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#166FE5] font-display text-xs font-bold tracking-wide text-white shadow-sm">SJ</span>
          <span className="hidden font-display text-lg font-bold tracking-tight text-[#173348] sm:inline">Silicon Journey</span>
        </div>
        <nav aria-label="Explore sections" className="flex items-center gap-1 sm:gap-2">
          <span aria-current="page" className="inline-flex min-h-[44px] items-center rounded-lg bg-[#EAF2FF] px-2 text-xs font-semibold text-[#145DB4] sm:px-3 sm:text-sm">Home</span>
          <button type="button" onClick={onOpenBasics} className="min-h-[44px] rounded-lg px-2 text-xs font-semibold text-[#314B63] hover:bg-[#EAF2FF] hover:text-[#145DB4] sm:px-3 sm:text-sm">Fab Basics</button>
          <button type="button" onClick={onOpenFab} className="min-h-[44px] rounded-lg bg-[#166FE5] px-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#145DB4] sm:px-4 sm:text-sm">Virtual Fab</button>
        </nav>
      </div>
    </header>

    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <section aria-labelledby="home-heading" className="relative isolate overflow-hidden bg-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-44 -top-48 h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,#D8E9FF_0%,#EFF6FF_46%,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#CFE1FB] bg-[#F0F6FF] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#145DB4]">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#166FE5]" />
              A visual learning journey
            </p>
            <h1 id="home-heading" className="font-display text-[clamp(2.7rem,5.1vw,5rem)] font-bold leading-[1.06] tracking-[-0.05em] text-[#102A43]">
              See how a chip <span className="text-[#166FE5]">takes shape.</span>
            </h1>
            <p className="mt-6 max-w-[55ch] text-base leading-8 text-[#476176] sm:text-lg">
              Silicon Journey makes semiconductor manufacturing easier to explore. Start at the scale of a wafer, learn how patterns are made, then follow a wafer through an interactive fab.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onOpenBasics} className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#166FE5] px-6 text-sm font-bold text-white shadow-[0_8px_24px_rgba(22,111,229,0.18)] transition-colors hover:bg-[#145DB4]">
                Start with Fab Basics <Arrow />
              </button>
              <button type="button" onClick={onOpenFab} className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-[#C9D8E9] bg-white px-6 text-sm font-bold text-[#145DB4] transition-colors hover:border-[#166FE5] hover:bg-[#F4F8FF]">
                Explore Virtual Fab <Arrow />
              </button>
            </div>
            <p className="mt-5 text-sm text-[#667F94]">Built for curious learners and early engineering students.</p>
          </div>

          <figure className="overflow-hidden rounded-[28px] border border-[#DBE5F2] bg-[#EAF2FF] shadow-[0_24px_60px_rgba(26,64,112,0.14)]">
            <img src="/images/basics/hero-wafer-cleanroom.jpg" alt="A cleanroom operator holds a patterned silicon wafer showing iridescent rectangular fields" className="aspect-[4/3] w-full object-cover object-center sm:aspect-[16/11] lg:aspect-[4/3]" fetchPriority="high" />
            <figcaption className="flex items-center justify-between gap-3 bg-white px-4 py-3 text-xs text-[#476176] sm:px-5 sm:text-sm">
              <span className="font-semibold text-[#173348]">A wafer is where the journey begins.</span>
              <span className="shrink-0 font-mono text-[#145DB4]">01 / EXPLORE</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="paths-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#166FE5]">Choose your path</p>
          <h2 id="paths-heading" className="mt-3 font-display text-3xl font-bold tracking-tight text-[#102A43] sm:text-4xl">Two ways to begin exploring</h2>
          <p className="mt-4 text-base leading-7 text-[#526A7D]">Learn the concepts at your own pace, or step straight into the process. You can move between both sections at any time.</p>
        </div>
        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          <article className="group flex flex-col overflow-hidden rounded-[24px] border border-[#DFE8F4] bg-white shadow-[0_12px_30px_rgba(31,70,118,0.05)]">
            <div className="relative h-44 overflow-hidden bg-[#EAF2FF] sm:h-52">
              <img src="/images/basics/patterning-02-optical-exposure.png" alt="Conceptual rendering of light transferring a pattern onto photoresist" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <span className="font-mono text-xs font-semibold tracking-[0.13em] text-[#166FE5]">01 / UNDERSTAND</span>
              <h3 className="mt-3 font-display text-2xl font-bold text-[#102A43]">Fab Basics</h3>
              <p className="mt-3 flex-1 leading-7 text-[#526A7D]">Zoom from wafer to nanoscale feature, see how patterning works, compare lithography optics, and build a useful process vocabulary.</p>
              <button type="button" onClick={onOpenBasics} className="mt-6 inline-flex min-h-[44px] w-fit items-center gap-2 rounded-lg font-bold text-[#145DB4] hover:text-[#0D4A9E]">
                Explore Fab Basics <Arrow />
              </button>
            </div>
          </article>
          <article className="group flex flex-col overflow-hidden rounded-[24px] border border-[#DFE8F4] bg-white shadow-[0_12px_30px_rgba(31,70,118,0.05)]">
            <div className="relative flex h-44 items-center overflow-hidden bg-[linear-gradient(125deg,#0C1E33,#173E68)] px-7 sm:h-52 sm:px-10">
              <div aria-hidden="true" className="absolute -right-12 -top-20 h-72 w-72 rounded-full border-[36px] border-[#2E75BA]/35 shadow-[0_0_0_40px_rgba(67,148,226,0.1)]" />
              <div aria-hidden="true" className="absolute bottom-8 right-12 h-20 w-20 rounded-full border border-[#74C4F5]/40 bg-[#9BD5FF]/10 shadow-[0_0_50px_rgba(89,173,244,0.4)]" />
              <div className="relative border-l-2 border-[#64B7F2] pl-5 text-white">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#A6D8FA]">Interactive process</p>
                <p className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Inside the fab</p>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <span className="font-mono text-xs font-semibold tracking-[0.13em] text-[#166FE5]">02 / EXPERIMENT</span>
              <h3 className="mt-3 font-display text-2xl font-bold text-[#102A43]">Virtual Fab</h3>
              <p className="mt-3 flex-1 leading-7 text-[#526A7D]">Explore the cleanroom, visit process stations, and inspect how deposition, lithography, etching, and stripping change a wafer.</p>
              <button type="button" onClick={onOpenFab} className="mt-6 inline-flex min-h-[44px] w-fit items-center gap-2 rounded-lg font-bold text-[#145DB4] hover:text-[#0D4A9E]">
                Enter Virtual Fab <Arrow />
              </button>
            </div>
          </article>
        </div>
      </section>

      <section aria-labelledby="journey-heading" className="border-y border-[#DCE7F5] bg-[#EAF2FF]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#166FE5]">A connected learning path</p>
          <h2 id="journey-heading" className="mt-3 font-display text-2xl font-bold tracking-tight text-[#102A43] sm:text-3xl">From the big picture to the process details</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['01', 'See the scale', 'Move from a whole wafer to the structures inside a chip.'],
              ['02', 'Learn the steps', 'Understand the patterning cycle and the tools behind it.'],
              ['03', 'Inspect the result', 'Use the Virtual Fab and Wafer Lab to follow changes in cross-section.'],
            ].map(([number, title, description]) => (
              <li key={number} className="rounded-2xl border border-[#D5E3F4] bg-white p-6">
                <span className="font-mono text-sm font-semibold text-[#166FE5]">{number}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-[#102A43]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#526A7D]">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>

    <footer className="bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-[#667F94] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span className="font-display font-bold text-[#173348]">Silicon Journey</span>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-5">
          <button type="button" onClick={onOpenBasics} className="min-h-[44px] text-[#145DB4] hover:underline">Fab Basics</button>
          <button type="button" onClick={onOpenFab} className="min-h-[44px] text-[#145DB4] hover:underline">Virtual Fab</button>
        </nav>
      </div>
    </footer>
  </div>
);

export default HomePage;
