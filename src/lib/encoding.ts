// Encoding patterns for Hidey
export type PatternType = 'alnum' | 'symbol' | 'caps' | 'hex' | 'emoji' | 'custom';

const PATTERNS = {
  alnum: 'abcdefghijklmnopqrstuvwxyz0123456789',
  symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?~`',
  caps: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  hex: '0123456789abcdef',
  emoji: '😀😃😄😁😆😅🤣😂🙂🙃😉😊😇🥰😍🤩😘😗😚😙🥲😋😛😜🤪😝🤑🤗🤭🤫🤔🤐🤨😐😑😶😏😒🙄😬🤥😌😔😪🤤😴😷🤒🤕🤢🤮🤧🥵🥶🥴😵🤯🤠🥳🥸😎🤓🧐😕😟🙁☹️😮😯😲😳🥺😦😧😨😰😥😢😭😱😖😣😞😓😩😫🥱😤😡😠🤬😈👿💀☠️💩🤡👹👺👻👽👾🤖',
};

// Generate a character mapping from pattern
function generateMapping(pattern: string, passphrase?: string): Map<string, string> {
  const mapping = new Map<string, string>();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?;:\'"()-';
  
  let patternChars = pattern.split('');
  
  // Remove duplicates from pattern to ensure bijective mapping
  patternChars = [...new Set(patternChars)];
  
  // If passphrase is provided, use it to shuffle the pattern
  if (passphrase) {
    const seed = passphrase.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    patternChars = shuffleWithSeed(patternChars, seed);
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
  customPattern?: string,
  passphrase?: string
): string {
  if (!message) return '';
  
  const pattern = patternType === 'custom' && customPattern 
    ? customPattern 
    : PATTERNS[patternType];
    
  const mapping = generateMapping(pattern, passphrase);
  
  // Group characters for readability
  let encoded = '';
  let group = '';
  
  for (const char of message) {
    const mappedChar = mapping.get(char) || char;
    group += mappedChar;
    
    if (group.length >= 5) {
      encoded += group + ' ';
      group = '';
    }
  }
  
  if (group) {
    encoded += group;
  }
  
  return encoded.trim();
}

export function decodeMessage(
  encodedMessage: string,
  patternType: PatternType,
  customPattern?: string,
  passphrase?: string
): string {
  if (!encodedMessage) return '';
  
  const pattern = patternType === 'custom' && customPattern 
    ? customPattern 
    : PATTERNS[patternType];
    
  const mapping = generateMapping(pattern, passphrase);
  
  // Reverse the mapping
  const reverseMapping = new Map<string, string>();
  mapping.forEach((value, key) => {
    reverseMapping.set(value, key);
  });
  
  // Remove spaces and decode
  const cleanEncoded = encodedMessage.replace(/\s/g, '');
  let decoded = '';
  
  for (const char of cleanEncoded) {
    decoded += reverseMapping.get(char) || char;
  }
  
  return decoded;
}

export function getPatternExample(patternType: PatternType): string {
  const sample = 'Meet me at the old oak tree';
  return encodeMessage(sample, patternType);
}
