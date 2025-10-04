// Substitution cipher encoding for Hidey with different pattern styles
export type PatternType = 'alnum' | 'symbol' | 'caps' | 'hex';

const MAX_MESSAGE_LENGTH = 10000;

// Base alphabets for substitution
const BASE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?'\"";

// Pattern configurations
type PatternConfig = {
  substitution?: string;
  shift?: number;
  alphabet?: string;
  preserveCase?: boolean;
  groupSize: number;
  separator: string;
};

const PATTERN_CONFIG: Record<PatternType, PatternConfig> = {
  alnum: { 
    substitution: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'\".,!?",
    groupSize: 3, 
    separator: "'" 
  },
  symbol: { 
    substitution: "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝßàáâãäåæçèéêëìíîïñòóôõö'÷øùúûüýÿ~\\",
    groupSize: 4, 
    separator: "'" 
  },
  caps: { 
    alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    shift: 13,  // ROT13
    groupSize: 3, 
    separator: ' ',
    preserveCase: true
  },
  hex: { 
    substitution: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'\".,!?",
    groupSize: 3, 
    separator: ' ' 
  },
};

// Generate substitution map from passphrase
function createSubstitutionMap(passphrase: string | undefined, baseSubstitution: string): Map<string, string> {
  const map = new Map<string, string>();
  let substitution = baseSubstitution;
  
  if (passphrase) {
    // Shuffle substitution alphabet based on passphrase
    const seed = passphrase.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const chars = baseSubstitution.split('');
    let currentSeed = seed;
    
    for (let i = chars.length - 1; i > 0; i--) {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      const j = Math.floor((currentSeed / 233280) * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    
    substitution = chars.join('');
  }
  
  for (let i = 0; i < Math.min(BASE_ALPHABET.length, substitution.length); i++) {
    map.set(BASE_ALPHABET[i], substitution[i]);
  }
  
  return map;
}

// ROT cipher for caps pattern
function rotCipher(text: string, shift: number): string {
  return text.split('').map(char => {
    if (char >= 'A' && char <= 'Z') {
      return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
    } else if (char >= 'a' && char <= 'z') {
      return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
    }
    return char;
  }).join('');
}

// Apply pattern formatting (grouping)
function applyPatternFormatting(encoded: string, patternType: PatternType): string {
  const config = PATTERN_CONFIG[patternType];
  
  if (config.groupSize === 0 || !config.separator) {
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
  if (!config.separator) return formatted;
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
  
  const config = PATTERN_CONFIG[patternType];
  let encoded = '';
  
  if (patternType === 'caps') {
    // Use ROT cipher for caps pattern
    const shift = config.shift ?? 13;
    encoded = rotCipher(message, shift);
    if (passphrase) {
      // Apply additional shift based on passphrase
      const extraShift = passphrase.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 26;
      encoded = rotCipher(encoded, extraShift);
    }
  } else {
    // Use substitution cipher for other patterns
    const substitution = config.substitution!;
    const map = createSubstitutionMap(passphrase, substitution);
    
    encoded = message.split('').map(char => {
      return map.get(char) || char;
    }).join('');
  }
  
  // Apply pattern formatting
  return applyPatternFormatting(encoded, patternType);
}

export function decodeMessage(
  encodedMessage: string,
  patternType: PatternType,
  passphrase?: string
): string {
  if (!encodedMessage) return '';
  
  try {
    const config = PATTERN_CONFIG[patternType];
    
    // Remove pattern formatting
    const cleaned = removePatternFormatting(encodedMessage, patternType);
    
    let decoded = '';
    
    if (patternType === 'caps') {
      // Reverse ROT cipher
      const baseShift = config.shift ?? 13;
      let shift = -baseShift;
      if (passphrase) {
        const extraShift = passphrase.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 26;
        shift -= extraShift;
      }
      decoded = rotCipher(cleaned, shift);
    } else {
      // Reverse substitution cipher
      const substitution = config.substitution!;
      const map = createSubstitutionMap(passphrase, substitution);
      
      // Create reverse map
      const reverseMap = new Map<string, string>();
      map.forEach((value, key) => {
        reverseMap.set(value, key);
      });
      
      decoded = cleaned.split('').map(char => {
        return reverseMap.get(char) || char;
      }).join('');
    }
    
    return decoded;
  } catch (error) {
    throw new Error(`Decoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function getPatternExample(patternType: PatternType): string {
  const sample = 'Meet me at the old oak tree';
  return encodeMessage(sample, patternType);
}
