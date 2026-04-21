import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import pako from "pako";
import type { PatternType } from "@/lib/encoding";

const VALID_PATTERNS: PatternType[] = ["alnum", "symbol", "caps", "hex"];

export interface SharedContent {
  message: string | null;
  pattern: PatternType | null;
  hasPassphrase: boolean;
  quizCode: string | null;
  hasShared: boolean;
  initialMode: "message" | "quiz" | "question" | null;
}

const VALID_MODES = ["message", "quiz", "question"] as const;

export function useSharedContent(): SharedContent {
  const [params] = useSearchParams();

  return useMemo(() => {
    const rawMessage = params.get("m");
    const isCompressed = params.get("compressed") === "1";
    let message: string | null = null;
    if (rawMessage) {
      if (isCompressed) {
        try {
          const binary = atob(
            rawMessage.replace(/-/g, "+").replace(/_/g, "/")
          );
          const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
          message = pako.inflate(bytes, { to: "string" });
        } catch {
          message = rawMessage;
        }
      } else {
        message = rawMessage;
      }
    }
    const patternRaw = params.get("p");
    const hasPassphrase = params.get("pp") === "1";
    const quizCode = params.get("quiz");

    const pattern =
      patternRaw && VALID_PATTERNS.includes(patternRaw as PatternType)
        ? (patternRaw as PatternType)
        : null;

    const modeParam = params.get("mode");
    let initialMode: "message" | "quiz" | "question" | null = null;
    if (quizCode) initialMode = "quiz";
    else if (message) initialMode = "message";
    else if (modeParam && (VALID_MODES as readonly string[]).includes(modeParam))
      initialMode = modeParam as "message" | "quiz" | "question";

    return {
      message,
      pattern,
      hasPassphrase,
      quizCode,
      hasShared: !!(message || quizCode),
      initialMode,
    };
  }, [params]);
}
