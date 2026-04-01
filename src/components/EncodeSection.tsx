import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PatternSelector } from "./PatternSelector";
import { encodeMessage, PatternType } from "@/lib/encoding";
import { Copy, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function EncodeSection() {
  const [message, setMessage] = useState("");
  const [pattern, setPattern] = useState<PatternType>("alnum");
  const [usePassphrase, setUsePassphrase] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [encoded, setEncoded] = useState("");

  const handleEncode = () => {
    if (!message) {
      toast({
        title: "No message yet",
        description: "Type something fun to hide!",
        variant: "destructive",
      });
      return;
    }

    if (message.length > 10000) {
      toast({
        title: "Message too long",
        description: "Maximum 10,000 characters allowed.",
        variant: "destructive",
      });
      return;
    }

    const result = encodeMessage(
      message,
      pattern,
      usePassphrase ? passphrase : undefined
    );
    
    setEncoded(result);
    toast({
      title: "Message encoded!",
      description: "Copy or share it.",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(encoded);
    toast({
      title: "Copied!",
      description: "Encoded message copied to clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="message" className="text-foreground font-medium">
          Your message
        </Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px] bg-card border-2 border-border rounded-xl resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Emoji & unicode supported • {message.length}/10,000 characters
        </p>
      </div>

      <PatternSelector value={pattern} onChange={setPattern} />

      <div className="space-y-3 p-4 bg-accent/30 rounded-xl border-2 border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <Label htmlFor="use-passphrase" className="text-foreground font-medium cursor-pointer">
              Private pattern (optional)
            </Label>
          </div>
          <Switch
            id="use-passphrase"
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
          This is a secret code that protects your message. Others need this password to decode it.
        </p>
      </div>

      <Button 
        onClick={handleEncode}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        Encode
      </Button>

      {encoded && (
        <div className="space-y-3 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border-2 border-primary/20">
          <Label className="text-foreground font-semibold">Obfuscated message</Label>
          <p className="text-xs text-muted-foreground">⚠️ This is obfuscation for fun — not cryptographic encryption. Do not use for sensitive data.</p>
          <div className="p-4 bg-card rounded-lg border border-border font-mono text-sm break-all">
            {encoded}
          </div>
          <Button
            onClick={handleCopy}
            variant="outline"
            className="w-full rounded-xl border-2"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy text
          </Button>
        </div>
      )}
    </div>
  );
}
