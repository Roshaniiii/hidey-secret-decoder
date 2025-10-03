// Encoding patterns for Hidey
export type PatternType = 'alnum' | 'symbol' | 'caps' | 'hex';

const PATTERNS = {
  alnum: 'qwErTyUiOpLkJhGfDsAzXcVbNm1234567890QWEUIKHFSZCBMljhgfdsazxcvbnm .,!?;:\'"()-_',
  symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?~`/\\\'"`ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ',
  caps: 'ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba9876543210 .,!?;:\'"()-_',
  hex: '0123456789abcdefABCDEFghijklmnopqrstuvwxyzGHIJKLMNOPQRSTUVWXYZ .,!?;:\'"()-_',
};

// Generate a character mapping from pattern
function generateMapping(pattern: string, passphrase?: string): Map<string, string> {
  const mapping = new Map<string, string>();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?;:\'"()-_';
  
  let patternChars = pattern.split('');
  
  // Remove duplicates from pattern to ensure bijective mapping
  patternChars = [...new Set(patternChars)];
  
  // If passphrase is provided, use it to shuffle the pattern
  if (passphrase) {
    const seed = passphrase.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    patternChars = shuffleWithSeed(patternChars, seed);
  }
  
  // Ensure pattern has enough characters for bijective mapping
  if (patternChars.length < chars.length) {
    console.warn(`Pattern has ${patternChars.length} unique chars but character set has ${chars.length} chars. Some characters may not encode/decode correctly.`);
  }
  
  // Create bijective mapping - only map as many chars as we have unique pattern chars
  const maxChars = Math.min(chars.length, patternChars.length);
  for (let i = 0; i < maxChars; i++) {
    mapping.set(chars[i], patternChars[i]);
  }
  
  return mapping;
}

// Shuffle array with seed for consistent results
function shuffleWithSeed(array: string[], seed: number): string[] {
  const shuffled = [...array];
  let currentSeed = seed;
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const j = Math.floor((currentSeed / 233280) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

export function encodeMessage(
  message: string,
  patternType: PatternType,
  passphrase?: string
): string {
  if (!message) return '';
  
  const pattern = PATTERNS[patternType];
    
  const mapping = generateMapping(pattern, passphrase);
  
  // Encode each character directly without adding formatting spaces
  let encoded = '';
  
  for (const char of message) {
    const mappedChar = mapping.get(char) || char;
    encoded += mappedChar;
  }
  
  return encoded;
}

export function decodeMessage(
  encodedMessage: string,
  patternType: PatternType,
  passphrase?: string
): string {
  if (!encodedMessage) return '';
  
  const pattern = PATTERNS[patternType];
    
  const mapping = generateMapping(pattern, passphrase);
  
  // Reverse the mapping
  const reverseMapping = new Map<string, string>();
  mapping.forEach((value, key) => {
    reverseMapping.set(value, key);
  });
  
  // Decode each character directly
  let decoded = '';
  
  for (const char of encodedMessage) {
    decoded += reverseMapping.get(char) || char;
  }
  
  return decoded;
}

export function getPatternExample(patternType: PatternType): string {
  const sample = 'Meet me at the old oak tree';
  return encodeMessage(sample, patternType);
}
