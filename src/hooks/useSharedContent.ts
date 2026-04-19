import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { PatternType } from "@/lib/encoding";

const VALID_PATTERNS: PatternType[] = ["alnum", "symbol", "caps", "hex"];

export interface SharedContent {
  message: string | null;
  pattern: PatternType | null;
  hasPassphrase: boolean;
  quizCode: string | null;
  hasShared: boolean;
  initialMode: "message" | "quiz" | null;
}

export function useSharedContent(): SharedContent {
  const [params] = useSearchParams();

  return useMemo(() => {
    const message = params.get("m");
    const patternRaw = params.get("p");
    const hasPassphrase = params.get("pp") === "1";
    const quizCode = params.get("quiz");

    const pattern =
      patternRaw && VALID_PATTERNS.includes(patternRaw as PatternType)
        ? (patternRaw as PatternType)
        : null;

    let initialMode: "message" | "quiz" | null = null;
    if (quizCode) initialMode = "quiz";
    else if (message) initialMode = "message";

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
