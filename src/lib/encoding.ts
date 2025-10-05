// Base encoding for Hidey with different pattern alphabets
export type PatternType = 'alnum' | 'symbol' | 'caps' | 'hex';

const LENGTH_PREFIX_WIDTH = 3;
const MAX_MESSAGE_LENGTH = 10000;

// Pattern configurations with their own alphabets
const PATTERN_CONFIG = {
  alnum: { 
    alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    groupSize: 6, 
    separator: ' ' 
  },
  symbol: { 
    alphabet: "!@#$%^&*()_+-=[]{}|;:,.<>?/~`'\"\\",
    groupSize: 4, 
    separator: '-' 
  },
  caps: { 
    alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    groupSize: 5, 
    separator: ' ' 
  },
  hex: { 
    alphabet: "0123456789ABCDEF",
    groupSize: 8, 
    separator: '' 
  },
};

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

// Generate permuted alphabet from passphrase
function permuteAlphabet(passphrase: string, baseAlphabet: string): string {
  const seed = passphrase.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const chars = baseAlphabet.split('');
  return shuffleWithSeed(chars, seed).join('');
}

// Convert bytes to Base62 string
function bytesToBase62(bytes: Uint8Array, alphabet: string): string {
  if (bytes.length === 0) return '';
  
  // Convert bytes to a big integer (base 256)
  let num = 0n;
  for (let i = 0; i < bytes.length; i++) {
    num = num * 256n + BigInt(bytes[i]);
  }
  
  // Convert to base62
  if (num === 0n) return alphabet[0];
  
  let result = '';
  const base = BigInt(alphabet.length);
  
  while (num > 0n) {
    const remainder = Number(num % base);
    result = alphabet[remainder] + result;
    num = num / base;
  }
  
  return result;
}

// Convert Base62 string to bytes
function base62ToBytes(str: string, alphabet: string): Uint8Array {
  if (!str) return new Uint8Array(0);
  
  // Convert from base62 to big integer
  let num = 0n;
  const base = BigInt(alphabet.length);
  
  for (let i = 0; i < str.length; i++) {
    const digit = alphabet.indexOf(str[i]);
    if (digit === -1) {
      throw new Error(`Invalid character in encoded string: ${str[i]}`);
    }
    num = num * base + BigInt(digit);
  }
  
  // Convert to bytes
  if (num === 0n) return new Uint8Array([0]);
  
  const bytes: number[] = [];
  while (num > 0n) {
    bytes.unshift(Number(num % 256n));
    num = num / 256n;
  }
  
  return new Uint8Array(bytes);
}

// Encode length as 3 Base62 characters
function encodeLength(length: number, alphabet: string): string {
  let result = '';
  const base = alphabet.length;
  
  for (let i = 0; i < LENGTH_PREFIX_WIDTH; i++) {
    result = alphabet[length % base] + result;
    length = Math.floor(length / base);
  }
  
  return result;
}

// Decode length from 3 Base62 characters
function decodeLength(prefix: string, alphabet: string): number {
  let length = 0;
  const base = alphabet.length;
  
  for (let i = 0; i < prefix.length; i++) {
    const digit = alphabet.indexOf(prefix[i]);
    if (digit === -1) {
      throw new Error(`Invalid character in length prefix: ${prefix[i]}`);
    }
    length = length * base + digit;
  }
  
  return length;
}

// Apply pattern formatting (grouping)
function applyPatternFormatting(encoded: string, patternType: PatternType): string {
  const config = PATTERN_CONFIG[patternType];
  
  if (config.groupSize === 0) {
    return encoded;
  }
  
  const groups: string[] = [];
  for (let i = 0; i < encoded.length; i += config.groupSize) {
    groups.push(encoded.slice(i, i + config.groupSize));
  }
  
  return groups.join(config.separator);
}

// Remove pattern formatting
function removePatternFormatting(formatted: string, patternType: PatternType): string {
  const config = PATTERN_CONFIG[patternType];
  return formatted.split(config.separator).join('');
}

export function encodeMessage(
  message: string,
  patternType: PatternType,
  passphrase?: string
): string {
  if (!message) return '';
  
  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`);
  }
  
  // Get pattern config and alphabet (permuted if passphrase provided)
  const config = PATTERN_CONFIG[patternType];
  const alphabet = passphrase ? permuteAlphabet(passphrase, config.alphabet) : config.alphabet;
  
  // Convert message to UTF-8 bytes
  const encoder = new TextEncoder();
  const bytes = encoder.encode(message);
  
  // Encode length prefix
  const lengthPrefix = encodeLength(bytes.length, alphabet);
  
  // Encode message bytes to Base62
  const encoded = bytesToBase62(bytes, alphabet);
  
  // Combine prefix and encoded message
  const combined = lengthPrefix + encoded;
  
  // Apply pattern formatting
  return applyPatternFormatting(combined, patternType);
}

export function decodeMessage(
  encodedMessage: string,
  patternType: PatternType,
  passphrase?: string
): string {
  if (!encodedMessage) return '';
  
  try {
    // Get pattern config and alphabet (permuted if passphrase provided)
    const config = PATTERN_CONFIG[patternType];
    const alphabet = passphrase ? permuteAlphabet(passphrase, config.alphabet) : config.alphabet;
    
    // Remove pattern formatting
    const cleaned = removePatternFormatting(encodedMessage, patternType);
    
    // Extract length prefix
    if (cleaned.length < LENGTH_PREFIX_WIDTH) {
      throw new Error('Encoded message too short');
    }
    
    const lengthPrefix = cleaned.slice(0, LENGTH_PREFIX_WIDTH);
    const encodedData = cleaned.slice(LENGTH_PREFIX_WIDTH);
    
    // Decode length
    const expectedLength = decodeLength(lengthPrefix, alphabet);
    
    // Decode Base62 to bytes
    const bytes = base62ToBytes(encodedData, alphabet);
    
    // Validate length
    if (bytes.length !== expectedLength) {
      throw new Error(`Length mismatch: expected ${expectedLength}, got ${bytes.length}`);
    }
    
    // Convert bytes to UTF-8 string
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  } catch (error) {
    throw new Error(`Decoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function getPatternExample(patternType: PatternType): string {
  const sample = 'Meet me at the old oak tree';
  return encodeMessage(sample, patternType);
}
