/**
 * Detects whether WebGL rendering context is supported in the current environment.
 * Supports URL search override '?webgl=false' or hash '#nowebgl' for fallback testing.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  if (
    window.location.search.includes('webgl=false') ||
    window.location.hash.includes('nowebgl')
  ) {
    return false;
  }
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ||
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}
