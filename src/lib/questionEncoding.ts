import { encodeMessage, decodeMessage, PatternType } from './encoding';

export interface QuestionData {
  question: string;
  answerHash: string;
  encryptedMessage: string;
  patternType: PatternType;
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

  // Convert to base64
  const jsonString = JSON.stringify(questionData);
  const base64 = btoa(jsonString);

  // Add prefix to identify question mode
  return `QMODE::${base64}`;
}

// Decode the structure to get question and encrypted message
export function decodeQuestionStructure(encodedText: string): QuestionData {
  if (!encodedText.startsWith('QMODE::')) {
    throw new Error('Invalid question mode code');
  }

  const base64 = encodedText.slice(7);
  const jsonString = atob(base64);
  const questionData: QuestionData = JSON.parse(jsonString);

  if (!questionData.question || !questionData.answerHash || !questionData.encryptedMessage) {
    throw new Error('Invalid question data structure');
  }

  return questionData;
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
