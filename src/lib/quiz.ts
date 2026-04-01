import pako from 'pako';
import { z } from 'zod';

export type QuizOption = string;

export interface QuizQuestion {
  question: string;
  options: [QuizOption, QuizOption, QuizOption, QuizOption];
  correctIndex: 0 | 1 | 2 | 3;
}

export interface QuizPayload {
  questions: QuizQuestion[];
  passphraseHash?: string;
  scoreKeyHash?: string;
}

export interface ScorePayload {
  total: number;
  correct: number;
  passphraseHash?: string;
  scoreKeyHash?: string;
}

const hexHashRegex = /^[a-f0-9]{64}$/i;

const QuizQuestionSchema = z.object({
  question: z.string().min(1).max(1000),
  options: z.tuple([z.string().max(500), z.string().max(500), z.string().max(500), z.string().max(500)]),
  correctIndex: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
});

const QuizPayloadSchema = z.object({
  questions: z.array(QuizQuestionSchema).min(1).max(100),
  passphraseHash: z.string().regex(hexHashRegex).optional(),
  scoreKeyHash: z.string().regex(hexHashRegex).optional(),
});

const ScorePayloadSchema = z.object({
  total: z.number().int().min(0).max(100),
  correct: z.number().int().min(0).max(100),
  passphraseHash: z.string().regex(hexHashRegex).optional(),
  scoreKeyHash: z.string().regex(hexHashRegex).optional(),
});

// Constant-time string comparison to prevent timing attacks
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Web crypto SHA-256 helper
async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function toBase64Url(bytes: Uint8Array): string {
  const bin = Array.from(bytes).map(b => String.fromCharCode(b)).join('');
  const base64 = btoa(bin);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '=='.substring(0, (4 - base64.length % 4) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function generateQuizCode(questions: QuizQuestion[], passphrase?: string, scoreKey?: string): Promise<string> {
  const filtered = questions.filter(q => q && q.question.trim());
  if (filtered.length === 0) throw new Error('Please add at least one question');

  const payload: QuizPayload = {
    questions: filtered,
    passphraseHash: passphrase ? await sha256Hex(passphrase) : undefined,
    scoreKeyHash: scoreKey ? await sha256Hex(scoreKey) : undefined,
  };
  const json = JSON.stringify(payload);
  const deflated = pako.deflate(json);
  const code = toBase64Url(deflated);
  return `HIDEYQ-${code}`;
}

export function decodeQuizCode(shortCode: string): QuizPayload {
  if (!shortCode || !shortCode.startsWith('HIDEYQ-')) throw new Error('Invalid Quiz Code');
  const encoded = shortCode.substring(7);

  if (encoded.length > 500000) throw new Error('Payload too large');

  let inflated: string;
  try {
    const bytes = fromBase64Url(encoded);
    inflated = pako.inflate(bytes, { to: 'string' });
  } catch {
    throw new Error('Corrupted or invalid Quiz Code');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(inflated);
  } catch {
    throw new Error('Corrupted or invalid Quiz Code');
  }

  const result = QuizPayloadSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error('Invalid Quiz Code format: ' + result.error.issues.map(i => i.message).join(', '));
  }

  return result.data;
}

export async function generateScoreCode(quiz: QuizPayload, answers: number[], passphrase?: string): Promise<string> {
  const total = quiz.questions.length;
  const correct = quiz.questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0);
  const passphraseHash = passphrase ? await sha256Hex(passphrase) : undefined;
  if ((quiz.passphraseHash || passphraseHash) && quiz.passphraseHash !== passphraseHash) {
    // If quiz had a passphrase, require matching passphrase to generate valid score code
    throw new Error('Incorrect passphrase');
  }

  const payload: ScorePayload = { 
    total, 
    correct, 
    passphraseHash: quiz.passphraseHash,
    scoreKeyHash: quiz.scoreKeyHash
  };
  const json = JSON.stringify(payload);
  const deflated = pako.deflate(json);
  const code = toBase64Url(deflated);
  return `HIDEYS-${code}`;
}

export function decodeScoreCode(shortCode: string): ScorePayload {
  if (!shortCode || !shortCode.startsWith('HIDEYS-')) throw new Error('Invalid Score Code');
  const encoded = shortCode.substring(7);

  if (encoded.length > 500000) throw new Error('Payload too large');

  let inflated: string;
  try {
    const bytes = fromBase64Url(encoded);
    inflated = pako.inflate(bytes, { to: 'string' });
  } catch {
    throw new Error('Corrupted or invalid Score Code');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(inflated);
  } catch {
    throw new Error('Corrupted or invalid Score Code');
  }

  const result = ScorePayloadSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error('Invalid Score Code format: ' + result.error.issues.map(i => i.message).join(', '));
  }

  return result.data;
}

export async function verifyScoreKey(scorePayload: ScorePayload, scoreKey: string): Promise<boolean> {
  if (!scorePayload.scoreKeyHash) return true;
  const providedHash = await sha256Hex(scoreKey);
  return constantTimeCompare(scorePayload.scoreKeyHash, providedHash);
}


