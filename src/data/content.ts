export const APP_CONTENT = {
  brand: {
    title: 'Silicon Journey',
    tagline: 'Explore • Learn • Build • What’s Next',
    subApp: 'Virtual Fab',
  },

  fabOverview: {
    heroHeading: 'Fab Overview',
    heroSubtitle:
      'Step inside a modern semiconductor fab and explore how atomic-scale materials become the chips that power our world.',
    startTourCTA: 'Start the Tour',
    watchIntroCTA: 'Watch Intro',
    watchIntroDuration: '2 min',
    narrationHeading: 'Follow one wafer through a simplified patterning cycle.',
    narrationBody:
      'See how each step adds, changes, or removes material — and how many cycles build a modern chip.',
    exploreProcessCTA: 'Explore the Process →',
  },

  stationFocus: {
    ctaInspect: 'Open Wafer Lab →',
    ctaBack: '← Back to Fab Overview',
    whyThisStepToggle: 'Why this step?',
    learningExampleTitle: 'LEARNING EXAMPLE',
  },

  waferLab: {
    exitToFabCTA: 'Exit to Fab World',
    scientificCrossSectionTitle: 'SCIENTIFIC CROSS-SECTION',
    architectureHeading: 'Wafer Layer Architecture',
    scaleNotice: 'Cross-section diagram • Not to scale',
    keyIdeaDeposition:
      'Deposition builds the layer stack by adding thin films to the wafer. Some deposited films are only nanometers thick.',
    engineeringViewDeposition: 'Engineering View • Film Deposition Mechanics',
    sourcesViewTitle: 'Sources • Scientific References',
    notToScaleWatermark: 'CROSS-SECTION VIEW • NOT TO SCALE',
    zAxisProfileLabel: 'Z-Axis Depth Profile',
  },

  announcements: {
    startTour: 'Starting the tour at Step 1 of 6: Deposition.',
    selectStep: (stepNumber: number | string, name: string) =>
      `Selected Step ${stepNumber} of 6: ${name}.`,
    selectSetupStep: (name: string) => `Selected ${name}.`,
    selectCheckpoint: (checkpointKind: string, name: string) =>
      `Selected Checkpoint ${checkpointKind}: ${name}.`,
    openWaferLab: (name: string) => `Opening Wafer Lab for ${name}.`,
    returnToFab: 'Returned to Fab Overview.',
    depositionComplete:
      'Deposition completed. A thin film of silicon dioxide has been deposited across the wafer surface.',
  },
};
