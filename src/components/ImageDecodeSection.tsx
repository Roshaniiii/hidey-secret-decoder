import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Download, Copy, Loader2 } from "lucide-react";
import { decodeShortCode, revealImage } from "@/lib/imageMask";

export function ImageDecodeSection() {
  const [shortCode, setShortCode] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealedImage, setRevealedImage] = useState<string>("");

  // Check for URL query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      setShortCode(`HIDEY-${code}`);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const handleReveal = async () => {
    if (!shortCode) {
      toast.error("Please paste the code");
      return;
    }

    if (!passphrase) {
      toast.error("Passphrase is required");
      return;
    }

    setIsRevealing(true);

    try {
      const { encrypted } = decodeShortCode(shortCode.trim());
      const revealed = await revealImage(encrypted, passphrase);

      if (!revealed) {
        throw new Error("Incorrect passphrase");
      }

      setRevealedImage(revealed);
      toast.success("✨ Original image revealed!");
    } catch (error) {
      if (error instanceof Error && error.message.includes("Invalid or corrupted")) {
        toast.error("⚠️ Invalid or expired code. Please recheck or ask the sender to regenerate it.");
      } else if (error instanceof Error && error.message.includes("Incorrect passphrase")) {
        toast.error("❌ Incorrect passphrase. Try again.");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to reveal image"
        );
      }
    } finally {
      setIsRevealing(false);
    }
  };

  const handleDownload = () => {
    if (!revealedImage) return;

    const link = document.createElement("a");
    link.href = revealedImage;
    link.download = "revealed-image.png";
    link.click();

    toast.success("✅ Downloaded!");
  };

  const handleCopy = async () => {
    if (!revealedImage) return;

    try {
      const blob = await (await fetch(revealedImage)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      toast.success("✅ Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy image");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="short-code" className="text-base font-semibold text-foreground">
            Paste Code
          </Label>
          <Textarea
            id="short-code"
            placeholder="Paste your HIDEY-XXXXXX code here..."
            value={shortCode}
            onChange={(e) => {
              setShortCode(e.target.value.trim());
              setRevealedImage("");
            }}
            className="mt-2 min-h-[100px] font-mono text-sm"
          />
        </div>

        <div>
          <Label htmlFor="passphrase" className="text-base font-semibold text-foreground">
            Passphrase
          </Label>
          <Input
            id="passphrase"
            type="password"
            placeholder="Enter passphrase"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className="mt-2"
          />
        </div>

        <Button
          onClick={handleReveal}
          disabled={!shortCode || !passphrase || isRevealing}
          className="w-full"
          size="lg"
        >
          {isRevealing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Revealing...
            </>
          ) : (
            "🔓 Reveal Image"
          )}
        </Button>
      </div>

      {revealedImage && (
        <div className="space-y-4 pt-6 border-t border-border">
          <h3 className="text-base font-semibold text-foreground">Revealed Image</h3>

          <Card className="p-4 bg-muted/30">
            <img
              src={revealedImage}
              alt="Revealed"
              className="max-h-64 mx-auto rounded-lg shadow-md"
            />
          </Card>

          <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={handleCopy} variant="outline" className="flex-1">
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
