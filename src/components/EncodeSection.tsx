import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PatternSelector } from "./PatternSelector";
import { encodeMessage, PatternType } from "@/lib/encoding";
import { Copy, Lock, Link as LinkIcon, X, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import pako from "pako";

const patternLabels: Record<PatternType, string> = {
  alnum: "Alnum Blocks",
  symbol: "Symbol Stream",
  caps: "Caps Blast",
  hex: "Hex Weave",
};

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

  const handleClear = () => {
    setMessage("");
    setEncoded("");
    setPassphrase("");
    toast({
      title: "Cleared",
      description: "Form has been reset.",
    });
  };

  const handleCopyShareCard = () => {
    const passphraseLine = usePassphrase
      ? "5. Enter the passphrase (ask the sender)\n6. Click Decode ✨"
      : "5. Click Decode ✨";

    const shareCard = `🔐 Someone sent you a secret message via Hidey!

${encoded}

To decode it:
1. Go to ${window.location.origin}
2. Click "Message" tab → "Decode" tab
3. Paste the text above
4. Select pattern: ${patternLabels[pattern]}
${passphraseLine}

Sent via Hidey — Hide it. Share it. Reveal it.`;

    navigator.clipboard.writeText(shareCard);
    toast({
      title: "Share card copied!",
      description: "Paste it in any chat or email.",
    });
  };

  const handleCopyLink = () => {
    try {
      const compressed = pako.deflate(encoded);
      const b64 = btoa(String.fromCharCode(...compressed))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const params = new URLSearchParams();
      params.set("m", b64);
      params.set("p", pattern);
      params.set("compressed", "1");
      if (usePassphrase && passphrase) params.set("pp", "1");

      const url = `${window.location.origin}/?${params.toString()}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Share it anywhere.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Try copying the text instead.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="message" className="text-foreground font-medium">
            Your message
          </Label>
          {(message || encoded || passphrase) && (
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
              Passphrase protection (optional)
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
          <Label className="text-foreground font-semibold">Encoded message</Label>
          <div className="p-4 bg-card rounded-lg border border-border font-mono text-sm break-all">
            {encoded}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="w-full rounded-xl border-2"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy text
            </Button>
            <Button
              onClick={handleCopyShareCard}
              variant="outline"
              className="w-full rounded-xl border-2"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Copy Share Card
            </Button>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full rounded-xl border-2"
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              Copy link
            </Button>
          </div>
          {usePassphrase && passphrase && (
            <p className="text-xs text-muted-foreground">
              🔒 Share the passphrase separately for security.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
