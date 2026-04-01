import { encodeMessage, decodeMessage, PatternType } from './encoding';
import pako from 'pako';
import { z } from 'zod';

const VALID_PATTERN_TYPES: PatternType[] = ['alnum', 'symbol', 'caps', 'hex'];

const QuestionDataSchema = z.object({
  question: z.string().min(1, 'Question is required').max(1000, 'Question too long'),
  answerHash: z.string().regex(/^[a-f0-9]{64}$/i, 'Invalid answer hash format'),
  encryptedMessage: z.string().min(1, 'Encrypted message is required'),
  patternType: z.enum(['alnum', 'symbol', 'caps', 'hex'] as const),
});

export interface QuestionData {
  question: string;
  answerHash: string;
  encryptedMessage: string;
  patternType: PatternType;
}

// Constant-time string comparison to prevent timing attacks
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Hash function using Web Crypto API
async function hashAnswer(answer: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(answer);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Encode a question-locked message
export async function encodeQuestionMessage(
  message: string,
  question: string,
  answer: string,
  patternType: PatternType,
  passphrase?: string
): Promise<string> {
  if (!message || !question || !answer) {
    throw new Error('Message, question, and answer are required');
  }

  if (!VALID_PATTERN_TYPES.includes(patternType)) {
    throw new Error('Invalid pattern type');
  }

  // Hash the answer
  const answerHash = await hashAnswer(answer);

  // Encode the message using the existing pattern logic
  const encryptedMessage = encodeMessage(message, patternType, passphrase);

  // Create the data structure
  const questionData: QuestionData = {
    question,
    answerHash,
    encryptedMessage,
    patternType,
  };

  // Convert to base64 and compress
  const jsonString = JSON.stringify(questionData);
  const compressed = pako.deflate(jsonString);
  const base64 = btoa(String.fromCharCode(...compressed));

  // Add prefix to identify question mode
  return `QMODE::${base64}`;
}

// Decode the structure to get question and encrypted message
export function decodeQuestionStructure(encodedText: string): QuestionData {
  if (!encodedText.startsWith('QMODE::')) {
    throw new Error('Invalid question mode code');
  }

  const base64 = encodedText.slice(7);

  if (base64.length > 500000) {
    throw new Error('Payload too large');
  }

  let jsonString: string;
  try {
    const compressedData = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    jsonString = pako.inflate(compressedData, { to: 'string' });
  } catch {
    throw new Error('Corrupted or invalid challenge code');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('Corrupted or invalid challenge code');
  }

  const result = QuestionDataSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error('Invalid challenge format: ' + result.error.issues.map(i => i.message).join(', '));
  }

  return result.data;
}

// Verify answer and decode message
export async function verifyAndDecode(
  questionData: QuestionData,
  userAnswer: string,
  passphrase?: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // Hash the user's answer
    const userHash = await hashAnswer(userAnswer);

    // Compare hashes
    if (userHash !== questionData.answerHash) {
      return {
        success: false,
        error: 'Incorrect answer',
      };
    }

    // Decode the message
    const message = decodeMessage(
      questionData.encryptedMessage,
      questionData.patternType,
      passphrase
    );

    return {
      success: true,
      message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Decoding failed',
    };
  }
}
