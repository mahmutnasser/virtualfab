/**
 * SCIENTIFIC SOURCE TRACEABILITY REGISTRY:
 *
 * All current scientific content in the Virtual Fab is traceable to registered
 * academic references or explicitly marked for OPEN SCIENTIFIC REVIEW.
 */

export interface AcademicSource {
  id: string;
  citation: string;
  authors: string[];
  title: string;
  edition?: string;
  publisher?: string;
  year: number;
  publicationDate?: string;
  chapterOrPages?: string;
  doiOrIsbn?: string;
  sourceType: 'textbook' | 'monograph' | 'standard' | 'article' | 'industry-publication';
  claimsSupported: string[];
  reviewStatus: 'VERIFIED_REFERENCE' | 'OPEN_SCIENTIFIC_REVIEW';
}

export const SOURCE_REGISTRY: Record<string, AcademicSource> = {
  'SRC-FAB-PROCESS-01': {
    id: 'SRC-FAB-PROCESS-01',
    citation:
      'Plummer, J. D., Deal, M. D., & Griffin, P. B. (2000). Silicon VLSI Technology: Fundamentals, Practice, and Modeling. Prentice Hall.',
    authors: ['J. D. Plummer', 'M. D. Deal', 'P. B. Griffin'],
    title: 'Silicon VLSI Technology: Fundamentals, Practice, and Modeling',
    edition: '1st Edition',
    publisher: 'Prentice Hall',
    year: 2000,
    chapterOrPages: 'Chapter 2 (Substrates), Chapter 5 (Oxidation), Chapter 6 (Thin Films)',
    doiOrIsbn: 'ISBN 0-13-085240-X',
    sourceType: 'textbook',
    claimsSupported: [
      'Monocrystalline silicon wafer substrate baseline (775 µm for 300 mm wafers)',
      'Additive thin film deposition across wafer surface without substrate consumption',
      'Dielectric silicon dioxide (SiO₂) isolation and masking film properties',
      'Positive photoresist spin-coating, exposure, development, and plasma stripping sequence',
    ],
    reviewStatus: 'VERIFIED_REFERENCE',
  },
  'SRC-DEVICE-ADV-01': {
    id: 'SRC-DEVICE-ADV-01',
    citation:
      'Sze, S. M., & Ng, K. K. (2006). Physics of Semiconductor Devices (3rd ed.). John Wiley & Sons.',
    authors: ['S. M. Sze', 'K. K. Ng'],
    title: 'Physics of Semiconductor Devices',
    edition: '3rd Edition',
    publisher: 'John Wiley & Sons',
    year: 2006,
    chapterOrPages: 'Chapter 4: MIS Diode & Gate Dielectric Properties (pp. 197–242)',
    doiOrIsbn: 'ISBN 978-0-471-14323-9',
    sourceType: 'textbook',
    claimsSupported: [
      'SiO₂ dielectric breakdown and electrical isolation characteristics',
      'MOS gate insulator physical dimensions and interface trap density',
    ],
    reviewStatus: 'VERIFIED_REFERENCE',
  },
  'SRC-DEPOSITION-01': {
    id: 'SRC-DEPOSITION-01',
    citation:
      'Campbell, S. A. (2001). The Science and Engineering of Microelectronic Fabrication (2nd ed.). Oxford University Press.',
    authors: ['S. A. Campbell'],
    title: 'The Science and Engineering of Microelectronic Fabrication',
    edition: '2nd Edition',
    publisher: 'Oxford University Press',
    year: 2001,
    chapterOrPages: 'Chapter 12 (Chemical Vapor Deposition), Chapter 13 (Dielectric & Polysilicon Film Deposition)',
    doiOrIsbn: 'ISBN 0-19-513605-5',
    sourceType: 'textbook',
    claimsSupported: [
      'Chemical Vapor Deposition (CVD) mechanisms for blanket dielectric thin films',
      'Reaction kinetics vs. mass-transport limited growth regimes',
      'Film thickness uniformity and conformality across large wafers',
    ],
    reviewStatus: 'VERIFIED_REFERENCE',
  },
  'SRC-METROLOGY-01': {
    id: 'SRC-METROLOGY-01',
    citation:
      'Madou, M. J. (2002). Fundamentals of Microfabrication: The Science of Miniaturization (2nd ed.). CRC Press.',
    authors: ['M. J. Madou'],
    title: 'Fundamentals of Microfabrication: The Science of Miniaturization',
    edition: '2nd Edition',
    publisher: 'CRC Press',
    year: 2002,
    chapterOrPages: 'Chapter 1 (Lithography), Chapter 3 (Metrology & Inspection)',
    doiOrIsbn: 'ISBN 0-8493-0826-7',
    sourceType: 'textbook',
    claimsSupported: [
      'Optical lithography reticle pattern transfer to organic photoresist',
      'Inline CD-SEM critical dimension and defect inspection methods',
    ],
    reviewStatus: 'VERIFIED_REFERENCE',
  },
  'SRC-PROCESS-CONTROL-01': {
    id: 'SRC-PROCESS-CONTROL-01',
    citation:
      'Peters, L. (August 9, 2022). How Overlay Keeps Pace With EUV Patterning. Semiconductor Engineering.',
    authors: ['Laura Peters'],
    title: 'How Overlay Keeps Pace With EUV Patterning',
    publisher: 'Semiconductor Engineering',
    year: 2022,
    publicationDate: 'August 9, 2022',
    sourceType: 'article',
    claimsSupported: [
      'After-develop inspection (ADI) provides an overlay and patterning checkpoint before irreversible etching',
      'After-etch inspection (AEI) verifies pattern transfer fidelity into underlying layers',
      'Metrology checkpoints are interleaved across the lithography and etch sequence for process control',
      'In a real fab, after-develop inspection enables photoresist stripping and rework prior to permanent etching',
    ],
    reviewStatus: 'VERIFIED_REFERENCE',
  },
  'SRC-SEMICON-MFG-01': {
    id: 'SRC-SEMICON-MFG-01',
    citation:
      'Quirk, M., & Serda, J. (2001). Semiconductor Manufacturing Technology. Prentice Hall.',
    authors: ['Michael Quirk', 'Julian Serda'],
    title: 'Semiconductor Manufacturing Technology',
    edition: '1st Edition',
    publisher: 'Prentice Hall',
    year: 2001,
    chapterOrPages: 'Chapter 3 (Cleanrooms), Chapter 4 (Wafer Handling & Lots), Chapter 14 (CMP)',
    doiOrIsbn: 'ISBN 0-13-081520-9',
    sourceType: 'textbook',
    claimsSupported: [
      'Cleanroom particle control standards and air filtration principles',
      'Wafer carrier pods (FOUP) for 300 mm wafer contamination protection',
      'Chemical mechanical planarization (CMP) topography smoothing principles',
      'Vacuum requirements for plasma and low-pressure deposition processes',
    ],
    reviewStatus: 'VERIFIED_REFERENCE',
  },
  'SRC-LITHO-EUV-01': {
    id: 'SRC-LITHO-EUV-01',
    citation:
      'Levinson, H. J. (2010). Principles of Lithography (3rd ed.). SPIE Press.',
    authors: ['Harry J. Levinson'],
    title: 'Principles of Lithography',
    edition: '3rd Edition',
    publisher: 'SPIE Press',
    year: 2010,
    chapterOrPages: 'Chapter 3 (Optical Systems), Chapter 12 (Extreme Ultraviolet Lithography)',
    doiOrIsbn: 'ISBN 978-0-8194-8324-9',
    sourceType: 'monograph',
    claimsSupported: [
      'DUV (193 nm) refractive optical systems vs EUV (13.5 nm) reflective multilayer mirror systems',
      'Resolution wavelength scaling formula (Rayleigh equation)',
      'Exposure field boundaries and step-and-scan lithography concepts',
    ],
    reviewStatus: 'VERIFIED_REFERENCE',
  },
};

export function getSource(id: string): AcademicSource {
  const source = SOURCE_REGISTRY[id];
  if (!source) {
    throw new Error(
      `[OPEN SCIENTIFIC REVIEW] Unregistered source identifier: '${id}' not found in registry. All claims must be linked to a registered reference or marked for review.`,
    );
  }
  return source;
}
