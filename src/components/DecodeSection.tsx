import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PatternSelector } from "./PatternSelector";
import { decodeMessage, PatternType } from "@/lib/encoding";
import { Lock, Unlock, Sparkles, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DecodeSectionProps {
  initialMessage?: string | null;
  initialPattern?: PatternType | null;
  sharedHasPassphrase?: boolean;
}

export function DecodeSection({ initialMessage, initialPattern, sharedHasPassphrase }: DecodeSectionProps = {}) {
  const [encoded, setEncoded] = useState("");
  const [pattern, setPattern] = useState<PatternType>("alnum");
  const [usePassphrase, setUsePassphrase] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [decoded, setDecoded] = useState("");
  const [showSharedBanner, setShowSharedBanner] = useState(false);

  useEffect(() => {
    if (initialMessage) {
      setEncoded(initialMessage);
      setShowSharedBanner(true);
    }
    if (initialPattern) setPattern(initialPattern);
    if (sharedHasPassphrase) setUsePassphrase(true);
  }, [initialMessage, initialPattern, sharedHasPassphrase]);

  const handleClear = () => {
    setEncoded("");
    setDecoded("");
    setPassphrase("");
    setShowSharedBanner(false);
    toast({
      title: "Cleared",
      description: "Form has been reset.",
    });
  };

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
      {showSharedBanner && (
        <div className="p-4 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            🔗 Someone shared a secret message with you!
          </div>
          <p className="text-sm text-muted-foreground">Hit Decode to reveal it.</p>
          {sharedHasPassphrase && (
            <p className="text-sm text-muted-foreground">
              🔒 This message is passphrase protected. Ask the sender for the passphrase.
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="encoded" className="text-foreground font-medium">
            Encoded message
          </Label>
          {(encoded || decoded || passphrase) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="mr-1 h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
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
              Passphrase protection (optional)
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
