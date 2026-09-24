import { describe, it, expect } from 'vitest';
import {
  SOURCE_REGISTRY,
  getSource,
  FAB_EQUIPMENT_STATIONS,
  getEquipmentForStep,
  getAllEquipment,
  CANONICAL_PROCESS_STEPS_DATA,
  getProcessStep,
  APP_CONTENT,
} from '../../src/data';
import { normalizeCanonicalNodeId } from '../../src/types/process';

describe('Authoritative Data Registries (VF-007)', () => {
  describe('Source Registry', () => {
    it('contains all core semiconductor references', () => {
      expect(SOURCE_REGISTRY['SRC-FAB-PROCESS-01']).toBeDefined();
      expect(SOURCE_REGISTRY['SRC-DEPOSITION-01']).toBeDefined();
      expect(SOURCE_REGISTRY['SRC-DEVICE-ADV-01']).toBeDefined();
      expect(SOURCE_REGISTRY['SRC-METROLOGY-01']).toBeDefined();
      expect(SOURCE_REGISTRY['SRC-PROCESS-CONTROL-01']).toBeDefined();
    });

    it('returns source metadata via getSource', () => {
      const source = getSource('SRC-FAB-PROCESS-01');
      expect(source.authors).toContain('J. D. Plummer');
      expect(source.year).toBe(2000);

      const processControlSource = getSource('SRC-PROCESS-CONTROL-01');
      expect(processControlSource.title).toBe('How Overlay Keeps Pace With EUV Patterning');
      expect(processControlSource.authors).toContain('Laura Peters');
      expect(processControlSource.publisher).toBe('Semiconductor Engineering');
      expect(processControlSource.publicationDate).toBe('August 9, 2022');
      expect(processControlSource.year).toBe(2022);
      expect(processControlSource.claimsSupported.some((c) => c.includes('ADI'))).toBe(true);
    });

    it('throws descriptive error for unregistered source ID', () => {
      expect(() => getSource('SRC-UNKNOWN-99')).toThrow(/not found in registry/i);
    });
  });

  describe('Equipment Registry', () => {
    it('contains all 6 cleanroom equipment stations plus FOUP ingress', () => {
      const all = getAllEquipment();
      expect(all.length).toBeGreaterThanOrEqual(7);

      expect(FAB_EQUIPMENT_STATIONS['EQ-START-01']).toBeDefined();
      expect(FAB_EQUIPMENT_STATIONS['EQ-DEP-01']).toBeDefined();
      expect(FAB_EQUIPMENT_STATIONS['EQ-TRACK-01']).toBeDefined();
      expect(FAB_EQUIPMENT_STATIONS['EQ-LITHO-01']).toBeDefined();
      expect(FAB_EQUIPMENT_STATIONS['EQ-ETCH-01']).toBeDefined();
      expect(FAB_EQUIPMENT_STATIONS['EQ-STRIP-01']).toBeDefined();
      expect(FAB_EQUIPMENT_STATIONS['EQ-METRO-01']).toBeDefined();
      expect(FAB_EQUIPMENT_STATIONS['EQ-METRO-01'].stepIds).toEqual(['adi', 'aei']);
    });

    it('validates 3D layout coordinates and real equipment references', () => {
      for (const eq of getAllEquipment()) {
        expect(eq.position).toHaveLength(3);
        expect(eq.cameraTarget).toHaveLength(3);
        expect(eq.cameraPosition).toHaveLength(3);
        expect(eq.dimensions.width).toBeGreaterThan(0);
        expect(eq.dimensions.height).toBeGreaterThan(0);
        expect(eq.dimensions.depth).toBeGreaterThan(0);
        expect(eq.realEquipmentReference.length).toBeGreaterThan(5);
      }
    });

    it('retrieves correct equipment station for a process step', () => {
      const depTool = getEquipmentForStep('deposition');
      expect(depTool?.id).toBe('EQ-DEP-01');

      const trackTool = getEquipmentForStep('coat');
      expect(trackTool?.id).toBe('EQ-TRACK-01');

      const devTool = getEquipmentForStep('develop');
      expect(devTool?.id).toBe('EQ-TRACK-01'); // Shared physical track bay

      const adiTool = getEquipmentForStep('adi');
      expect(adiTool?.id).toBe('EQ-METRO-01'); // Interleaved metrology station

      const aeiTool = getEquipmentForStep('aei');
      expect(aeiTool?.id).toBe('EQ-METRO-01'); // Interleaved metrology station
    });
  });

  describe('Process Steps Data', () => {
    it('contains canonical 10-node step sequence with interleaved checkpoints', () => {
      expect(CANONICAL_PROCESS_STEPS_DATA).toHaveLength(10); // start + 6 numbered + 2 checkpoints + repeat
      const step1 = getProcessStep('deposition');
      expect(step1?.stepNumber).toBe(1);
      expect(step1?.stationId).toBe('EQ-DEP-01');
      expect(step1?.keyFacts.material).toBe('Silicon Dioxide (SiO₂)');

      const adi = getProcessStep('adi');
      expect(adi?.isCheckpoint).toBe(true);
      expect(adi?.checkpointKind).toBe('ADI');
      expect(adi?.stationId).toBe('EQ-METRO-01');

      const aei = getProcessStep('aei');
      expect(aei?.isCheckpoint).toBe(true);
      expect(aei?.checkpointKind).toBe('AEI');
      expect(aei?.stationId).toBe('EQ-METRO-01');

      const strip = getProcessStep('strip');
      expect(strip?.stepNumber).toBe(6);
    });

    it('ensures all process step sourceIds resolve to valid sources', () => {
      for (const step of CANONICAL_PROCESS_STEPS_DATA) {
        for (const srcId of step.sourceIds) {
          expect(SOURCE_REGISTRY[srcId]).toBeDefined();
        }
      }
    });

    it('ensures all process step stationIds resolve to valid equipment', () => {
      for (const step of CANONICAL_PROCESS_STEPS_DATA) {
        expect(FAB_EQUIPMENT_STATIONS[step.stationId]).toBeDefined();
      }
    });
  });

  describe('Content Registry', () => {
    it('provides accessible announcements and brand text', () => {
      expect(APP_CONTENT.brand.title).toBe('Silicon Journey');
      expect(APP_CONTENT.announcements.depositionComplete).toContain('silicon dioxide');
      expect(APP_CONTENT.announcements.selectStep(1, 'Deposition')).toBe(
        'Selected Step 1 of 6: Deposition.',
      );
    });
  });

  describe('Canonical Node Normalization & Equipment Mapping (VF-013 Closeout)', () => {
    it('normalizes unambiguous legacy aliases to canonical process IDs', () => {
      expect(normalizeCanonicalNodeId('adi-inspection')).toBe('adi');
      expect(normalizeCanonicalNodeId('aei-inspection')).toBe('aei');
      expect(normalizeCanonicalNodeId('coat-resist')).toBe('coat');
      expect(normalizeCanonicalNodeId('deposition')).toBe('deposition');
      expect(normalizeCanonicalNodeId('lithography')).toBe('lithography');
      expect(normalizeCanonicalNodeId('develop')).toBe('develop');
      expect(normalizeCanonicalNodeId('etch')).toBe('etch');
      expect(normalizeCanonicalNodeId('strip')).toBe('strip');
      expect(normalizeCanonicalNodeId('repeat')).toBe('repeat');
      expect(normalizeCanonicalNodeId('start')).toBe('start');
    });

    it('ensures generic metrology cannot silently normalize to either checkpoint', () => {
      const normalized = normalizeCanonicalNodeId('metrology');
      expect(normalized).not.toBe('adi');
      expect(normalized).not.toBe('aei');
      expect(normalized).toBeNull();

      // getProcessStep('metrology') must return undefined rather than guessing ADI or AEI
      expect(getProcessStep('metrology')).toBeUndefined();
    });

    it('ensures both adi and aei still resolve to the shared Metrology / Inspection equipment through equipment mapping', () => {
      const adiEquip = getEquipmentForStep('adi');
      const aeiEquip = getEquipmentForStep('aei');

      expect(adiEquip).toBeDefined();
      expect(aeiEquip).toBeDefined();
      expect(adiEquip?.id).toBe('EQ-METRO-01');
      expect(aeiEquip?.id).toBe('EQ-METRO-01');
      expect(adiEquip?.name).toBe('Metrology / Inspection Bay');
      expect(aeiEquip?.name).toBe('Metrology / Inspection Bay');
      expect(adiEquip).toBe(aeiEquip); // Identical shared physical tool reference
    });
  });
});
