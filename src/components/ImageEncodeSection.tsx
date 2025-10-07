import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, Loader2, Upload } from "lucide-react";
import {
  maskImage,
  generateShortCode,
  MaskResult,
} from "@/lib/imageMask";

export function ImageEncodeSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [passphrase, setPassphrase] = useState("");
  const [isMasking, setIsMasking] = useState(false);
  const [maskedResult, setMaskedResult] = useState<MaskResult | null>(null);
  const [shortCode, setShortCode] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      toast.error("Please select a PNG or JPG image");
      return;
    }

    setSelectedFile(file);
    setMaskedResult(null);
    setShortCode("");

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    toast.success("Image loaded");
  };

  const handleMask = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    if (!passphrase) {
      toast.error("Passphrase is required to mask the image");
      return;
    }

    setIsMasking(true);

    try {
      const result = await maskImage(selectedFile, "blur", passphrase);
      const code = generateShortCode(result);
      
      setMaskedResult(result);
      setShortCode(code);
      
      toast.success("✨ Image masked & encrypted!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to mask image"
      );
    } finally {
      setIsMasking(false);
    }
  };

  const handleDownloadMasked = () => {
    if (!maskedResult) return;

    const link = document.createElement("a");
    link.href = maskedResult.maskedPreview;
    link.download = "masked-image.png";
    link.click();

    toast.success("✅ Downloaded masked image!");
  };

  const handleCopyCode = () => {
    if (!shortCode) return;

    navigator.clipboard.writeText(shortCode);
    toast.success("✅ Code copied!");
  };

  // Share option removed as requested

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="file-upload" className="text-base font-semibold text-foreground">
            Upload Image
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
              {selectedFile ? selectedFile.name : "Choose Image"}
            </Button>
          </div>
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
          <Label htmlFor="passphrase" className="text-base font-semibold text-foreground">
            Passphrase (Required)
          </Label>
          <Input
            id="passphrase"
            type="password"
            placeholder="Enter a strong passphrase"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            🔒 Your image will be encrypted with this passphrase
          </p>
        </div>

        <Button
          onClick={handleMask}
          disabled={!selectedFile || !passphrase || isMasking}
          className="w-full"
          size="lg"
        >
          {isMasking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Masking...
            </>
          ) : (
            "🎭 Mask Image"
          )}
        </Button>
      </div>

      {maskedResult && shortCode && (
        <div className="space-y-4 pt-6 border-t border-border">
          <h3 className="text-base font-semibold text-foreground">Masked Result</h3>

          <Card className="p-4 bg-muted/30">
            <img
              src={maskedResult.maskedPreview}
              alt="Masked"
              className="max-h-64 mx-auto rounded-lg shadow-md"
            />
          </Card>

          <div className="p-4 bg-muted rounded-lg space-y-3">
            <div>
              <Label className="text-sm font-medium text-foreground">
                Your Share Code:
              </Label>
              <div className="mt-2 p-3 bg-background rounded font-mono text-sm break-all">
                {shortCode}
              </div>
            </div>
            
            <Button onClick={handleCopyCode} variant="outline" className="w-full">
              <Copy className="mr-2 h-4 w-4" />
              Copy Code
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            💡 Share this code. Only those with the correct passphrase can reveal the original image.
          </p>
        </div>
      )}
    </div>
  );
}
