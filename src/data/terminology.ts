/**
 * CANONICAL TERMINOLOGY REGISTRY — VF-014 FAB BASICS
 *
 * Provides structured educational vocabulary definitions, visual mappings,
 * station context links, and academic reference traceability.
 */

export type TermCategory =
  | 'scale'
  | 'patterning'
  | 'process'
  | 'measurement'
  | 'fab-logistics';

export interface BasicTerm {
  id: string;
  term: string;
  shortDefinition: string;
  whyItMatters: string;
  engineeringDefinition?: string;
  category: TermCategory;
  visualType: 'svg' | 'photo';
  visualAssetId?: string;
  relatedTermIds: string[];
  fabContexts: string[]; // e.g. ['start', 'deposition', 'coat', 'lithography', 'develop', 'adi', 'etch', 'aei', 'strip']
  sourceIds: string[]; // Traceable to SOURCE_REGISTRY in sources.ts
  reviewStatus: 'approved' | 'OPEN_SCIENTIFIC_REVIEW';
  accessibilityDescription: string;
}

export const CANONICAL_TERMS: BasicTerm[] = [
  // ─────────────────────────────────────────────────────────────
  // 01 — UNDERSTANDING SCALE
  // ─────────────────────────────────────────────────────────────
  {
    id: 'wafer',
    term: 'Wafer',
    shortDefinition:
      'A wafer is a thin, round slice of semiconductor—usually silicon—on which many chips are manufactured at the same time.',
    whyItMatters:
      'Fabricating hundreds or thousands of chips simultaneously on one large wafer lowers the manufacturing cost per chip.',
    engineeringDefinition:
      'Standard advanced manufacturing uses 300 mm diameter monocrystalline silicon wafers (~775 µm thick) cut from high-purity Czochralski ingots. Flatness and atomic purity are strictly controlled.',
    category: 'scale',
    visualType: 'svg',
    relatedTermIds: ['substrate', 'field', 'die', 'lot'],
    fabContexts: ['start', 'deposition', 'coat', 'lithography', 'develop', 'adi', 'etch', 'aei', 'strip'],
    sourceIds: ['SRC-FAB-PROCESS-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Circular 300 mm silicon wafer diagram with notch indicator and repetitive grid of chip areas.',
  },
  {
    id: 'field',
    term: 'Exposure Field',
    shortDefinition:
      'An exposure field is the rectangular area of the wafer patterned during one lithography exposure.',
    whyItMatters:
      'Lithography scanners pattern wafers step-by-step, exposing one rectangular field at a time across the entire wafer surface.',
    engineeringDefinition:
      'Modern step-and-scan lithography systems typically expose fields up to 26 mm × 33 mm in a single slit scan. One field commonly contains one large chip or multiple smaller dies.',
    category: 'scale',
    visualType: 'svg',
    relatedTermIds: ['wafer', 'die', 'lithography', 'reticle'],
    fabContexts: ['lithography', 'adi'],
    sourceIds: ['SRC-LITHO-EUV-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Wafer map highlighting one rectangular exposure field among repeated grid fields.',
  },
  {
    id: 'die',
    term: 'Die',
    shortDefinition:
      'A die is one individual chip area on the wafer. After manufacturing, individual dies can be separated and packaged.',
    whyItMatters:
      'The die is the fundamental functional product unit; dies are tested, cut apart (diced), and packaged into microprocessors, sensors, or memory chips.',
    engineeringDefinition:
      'A single processed wafer contains many identical dies separated by narrow scribe lines (streets). After wafer-level testing, diamond blades or lasers saw the wafer into individual dies for packaging.',
    category: 'scale',
    visualType: 'svg',
    relatedTermIds: ['field', 'feature', 'yield', 'wafer'],
    fabContexts: ['start', 'adi', 'aei'],
    sourceIds: ['SRC-FAB-PROCESS-01', 'SRC-SEMICON-MFG-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Detailed exposure field showing sub-divided grid of individual silicon chip dies.',
  },
  {
    id: 'feature',
    term: 'Feature',
    shortDefinition:
      'A feature is a small physical structure that forms part of the chip, such as a transistor structure, contact, or metal line.',
    whyItMatters:
      'Billions of micro- and nano-scale features work together to direct electricity and perform logic computations inside the device.',
    engineeringDefinition:
      'Features include transistor gate electrodes, fin sidewalls, source/drain contacts, and multi-level copper interconnects. Critical feature geometries define device speed and density.',
    category: 'scale',
    visualType: 'svg',
    relatedTermIds: ['die', 'layer', 'cd', 'pattern'],
    fabContexts: ['lithography', 'etch', 'aei'],
    sourceIds: ['SRC-DEVICE-ADV-01', 'SRC-METROLOGY-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Microscopic cross-section highlighting nanoscale transistor gate and contact features.',
  },
  {
    id: 'layer',
    term: 'Layer',
    shortDefinition:
      'A layer is a distinct level of patterned or blanket material within the vertical stack of the integrated circuit.',
    whyItMatters:
      'Modern microchips cannot be built on a single plane; they require dozens of stacked dielectric, semiconductor, and metal layers.',
    engineeringDefinition:
      'An integrated circuit stack comprises substrate doping layers, gate dielectric/conductor layers, contact vias, and multiple levels of copper metallization separated by low-k interlayer dielectrics.',
    category: 'scale',
    visualType: 'svg',
    relatedTermIds: ['substrate', 'deposition', 'pattern', 'feature'],
    fabContexts: ['deposition', 'etch', 'strip'],
    sourceIds: ['SRC-FAB-PROCESS-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Multi-layer semiconductor cross-section showing vertical stack of thin films and substrate.',
  },
  {
    id: 'substrate',
    term: 'Substrate',
    shortDefinition:
      'The substrate is the underlying semiconductor wafer material that physically supports all fabricated device layers.',
    whyItMatters:
      'The substrate provides mechanical stability and the initial crystal structure in which transistors are formed.',
    engineeringDefinition:
      'Typically monocrystalline silicon with specific crystallographic orientation (e.g. <100>) and intentional background dopant concentration to establish electrical baseline properties.',
    category: 'scale',
    visualType: 'svg',
    relatedTermIds: ['wafer', 'layer', 'deposition'],
    fabContexts: ['start', 'deposition'],
    sourceIds: ['SRC-FAB-PROCESS-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Polished bare silicon wafer base layer labeled as crystalline substrate.',
  },
  {
    id: 'pattern',
    term: 'Pattern',
    shortDefinition:
      'A pattern is the deliberate geometric layout of shapes and openings defined on a wafer layer.',
    whyItMatters:
      'Nanoscale geometric shapes define where materials conduct electricity, insulate charges, or switch currents.',
    engineeringDefinition:
      'Design layouts are generated by electronic design automation (EDA) software, fractured into mask data, and transferred through lithography and etch into physical material boundaries.',
    category: 'scale',
    visualType: 'svg',
    relatedTermIds: ['feature', 'reticle', 'lithography', 'etch'],
    fabContexts: ['lithography', 'develop', 'etch'],
    sourceIds: ['SRC-FAB-PROCESS-01', 'SRC-METROLOGY-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Geometric circuit layout showing circuit tracks and rectangular contact pads.',
  },

  // ─────────────────────────────────────────────────────────────
  // 02 — CREATING PATTERNS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'lithography',
    term: 'Lithography',
    shortDefinition:
      'Lithography is the optical process of transferring circuit patterns from a photomask onto a light-sensitive resist layer.',
    whyItMatters:
      'Lithography determines the smallest feature size possible in a manufacturing technology, dictating chip density.',
    engineeringDefinition:
      'Projection optical systems focus exposure radiation through a photomask reticle (typically with 4× optical reduction) onto photoresist to alter its chemical solubility.',
    category: 'patterning',
    visualType: 'svg',
    relatedTermIds: ['photoresist', 'reticle', 'duv', 'euv', 'cd'],
    fabContexts: ['lithography'],
    sourceIds: ['SRC-LITHO-EUV-01', 'SRC-METROLOGY-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Optical projection diagram showing light passing through reticle lens onto wafer.',
  },
  {
    id: 'photoresist',
    term: 'Photoresist',
    shortDefinition:
      'Photoresist is a light-sensitive polymer coated onto the wafer before lithography to form a temporary pattern stencil.',
    whyItMatters:
      'Photoresist acts as a sacrificial shield: exposure changes its chemistry so unwanted regions can be removed, leaving a protective mask for etching.',
    engineeringDefinition:
      'Photosensitive polymeric formulations containing photoacid generators (PAG) and dissolution inhibitors. In positive-tone resist, exposed areas become soluble in alkaline developer solutions (e.g. TMAH).',
    category: 'patterning',
    visualType: 'svg',
    relatedTermIds: ['lithography', 'develop', 'etch', 'strip'],
    fabContexts: ['coat', 'lithography', 'develop', 'strip'],
    sourceIds: ['SRC-FAB-PROCESS-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Cross-section showing purple photoresist layer coated over dielectric film.',
  },
  {
    id: 'reticle',
    term: 'Reticle / Mask',
    shortDefinition:
      'A reticle or mask contains the master geometric pattern used by the lithography system to pattern the wafer.',
    whyItMatters:
      'High-precision quartz or reflective plates hold the blueprint for one layer of the integrated circuit.',
    engineeringDefinition:
      'In DUV, transparent synthetic quartz plates coated with patterned absorbing chromium or phase-shifting material. In EUV, reflective Mo/Si multilayer substrates coated with EUV absorber patterns.',
    category: 'patterning',
    visualType: 'svg',
    relatedTermIds: ['lithography', 'field', 'duv', 'euv'],
    fabContexts: ['lithography'],
    sourceIds: ['SRC-LITHO-EUV-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Precision photomask reticle plate showing transparent apertures and dark absorber patterns.',
  },
  {
    id: 'duv',
    term: 'DUV Lithography',
    shortDefinition:
      'Deep Ultraviolet lithography uses 193 nm ultraviolet light to pattern microelectronic features and remains widely used across manufacturing.',
    whyItMatters:
      'DUV tools pattern the vast majority of layers in modern semiconductors cost-effectively and reliably.',
    engineeringDefinition:
      'Uses argon fluoride (ArF) excimer lasers producing 193 nm radiation. Immersion DUV (ArFi) places ultrapure water (n=1.44) between final lens and wafer to achieve numerical apertures (NA) up to 1.35.',
    category: 'patterning',
    visualType: 'svg',
    relatedTermIds: ['lithography', 'euv', 'reticle', 'cd'],
    fabContexts: ['lithography'],
    sourceIds: ['SRC-LITHO-EUV-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Refractive optical column showing 193 nm laser, quartz reticle, and projection lens.',
  },
  {
    id: 'euv',
    term: 'EUV Lithography',
    shortDefinition:
      'Extreme Ultraviolet lithography uses 13.5 nm light with reflective optics to pattern the smallest nanoscale features in advanced manufacturing.',
    whyItMatters:
      'The much shorter 13.5 nm wavelength enables direct single-exposure patterning of tight nanoscale pitches that would otherwise require complex multi-patterning.',
    engineeringDefinition:
      'Operates in high vacuum because EUV is absorbed by air and glass. Uses laser-produced plasma (LPP) tin droplet sources and Bragg reflective mirrors consisting of ~40 alternating molybdenum and silicon bilayers.',
    category: 'patterning',
    visualType: 'svg',
    relatedTermIds: ['lithography', 'duv', 'reticle', 'cd'],
    fabContexts: ['lithography'],
    sourceIds: ['SRC-LITHO-EUV-01', 'SRC-PROCESS-CONTROL-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Reflective vacuum chamber optics showing tin plasma source, curved mirrors, and reflective mask.',
  },
  {
    id: 'cd',
    term: 'Critical Dimension (CD)',
    shortDefinition:
      'Critical Dimension, or CD, is the measured width of an important patterned feature on the wafer.',
    whyItMatters:
      'CD directly governs transistor switching speed, leakage currents, and circuit performance.',
    engineeringDefinition:
      'The target dimension of the smallest or most performance-critical feature in a layer (e.g. gate length or interconnect pitch). Measured inline using low-voltage top-down Critical Dimension SEMs (CD-SEM).',
    category: 'patterning',
    visualType: 'svg',
    relatedTermIds: ['feature', 'metrology', 'overlay', 'yield'],
    fabContexts: ['adi', 'etch', 'aei'],
    sourceIds: ['SRC-METROLOGY-01', 'SRC-PROCESS-CONTROL-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'SEM feature diagram with horizontal measurement dimension arrows indicating feature width.',
  },
  {
    id: 'overlay',
    term: 'Overlay',
    shortDefinition:
      'Overlay describes how accurately a newly patterned layer is positioned relative to existing underlying layers.',
    whyItMatters:
      'If two connected layers are misaligned by even a few nanometers, contacts miss target lines, causing circuit failure.',
    engineeringDefinition:
      'Vector displacement error between target centers of features on adjacent process levels. Modern advanced manufacturing requires overlay error budgets below 2 to 3 nanometers.',
    category: 'patterning',
    visualType: 'svg',
    relatedTermIds: ['alignment', 'metrology', 'lithography', 'yield'],
    fabContexts: ['adi', 'aei'],
    sourceIds: ['SRC-PROCESS-CONTROL-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Two overlapping square alignment targets showing concentric alignment and offset error vectors.',
  },
  {
    id: 'alignment',
    term: 'Alignment',
    shortDefinition:
      'Alignment is the physical positioning of the wafer relative to the lithography exposure optics and reticle.',
    whyItMatters:
      'Precise stage positioning ensures that each exposure field lines up exactly with previously fabricated features.',
    engineeringDefinition:
      'Optical laser sensors detect diffraction gratings (alignment marks) pre-etched into the wafer substrate to calibrate wafer translation, rotation, magnification, and non-linear distortion before exposure.',
    category: 'patterning',
    visualType: 'svg',
    relatedTermIds: ['overlay', 'lithography', 'reticle'],
    fabContexts: ['lithography', 'adi'],
    sourceIds: ['SRC-PROCESS-CONTROL-01', 'SRC-LITHO-EUV-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Wafer alignment mark sensors calibrating wafer position relative to projection reticle.',
  },

  // ─────────────────────────────────────────────────────────────
  // 03 — CHANGING MATERIALS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'deposition',
    term: 'Deposition',
    shortDefinition:
      'Deposition adds a thin layer of material across the wafer surface.',
    whyItMatters:
      'Deposition supplies the conductive, insulating, or protective material layers from which circuits are carved.',
    engineeringDefinition:
      'Includes Chemical Vapor Deposition (CVD), Atomic Layer Deposition (ALD), Physical Vapor Deposition (PVD/sputtering), and electrochemical plating, depositing films from fractions of a nanometer to several microns.',
    category: 'process',
    visualType: 'svg',
    relatedTermIds: ['layer', 'etch', 'cmp', 'tool'],
    fabContexts: ['deposition'],
    sourceIds: ['SRC-DEPOSITION-01', 'SRC-FAB-PROCESS-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Deposition chamber diagram showing reactant vapor depositing uniform thin film onto substrate.',
  },
  {
    id: 'develop',
    term: 'Develop',
    shortDefinition:
      'Development removes selected photoresist regions after exposure, creating a physical resist stencil.',
    whyItMatters:
      'Developing turns the invisible optical latent image in the resist into real physical openings.',
    engineeringDefinition:
      'In positive resist systems, exposed polymer chains rendered acidic by photochemical reactions dissolve rapidly when rinsed with aqueous tetramethylammonium hydroxide (TMAH) developer solution.',
    category: 'process',
    visualType: 'svg',
    relatedTermIds: ['photoresist', 'lithography', 'etch'],
    fabContexts: ['develop', 'adi'],
    sourceIds: ['SRC-FAB-PROCESS-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Chemical rinse dissolving soluble exposed resist to open stencil windows over dielectric.',
  },
  {
    id: 'etch',
    term: 'Etch',
    shortDefinition:
      'Etch selectively removes material to transfer a pattern into an underlying layer.',
    whyItMatters:
      'Etching carves the permanent functional geometry of transistors, trenches, and interconnects into target films.',
    engineeringDefinition:
      'Reactive Ion Etch (RIE) combines chemical reaction and physical ion bombardment in low-pressure plasma to achieve anisotropic (directional, vertical sidewall) material removal.',
    category: 'process',
    visualType: 'svg',
    relatedTermIds: ['deposition', 'photoresist', 'feature', 'cmp'],
    fabContexts: ['etch', 'aei'],
    sourceIds: ['SRC-FAB-PROCESS-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Plasma ions etching vertical dielectric trenches selectively through resist stencil openings.',
  },
  {
    id: 'cmp',
    term: 'CMP / Planarization',
    shortDefinition:
      'Chemical Mechanical Planarization flattens the wafer surface so later layers can be built on a more level surface.',
    whyItMatters:
      'Photolithography has a narrow depth of focus; unflattened microscopic hills and valleys would cause blurred exposures on upper layers.',
    engineeringDefinition:
      'Combines mechanical abrasive polishing with chemical slurry etching on a rotating polyurethane polishing pad to remove topography and create an atomically flat wafer surface.',
    category: 'process',
    visualType: 'svg',
    relatedTermIds: ['deposition', 'layer', 'lithography'],
    fabContexts: ['deposition', 'strip'],
    sourceIds: ['SRC-SEMICON-MFG-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Rotating polishing pad and chemical slurry smoothing uneven wafer topography into a planar surface.',
  },
  {
    id: 'thin-film',
    term: 'Thin Film',
    shortDefinition:
      'A thin film is a layer of material ranging from fractions of a nanometer to several micrometers deposited onto the wafer.',
    whyItMatters:
      'Thin films of insulators, metals, and semiconductors form the actual physical components and wiring of every microchip.',
    engineeringDefinition:
      'Engineered films (e.g. SiO₂, Si₃N₄, TiN, Cu, W) deposited via CVD, PVD, or ALD with strictly controlled stoichiometry, mechanical stress, dielectric constant, and electrical conductivity.',
    category: 'process',
    visualType: 'svg',
    relatedTermIds: ['deposition', 'layer', 'substrate', 'etch'],
    fabContexts: ['deposition', 'etch', 'strip'],
    sourceIds: ['SRC-FAB-PROCESS-01', 'SRC-DEPOSITION-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Cross-section showing a nanometer-scale deposited thin film over silicon substrate.',
  },
  {
    id: 'strip',
    term: 'Photoresist Strip',
    shortDefinition:
      'Resist strip removes the temporary photoresist stencil after etching or ion implantation is complete.',
    whyItMatters:
      'Photoresist is a sacrificial mask; removing it cleanly leaves only the permanent patterned material without contaminating subsequent hot processes.',
    engineeringDefinition:
      'Typically accomplished via dry oxygen plasma ashing (converting organic resist to CO, CO₂, and H₂O vapor) followed by wet sulfuric acid-hydrogen peroxide (SPM/Piranha) chemical cleans.',
    category: 'process',
    visualType: 'svg',
    relatedTermIds: ['photoresist', 'etch', 'cleanroom', 'tool'],
    fabContexts: ['strip'],
    sourceIds: ['SRC-FAB-PROCESS-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Oxygen plasma asher stripping sacrificial photoresist from permanently etched wafer.',
  },

  // ─────────────────────────────────────────────────────────────
  // 04 — MEASURING RESULTS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'metrology',
    term: 'Metrology',
    shortDefinition:
      'Metrology uses measurements to check whether a process produced the intended dimensions and positions.',
    whyItMatters:
      'Inline measurements catch fabrication errors early, allowing process adjustments before costly wafer scrap occurs.',
    engineeringDefinition:
      'Non-destructive inline physical characterization, including optical scatterometry, CD-SEM, spectroscopic ellipsometry, and electron-beam inspection, tracking dimensional targets across wafer lots.',
    category: 'measurement',
    visualType: 'svg',
    relatedTermIds: ['cd', 'overlay', 'defect', 'yield'],
    fabContexts: ['adi', 'aei'],
    sourceIds: ['SRC-METROLOGY-01', 'SRC-PROCESS-CONTROL-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Measurement beam scanning wafer pattern and plotting dimensional verification data.',
  },
  {
    id: 'defect',
    term: 'Defect',
    shortDefinition:
      'A defect is an unwanted particle, pattern error, or material problem that can affect manufacturing or device performance.',
    whyItMatters:
      'Even a 20-nanometer dust particle or broken metal line can short-circuit a transistor and destroy an entire chip.',
    engineeringDefinition:
      'Classified into killer defects (shorts, opens, pinholes, large particles) causing circuit failure, and nuisance defects (cosmetic surface haze) that do not impair electrical operation.',
    category: 'measurement',
    visualType: 'svg',
    relatedTermIds: ['yield', 'cleanroom', 'metrology'],
    fabContexts: ['adi', 'aei'],
    sourceIds: ['SRC-SEMICON-MFG-01', 'SRC-METROLOGY-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Wafer defect map showing localized particle contamination causing circuit pattern bridging.',
  },
  {
    id: 'yield',
    term: 'Yield',
    shortDefinition:
      'Yield describes the fraction of manufactured dies that meet the required criteria.',
    whyItMatters:
      'Yield is the single most important commercial metric in semiconductor fabrication; higher yield directly reduces cost per functioning chip.',
    engineeringDefinition:
      'Calculated as the percentage of operational, in-specification dies divided by the total number of candidate dies on a wafer. Defect density and die area govern theoretical yield models (e.g. Murphy, Poisson).',
    category: 'measurement',
    visualType: 'svg',
    relatedTermIds: ['die', 'defect', 'metrology'],
    fabContexts: ['aei'],
    sourceIds: ['SRC-SEMICON-MFG-01', 'SRC-METROLOGY-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Wafer die grid showing passing functional dies (green) and defective non-passing dies (amber).',
  },

  // ─────────────────────────────────────────────────────────────
  // 05 — MOVING THROUGH THE FAB
  // ─────────────────────────────────────────────────────────────
  {
    id: 'foup',
    term: 'FOUP',
    shortDefinition:
      'A FOUP (Front Opening Unified Pod) is an enclosed carrier used to transport 300 mm wafers between compatible fab equipment.',
    whyItMatters:
      'Wafers stay sealed inside an ultra-clean microenvironment during transit, preventing contamination from cleanroom air.',
    engineeringDefinition:
      'Standardized polycarbonate enclosure holding up to 25 thirty-centimeter wafers in horizontal slots. Mates with equipment load ports via automated robotic door opening mechanisms, often purged with ultra-dry nitrogen.',
    category: 'fab-logistics',
    visualType: 'svg',
    relatedTermIds: ['lot', 'wafer', 'cleanroom', 'tool'],
    fabContexts: ['start'],
    sourceIds: ['SRC-SEMICON-MFG-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Front-Opening Unified Pod (FOUP) docked at an automated tool load port.',
  },
  {
    id: 'lot',
    term: 'Lot',
    shortDefinition:
      'A lot is a group of wafers tracked together through manufacturing.',
    whyItMatters:
      'Managing wafers in lots allows fab dispatchers and automated transport systems to schedule high-throughput tool batches efficiently.',
    engineeringDefinition:
      'Typically 25 wafers grouped in a single FOUP carrier that share recipe parameters, metrology sampling rates, and quality tracking history throughout their 2-to-3-month manufacturing cycle.',
    category: 'fab-logistics',
    visualType: 'svg',
    relatedTermIds: ['foup', 'wafer', 'process-step'],
    fabContexts: ['start'],
    sourceIds: ['SRC-SEMICON-MFG-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Batch of 25 silicon wafers in carrier slots progressing together through production line.',
  },
  {
    id: 'process-step',
    term: 'Process Step',
    shortDefinition:
      'A process step is one operation in the manufacturing sequence, such as coat, expose, etch, clean, deposit, or measure.',
    whyItMatters:
      'Fabricating a complete integrated circuit requires executing hundreds of precisely sequenced process steps.',
    engineeringDefinition:
      'An individualized recipe executed on a fab tool under automated host computer control, defined by calibrated parameters such as temperature, pressure, gas flow, exposure dose, and duration.',
    category: 'fab-logistics',
    visualType: 'svg',
    relatedTermIds: ['tool', 'lot', 'deposition', 'etch'],
    fabContexts: ['start', 'deposition', 'coat', 'lithography', 'develop', 'adi', 'etch', 'aei', 'strip'],
    sourceIds: ['SRC-FAB-PROCESS-01', 'SRC-SEMICON-MFG-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Sequential route line showing ordered fab processing operations.',
  },
  {
    id: 'tool',
    term: 'Tool / Equipment',
    shortDefinition:
      'A fab tool is specialized equipment that performs or measures part of the manufacturing process.',
    whyItMatters:
      'Semiconductor tools are among the most complex and expensive machines in human history, often costing tens to hundreds of millions of dollars each.',
    engineeringDefinition:
      'High-precision automated processing stations featuring vacuum transfer chambers, robotic wafer-handling arms, RF plasma generators, laser sources, and automated load ports conforming to SEMI standards.',
    category: 'fab-logistics',
    visualType: 'svg',
    relatedTermIds: ['process-step', 'foup', 'cleanroom', 'vacuum'],
    fabContexts: ['start', 'deposition', 'coat', 'lithography', 'develop', 'adi', 'etch', 'aei', 'strip'],
    sourceIds: ['SRC-SEMICON-MFG-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Unbranded semiconductor processing bay with robotic load port and vacuum transfer chamber.',
  },
  {
    id: 'cleanroom',
    term: 'Cleanroom',
    shortDefinition:
      'A cleanroom is a controlled manufacturing environment designed to limit particles and other sources of contamination.',
    whyItMatters:
      'Because microchip features are microscopic, airborne dust particles would settle on wafers and ruin millions of transistors.',
    engineeringDefinition:
      'Classified under ISO 14644 standards (e.g. ISO Class 1 to Class 3). Features laminar downward airflow through high-efficiency HEPA/ULPA ceiling filters, perforated raised floors, strictly controlled humidity, and yellow-filtered lighting in lithography bays.',
    category: 'fab-logistics',
    visualType: 'svg',
    relatedTermIds: ['tool', 'foup', 'defect'],
    fabContexts: ['start'],
    sourceIds: ['SRC-SEMICON-MFG-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Cleanroom airflow schematic showing HEPA filtration, raised perforated flooring, and bunny-suited operators.',
  },
  {
    id: 'vacuum',
    term: 'Vacuum',
    shortDefinition:
      'Many semiconductor tools operate parts of their process at pressures below normal atmospheric pressure to control chemistry and contamination.',
    whyItMatters:
      'Vacuum environments remove ambient air, allowing plasma ions and chemical vapors to travel in straight lines without colliding with unwanted gas molecules.',
    engineeringDefinition:
      'Operating from low vacuum (~1 Torr) in chemical vapor deposition to ultra-high vacuum (<10⁻⁷ Torr) in electron microscopes and EUV optical chambers using turbomolecular and cryogenic vacuum pumps.',
    category: 'fab-logistics',
    visualType: 'svg',
    relatedTermIds: ['tool', 'deposition', 'etch', 'euv'],
    fabContexts: ['deposition', 'etch', 'strip'],
    sourceIds: ['SRC-SEMICON-MFG-01', 'SRC-LITHO-EUV-01'],
    reviewStatus: 'approved',
    accessibilityDescription:
      'Sealed vacuum chamber showing low-pressure gas evacuation and molecular path control.',
  },
];

// ─────────────────────────────────────────────────────────────
// REGISTRY ACCESSORS & HELPERS
// ─────────────────────────────────────────────────────────────

export const TERMINOLOGY_REGISTRY: Record<string, BasicTerm> = Object.fromEntries(
  CANONICAL_TERMS.map((term) => [term.id, term]),
);

export function getTerm(id: string): BasicTerm | undefined {
  return TERMINOLOGY_REGISTRY[id];
}

export function getTermsByCategory(category: TermCategory): BasicTerm[] {
  return CANONICAL_TERMS.filter((t) => t.category === category);
}

export function getTermsForFabContext(stationId: string): BasicTerm[] {
  return CANONICAL_TERMS.filter((t) => t.fabContexts.includes(stationId));
}

export const CATEGORY_METADATA: Record<
  TermCategory,
  { number: string; title: string; subtitle: string }
> = {
  scale: {
    number: '01',
    title: 'Understanding Scale',
    subtitle: 'From a 300 mm silicon disc down to nanoscale circuit features',
  },
  patterning: {
    number: '02',
    title: 'Creating Patterns',
    subtitle: 'Using light, masks, and photosensitive polymer to define circuits',
  },
  process: {
    number: '03',
    title: 'Changing Materials',
    subtitle: 'The four fundamental operations: Add, Pattern, Remove, and Flatten',
  },
  measurement: {
    number: '04',
    title: 'Measuring Results',
    subtitle: 'Verifying dimensions, detecting defects, and tracking chip yield',
  },
  'fab-logistics': {
    number: '05',
    title: 'Moving Through the Fab',
    subtitle: 'How wafers, lots, and tools interact inside cleanroom facilities',
  },
};
