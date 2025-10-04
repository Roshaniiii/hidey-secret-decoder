import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Download, Copy, Loader2 } from "lucide-react";
import {
  scrambleImage,
  loadImageFromFile,
  encodeScrambledData,
  type ScrambleStyle,
  type ScrambleResult,
} from "@/lib/imageScramble";

export function ImageEncodeSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [scrambleStyle, setScrambleStyle] = useState<ScrambleStyle>("pixel-shuffle");
  const [usePassphrase, setUsePassphrase] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [isScrambling, setIsScrambling] = useState(false);
  const [scrambledResult, setScrambledResult] = useState<ScrambleResult | null>(null);
  const [scrambledCode, setScrambledCode] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      toast.error("Please select a PNG or JPG image");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setScrambledResult(null);
    setScrambledCode("");
  };

  const handleScramble = async () => {
    if (!selectedFile) {
      toast.error("Please upload an image first");
      return;
    }

    if (usePassphrase && !passphrase.trim()) {
      toast.error("Please enter a passphrase or disable private pattern");
      return;
    }

    setIsScrambling(true);
    toast.loading("🌀 Scrambling pixels…");

    try {
      const image = await loadImageFromFile(selectedFile);
      const result = await scrambleImage(
        image,
        scrambleStyle,
        usePassphrase ? passphrase : undefined
      );

      setScrambledResult(result);
      const encoded = encodeScrambledData(result);
      setScrambledCode(encoded);

      toast.dismiss();
      toast.success("✨ Done! Image scrambled successfully");
    } catch (error) {
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : "Failed to scramble image");
    } finally {
      setIsScrambling(false);
    }
  };

  const handleDownload = () => {
    if (!scrambledResult) return;

    const link = document.createElement("a");
    link.href = scrambledResult.base64;
    link.download = "scrambled-image.png";
    link.click();

    toast.success("✅ Downloaded!");
  };

  const handleCopyCode = async () => {
    if (!scrambledCode) return;

    try {
      await navigator.clipboard.writeText(scrambledCode);
      toast.success("✅ Copied! Share this code with your friend");
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="image-upload" className="text-lg font-semibold text-foreground">
            Upload your image
          </Label>
          <Input
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleFileSelect}
            className="mt-2"
          />
        </div>

        {previewUrl && (
          <Card className="p-4 bg-muted/30">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg shadow-md"
            />
          </Card>
        )}

        <div>
          <Label className="text-lg font-semibold text-foreground">
            Choose a scramble style
          </Label>
          <Select
            value={scrambleStyle}
            onValueChange={(value) => setScrambleStyle(value as ScrambleStyle)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pixel-shuffle">
                <div>
                  <div className="font-semibold">Pixel Shuffle</div>
                  <div className="text-xs text-muted-foreground">
                    Randomly rearrange small square blocks
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="mosaic-blur">
                <div>
                  <div className="font-semibold">Mosaic Blur</div>
                  <div className="text-xs text-muted-foreground">
                    Pixelated chunky blocks
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="glitch-lines">
                <div>
                  <div className="font-semibold">Glitch Lines</div>
                  <div className="text-xs text-muted-foreground">
                    Offset horizontal color stripes (glitchy effect)
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="use-passphrase" className="text-base font-semibold">
              Private pattern (optional)
            </Label>
            <Switch
              id="use-passphrase"
              checked={usePassphrase}
              onCheckedChange={setUsePassphrase}
            />
          </div>

          {usePassphrase && (
            <div>
              <Input
                type="password"
                placeholder="Enter passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This secret code protects your image. Others need this to reveal it.
              </p>
            </div>
          )}
        </div>

        <Button
          onClick={handleScramble}
          disabled={!selectedFile || isScrambling}
          className="w-full"
          size="lg"
        >
          {isScrambling ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scrambling...
            </>
          ) : (
            "Scramble Image"
          )}
        </Button>
      </div>

      {scrambledResult && (
        <div className="space-y-4 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground">Scrambled Result</h3>

          <Card className="p-4 bg-muted/30">
            <img
              src={scrambledResult.base64}
              alt="Scrambled"
              className="max-h-64 mx-auto rounded-lg shadow-md"
            />
          </Card>

          <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={handleCopyCode} variant="outline" className="flex-1">
              <Copy className="mr-2 h-4 w-4" />
              Copy Code
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
