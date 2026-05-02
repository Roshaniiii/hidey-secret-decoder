import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, Plus, X } from "lucide-react";
import type { QuizQuestion } from "@/lib/quiz";
import { generateQuizCode } from "@/lib/quiz";

export function QuizCreateSection() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    { question: "", options: ["", ""], correctIndex: 0 },
  ]);
  const [passphrase, setPassphrase] = useState("");
  const [scoreKey, setScoreKey] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);


  const updateQuestion = (idx: number, updater: (q: QuizQuestion) => QuizQuestion) => {
    setQuestions(prev => prev.map((q, i) => (i === idx ? updater(q) : q)));
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, { question: "", options: ["", ""], correctIndex: 0 }]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const addOption = (qIdx: number) => {
    updateQuestion(qIdx, (cur) => {
      if (cur.options.length >= 4) return cur;
      return { ...cur, options: [...cur.options, ""] };
    });
  };

  const removeOption = (qIdx: number, optIdx: number) => {
    updateQuestion(qIdx, (cur) => {
      if (cur.options.length <= 2) return cur;
      const nextOptions = cur.options.filter((_, i) => i !== optIdx);
      let nextCorrect = cur.correctIndex;
      if (cur.correctIndex === optIdx) nextCorrect = 0;
      else if (cur.correctIndex > optIdx) nextCorrect = cur.correctIndex - 1;
      return { ...cur, options: nextOptions, correctIndex: nextCorrect };
    });
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const sanitized = questions
        .map(q => ({
          question: q.question.trim(),
          options: q.options.map(o => o.trim()),
          correctIndex: q.correctIndex,
        }))
        .filter(q => q.question && q.options.length >= 2 && q.options.every(o => o));

      if (sanitized.length === 0) {
        toast.error("Please fill at least one complete question with 2+ options");
        return;
      }

      const code = await generateQuizCode(sanitized, passphrase || undefined, scoreKey || undefined);
      setQuizCode(code);
      toast.success("Quiz Code generated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate code");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(quizCode);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-foreground font-semibold">Create MCQs</Label>
        {(questions.some(q => q.question || q.options.some(o => o)) || passphrase || scoreKey || quizCode) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuestions([{ question: "", options: ["", ""], correctIndex: 0 }]);
              setPassphrase("");
              setScoreKey("");
              setQuizCode("");
              toast.success("Cleared");
            }}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <Card key={idx} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-semibold">Question {idx + 1}</Label>
              {questions.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => removeQuestion(idx)}>Remove</Button>
              )}
            </div>
            <Input
              placeholder="Enter question"
              value={q.question}
              onChange={e => updateQuestion(idx, (cur) => ({ ...cur, question: e.target.value }))}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className={q.correctIndex === optIndex ? "bg-emerald-500/10 border border-emerald-500 rounded-md p-2" : "p-0"}>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                      value={opt}
                      onChange={e => updateQuestion(idx, (cur) => {
                        const nextOptions = [...cur.options];
                        nextOptions[optIndex] = e.target.value;
                        return { ...cur, options: nextOptions };
                      })}
                    />
                    {q.options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(idx, optIndex)}
                        aria-label={`Remove option ${String.fromCharCode(65 + optIndex)}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {q.options.length < 4 && (
              <Button type="button" variant="outline" size="sm" onClick={() => addOption(idx)}>
                <Plus className="h-4 w-4 mr-1" /> Add option
              </Button>
            )}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 items-center">
              <Label className="col-span-2 md:col-span-1">Correct answer</Label>
              <select
                className="bg-card border-2 border-border rounded-md h-10 px-3"
                value={q.correctIndex}
                onChange={e => updateQuestion(idx, (cur) => ({ ...cur, correctIndex: Number(e.target.value) }))}
              >
                {q.options.map((_, i) => (
                  <option key={i} value={i}>{String.fromCharCode(65 + i)}</option>
                ))}
              </select>
              <div className="md:col-span-3 text-sm text-muted-foreground">The correct option appears light green.</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={addQuestion}>Add question</Button>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground font-medium">Passphrase</Label>
        <Input
          type="password"
          placeholder="Enter passphrase"
          value={passphrase}
          onChange={e => setPassphrase(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Add a passphrase for extra privacy.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground font-medium">Score Key</Label>
        <Input
          type="password"
          placeholder="Enter score key"
          value={scoreKey}
          onChange={e => setScoreKey(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Add a score key to protect score visibility.</p>
      </div>

      <Button onClick={handleGenerate} className="w-full" disabled={isGenerating}>
        {isGenerating ? "Generating..." : "Generate Quiz Code"}
      </Button>

      {quizCode && (
        <div className="space-y-3">
          <Label className="text-foreground font-semibold">Quiz Code</Label>
          <Textarea
            readOnly
            value={quizCode}
            className="min-h-[100px] font-mono text-sm bg-card border-2 border-border rounded-xl"
          />
          <Button variant="outline" onClick={copyCode} className="w-full rounded-xl border-2">
            <Copy className="mr-2 h-4 w-4" />
            Copy Quiz Code
          </Button>
          {passphrase && (
            <p className="text-xs text-muted-foreground">🔒 Keep the passphrase private.</p>
          )}
        </div>
      )}
    </div>
  );
}
