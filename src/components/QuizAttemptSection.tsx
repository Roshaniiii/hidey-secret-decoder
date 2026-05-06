import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import type { QuizPayload } from "@/lib/quiz";
import { decodeQuizCode, generateScoreCode } from "@/lib/quiz";
import { PassphraseToggle } from "./PassphraseToggle";

interface QuizAttemptSectionProps {
  initialQuizCode?: string | null;
}

export function QuizAttemptSection({ initialQuizCode }: QuizAttemptSectionProps = {}) {
  const [quizCode, setQuizCode] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [quiz, setQuiz] = useState<QuizPayload | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scoreCode, setScoreCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSharedBanner, setShowSharedBanner] = useState(false);

  useEffect(() => {
    if (initialQuizCode) {
      setQuizCode(initialQuizCode);
      setShowSharedBanner(true);
    }
  }, [initialQuizCode]);

  const needsPassphrase = useMemo(() => !!quiz?.passphraseHash, [quiz]);

  const handleDecode = async () => {
    try {
      setIsLoading(true);
      const payload = decodeQuizCode(quizCode.trim());
      
      // If quiz has passphrase, verify it before loading
      if (payload.passphraseHash) {
        if (!passphrase) {
          toast.error("This quiz requires a passphrase");
          return;
        }
        // Verify passphrase by attempting to generate a dummy score code
        try {
          await generateScoreCode(payload, [], passphrase);
        } catch (e) {
          toast.error("Incorrect passphrase");
          return;
        }
      }
      
      setQuiz(payload);
      setAnswers(new Array(payload.questions.length).fill(undefined));
      setScoreCode("");
      toast.success("Quiz loaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Invalid Quiz Code");
    } finally {
      setIsLoading(false);
    }
  };

  const setAnswer = (qIdx: number, val: number) => {
    setAnswers(prev => {
      const next = [...prev];
      next[qIdx] = val;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    try {
      setIsSubmitting(true);
      const code = await generateScoreCode(quiz, answers, passphrase || undefined);
      setScoreCode(code);
      toast.success("✅ Quiz completed! Copy the Score Code and send it back to the quiz creator.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit answers");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyScore = async () => {
    try {
      await navigator.clipboard.writeText(scoreCode);
      toast.success("Score Code copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="space-y-6">
      {showSharedBanner && (
        <div className="p-4 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            🔗 Someone shared a quiz with you!
          </div>
          <p className="text-sm text-muted-foreground">Hit Load Quiz to begin.</p>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Paste Quiz Code</Label>
        <Textarea
          placeholder="Paste your HIDEYQ-XXXX code"
          value={quizCode}
          onChange={e => setQuizCode(e.target.value)}
          className="min-h-[100px] font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-foreground font-medium">Passphrase (if required)</Label>
        <Input
          type="password"
          placeholder="Enter passphrase"
          value={passphrase}
          onChange={e => setPassphrase(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Enter passphrase if the quiz requires one.</p>
      </div>

      <Button variant="secondary" onClick={handleDecode} disabled={isLoading}>
        {isLoading ? "Loading..." : "Load Quiz"}
      </Button>

      {quiz && (
        <div className="space-y-4">
          {quiz.questions.map((q, idx) => (
            <Card key={idx} className="p-4 space-y-3">
              <Label className="font-semibold">{idx + 1}. {q.question}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt, oi) => (
                  <label key={oi} className="flex items-center gap-2 p-2 border-2 border-border rounded-md cursor-pointer">
                    <input
                      type="radio"
                      name={`q-${idx}`}
                      className="h-4 w-4"
                      checked={answers[idx] === oi}
                      onChange={() => setAnswer(idx, oi)}
                    />
                    <span>{String.fromCharCode(65 + oi)}. {opt}</span>
                  </label>
                ))}
              </div>
            </Card>
          ))}


          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Answers"}
          </Button>

          {scoreCode && (
            <Card className="p-4 space-y-3">
              <div className="text-sm">✅ Quiz completed! Copy the Score Code and send it back to the quiz creator.</div>
              <Textarea readOnly value={scoreCode} className="min-h-[100px] font-mono text-sm" />
              <Button variant="outline" onClick={copyScore}>Copy Score Code</Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}


