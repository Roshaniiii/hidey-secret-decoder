import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Download, Copy, Loader2, Upload } from "lucide-react";
import {
  unscrambleImage,
  loadImageFromBase64,
  loadImageFromFile,
  decodeScrambledData,
} from "@/lib/imageScramble";

export function ImageDecodeSection() {
  const [scrambledCode, setScrambledCode] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealedImage, setRevealedImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      toast.error("Please select a PNG or JPG image");
      return;
    }

    setUploadedFile(file);
    setScrambledCode("");
    setRevealedImage("");
    toast.success("Image uploaded");
  };

  const handleReveal = async () => {
    if (!scrambledCode && !uploadedFile) {
      toast.error("Please paste scrambled code or upload an image");
      return;
    }

    setIsRevealing(true);
    toast.loading("🌀 Unscrambling…");

    try {
      let image: HTMLImageElement;
      let style: string;
      let hasPassphrase: boolean;

      if (scrambledCode) {
        // Decode from code
        const decoded = decodeScrambledData(scrambledCode);
        image = await loadImageFromBase64(decoded.base64);
        style = decoded.metadata.style;
        hasPassphrase = decoded.metadata.hasPassphrase;
      } else if (uploadedFile) {
        // Load from file - attempt to extract metadata from filename or use default
        image = await loadImageFromFile(uploadedFile);
        style = "pixel-shuffle"; // Default style
        hasPassphrase = false;
        toast("Note: Using default Pixel Shuffle style for uploaded image", {
          duration: 3000,
        });
      } else {
        throw new Error("No image data provided");
      }

      if (hasPassphrase && !passphrase) {
        toast.dismiss();
        toast.error("This image requires a passphrase to reveal");
        setIsRevealing(false);
        return;
      }

      const revealed = await unscrambleImage(
        image,
        style as any,
        passphrase || undefined
      );

      setRevealedImage(revealed);
      toast.dismiss();
      toast.success("✨ Revealed! Image unscrambled");
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
          <Label htmlFor="scrambled-code" className="text-lg font-semibold text-foreground">
            Paste Scrambled Image Code
          </Label>
          <Textarea
            id="scrambled-code"
            placeholder="Paste the scrambled code here..."
            value={scrambledCode}
            onChange={(e) => {
              setScrambledCode(e.target.value);
              setUploadedFile(null);
              setRevealedImage("");
            }}
            className="mt-2 min-h-[100px] font-mono text-sm"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div>
          <Label htmlFor="file-upload" className="text-lg font-semibold text-foreground">
            Upload Scrambled Image
          </Label>
          <div className="mt-2">
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploadedFile ? uploadedFile.name : "Choose File"}
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="passphrase" className="text-base font-semibold text-foreground">
            Passphrase (if required)
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
          disabled={(!scrambledCode && !uploadedFile) || isRevealing}
          className="w-full"
          size="lg"
        >
          {isRevealing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Revealing...
            </>
          ) : (
            "Reveal Image"
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
