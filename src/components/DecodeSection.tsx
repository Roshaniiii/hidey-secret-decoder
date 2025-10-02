import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PatternSelector } from "./PatternSelector";
import { decodeMessage, PatternType } from "@/lib/encoding";
import { Lock, Unlock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function DecodeSection() {
  const [encoded, setEncoded] = useState("");
  const [pattern, setPattern] = useState<PatternType>("alnum");
  const [usePassphrase, setUsePassphrase] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [decoded, setDecoded] = useState("");

  const handleDecode = () => {
    if (!encoded) {
      toast({
        title: "No encoded message",
        description: "Paste an encoded message first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = decodeMessage(
        encoded,
        pattern,
        usePassphrase ? passphrase : undefined
      );
      
      if (!result) {
        toast({
          title: "Decode failed",
          description: "Check pattern or passphrase.",
          variant: "destructive",
        });
        return;
      }
      
      setDecoded(result);
      toast({
        title: "Message decoded successfully!",
        description: "Your original message has been revealed.",
      });
    } catch (error) {
      toast({
        title: "Decode failed",
        description: "Message is corrupted or pattern is incorrect.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="encoded" className="text-foreground font-medium">
          Encoded message
        </Label>
        <Textarea
          id="encoded"
          placeholder="Paste encoded text here..."
          value={encoded}
          onChange={(e) => setEncoded(e.target.value)}
          className="min-h-[120px] bg-card border-2 border-border rounded-xl resize-none font-mono"
        />
      </div>

      <PatternSelector value={pattern} onChange={setPattern} />

      <div className="space-y-3 p-4 bg-accent/30 rounded-xl border-2 border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <Label htmlFor="use-passphrase-decode" className="text-foreground font-medium cursor-pointer">
              Private pattern (optional)
            </Label>
          </div>
          <Switch
            id="use-passphrase-decode"
            checked={usePassphrase}
            onCheckedChange={setUsePassphrase}
          />
        </div>
        {usePassphrase && (
          <Input
            type="password"
            placeholder="Enter passphrase"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className="bg-card border-2 border-border rounded-xl"
          />
        )}
        <p className="text-xs text-muted-foreground">
          This is a secret code that protects the message. You need the same password to decode it.
        </p>
      </div>

      <Button 
        onClick={handleDecode}
        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        <Unlock className="mr-2 h-4 w-4" />
        Decode
      </Button>

      {decoded && (
        <div className="space-y-3 p-6 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-xl border-2 border-secondary/20">
          <Label className="text-foreground font-semibold">Original message</Label>
          <div className="p-4 bg-card rounded-lg border border-border break-words">
            {decoded}
          </div>
        </div>
      )}
    </div>
  );
}
