import pako from 'pako';

// === ENCODE (Scramble Step) ===
export function createHideyCode(dataObj: unknown): string | null {
  try {
    const json = JSON.stringify(dataObj);
    const compressed = pako.deflate(json);
    const base64 = btoa(String.fromCharCode(...compressed));
    const safe = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return 'HIDEY-' + safe;
  } catch (e) {
    console.error('Encoding failed:', e);
    return null;
  }
}

// === DECODE (Reveal Step) ===
export function decodeHideyCode(code: string): unknown | null {
  try {
    const base = code.replace(/^HIDEY-/, '');
    const padded = base.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(padded);
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    const json = pako.inflate(bytes, { to: 'string' });
    return JSON.parse(json);
  } catch (e) {
    console.error('Decoding failed:', e);
    return null;
  }
}

