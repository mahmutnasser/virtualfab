import { describe, it, expect } from 'vitest';
import {
  CANONICAL_TERMS,
  getTerm,
  getTermsByCategory,
  getTermsForFabContext,
  CATEGORY_METADATA,
} from '../../src/data/terminology';
import { SOURCE_REGISTRY, getSource } from '../../src/data/sources';

describe('VF-014 Canonical Terminology Registry', () => {
  it('contains at least 26 required foundational terms', () => {
    expect(CANONICAL_TERMS.length).toBeGreaterThanOrEqual(26);
  });

  it('contains all 5 required curriculum categories', () => {
    const categories = Object.keys(CATEGORY_METADATA);
    expect(categories).toEqual(['scale', 'patterning', 'process', 'measurement', 'fab-logistics']);
  });

  it('ensures every term has required non-empty fields and valid category', () => {
    const validCategories = new Set(['scale', 'patterning', 'process', 'measurement', 'fab-logistics']);

    for (const term of CANONICAL_TERMS) {
      expect(term.id).toBeTruthy();
      expect(term.term).toBeTruthy();
      expect(term.shortDefinition).toBeTruthy();
      expect(term.whyItMatters).toBeTruthy();
      expect(validCategories.has(term.category)).toBe(true);
      expect(term.sourceIds.length).toBeGreaterThan(0);
      expect(term.accessibilityDescription).toBeTruthy();
    }
  });

  it('ensures every sourceId resolves to a verified reference in SOURCE_REGISTRY (0 missing citations)', () => {
    for (const term of CANONICAL_TERMS) {
      for (const sId of term.sourceIds) {
        expect(SOURCE_REGISTRY[sId], `Term '${term.id}' has unresolved source '${sId}'`).toBeDefined();
        expect(() => getSource(sId)).not.toThrow();
      }
    }
  });

  it('ensures all relatedTermIds cross-reference existing terms in registry (no dangling links)', () => {
    const termIdSet = new Set(CANONICAL_TERMS.map((t) => t.id));

    for (const term of CANONICAL_TERMS) {
      for (const rId of term.relatedTermIds) {
        expect(termIdSet.has(rId), `Term '${term.id}' references non-existent term '${rId}'`).toBe(true);
      }
    }
  });

  it('correctly maps fab contexts to relevant station vocabulary', () => {
    const depositionTerms = getTermsForFabContext('deposition');
    expect(depositionTerms.some((t) => t.id === 'deposition')).toBe(true);
    expect(depositionTerms.some((t) => t.id === 'thin-film')).toBe(true);

    const lithoTerms = getTermsForFabContext('lithography');
    expect(lithoTerms.some((t) => t.id === 'lithography')).toBe(true);
    expect(lithoTerms.some((t) => t.id === 'duv')).toBe(true);
    expect(lithoTerms.some((t) => t.id === 'euv')).toBe(true);
    expect(lithoTerms.some((t) => t.id === 'reticle')).toBe(true);

    const adiTerms = getTermsForFabContext('adi');
    expect(adiTerms.some((t) => t.id === 'cd')).toBe(true);
    expect(adiTerms.some((t) => t.id === 'overlay')).toBe(true);
  });

  it('getTerm retrieves specific term or undefined', () => {
    expect(getTerm('wafer')).toBeDefined();
    expect(getTerm('wafer')?.term).toBe('Wafer');
    expect(getTerm('non-existent-id')).toBeUndefined();
  });

  it('getTermsByCategory groups correctly', () => {
    const scaleTerms = getTermsByCategory('scale');
    expect(scaleTerms.length).toBe(7); // wafer, field, die, feature, layer, substrate, lot
    for (const t of scaleTerms) {
      expect(t.category).toBe('scale');
    }
  });
});
