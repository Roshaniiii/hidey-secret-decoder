import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Download, Copy, Loader2 } from "lucide-react";
import { decodeMaskedData, revealImage } from "@/lib/imageMask";

export function ImageDecodeSection() {
  const [encodedCode, setEncodedCode] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealedImage, setRevealedImage] = useState<string>("");

  const handleReveal = async () => {
    if (!encodedCode) {
      toast.error("Please paste the encoded code");
      return;
    }

    if (!passphrase) {
      toast.error("Passphrase is required");
      return;
    }

    setIsRevealing(true);
    toast.loading("🔓 Revealing image...");

    try {
      const { encrypted } = decodeMaskedData(encodedCode);
      const revealed = revealImage(encrypted, passphrase);

      if (!revealed) {
        throw new Error("Incorrect passphrase or corrupted data");
      }

      setRevealedImage(revealed);
      toast.dismiss();
      toast.success("✨ Original image revealed!");
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Failed to reveal image"
      );
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
          <Label htmlFor="encoded-code" className="text-lg font-semibold text-foreground">
            Paste Encoded Code
          </Label>
          <Textarea
            id="encoded-code"
            placeholder="Paste the MASKED:: code here..."
            value={encodedCode}
            onChange={(e) => {
              setEncodedCode(e.target.value);
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
          disabled={!encodedCode || !passphrase || isRevealing}
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
          <h3 className="text-lg font-semibold text-foreground">Revealed Image</h3>

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
