import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { decodeScoreCode, verifyScoreKey } from "@/lib/quiz";

export function QuizRevealSection() {
  const [scoreCode, setScoreCode] = useState("");
  const [scoreKey, setScoreKey] = useState("");
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);
  const [needsScoreKey, setNeedsScoreKey] = useState(false);

  const handleReveal = async () => {
    try {
      const payload = decodeScoreCode(scoreCode.trim());
      
      // Check if score key is required
      if (payload.scoreKeyHash) {
        if (!scoreKey) {
          toast.error("This score requires a score key");
          return;
        }
        const isValid = await verifyScoreKey(payload, scoreKey);
        if (!isValid) {
          toast.error("Incorrect score key");
          return;
        }
      }
      
      setResult({ correct: payload.correct, total: payload.total });
      toast.success("Score revealed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Invalid Score Code");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Paste Score Code</Label>
        <Textarea
          placeholder="Paste your HIDEYS-XXXX code"
          value={scoreCode}
          onChange={e => setScoreCode(e.target.value)}
          className="min-h-[100px] font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-foreground font-medium">Score Key (if required)</Label>
        <Input
          type="password"
          placeholder="Enter score key"
          value={scoreKey}
          onChange={e => setScoreKey(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Enter score key if the quiz creator set one.</p>
      </div>

      <Button onClick={handleReveal} className="w-full">Reveal Score</Button>

      {result && (
        <Card className="p-6 text-center space-y-2">
          <div className="text-lg">Your score: {result.correct} of {result.total}.</div>
        </Card>
      )}
    </div>
  );
}


