import pako from 'pako';

export type QuizOption = string;

export interface QuizQuestion {
  question: string;
  options: [QuizOption, QuizOption, QuizOption, QuizOption];
  correctIndex: 0 | 1 | 2 | 3;
}

export interface QuizPayload {
  questions: QuizQuestion[];
  passphraseHash?: string; // SHA-256 hex of passphrase if provided
  scoreKeyHash?: string; // SHA-256 hex of score key if provided
}

export interface ScorePayload {
  total: number;
  correct: number;
  passphraseHash?: string; // Echoed for validation
  scoreKeyHash?: string; // SHA-256 hex of score key if provided
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
  const bytes = fromBase64Url(encoded);
  const inflated = pako.inflate(bytes, { to: 'string' });
  const payload = JSON.parse(inflated) as QuizPayload;
  if (!payload.questions || !Array.isArray(payload.questions)) throw new Error('Corrupted Quiz Code');
  return payload;
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
  const bytes = fromBase64Url(encoded);
  const inflated = pako.inflate(bytes, { to: 'string' });
  const payload = JSON.parse(inflated) as ScorePayload;
  if (typeof payload.total !== 'number' || typeof payload.correct !== 'number') throw new Error('Corrupted Score Code');
  return payload;
}

export async function verifyScoreKey(scorePayload: ScorePayload, scoreKey: string): Promise<boolean> {
  if (!scorePayload.scoreKeyHash) return true; // No score key required
  const providedHash = await sha256Hex(scoreKey);
  return scorePayload.scoreKeyHash === providedHash;
}


