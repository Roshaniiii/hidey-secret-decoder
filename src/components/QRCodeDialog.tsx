import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  title?: string;
  fileName?: string;
}

export function QRCodeDialog({
  open,
  onOpenChange,
  shareUrl,
  title = "Scan to open",
  fileName = "hidey-qr",
}: QRCodeDialogProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const svg = wrapperRef.current?.querySelector("svg");
    if (!svg) return;
    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      img.onload = () => {
        const size = 600;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = "#FFF8E1";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);
        const a = document.createElement("a");
        a.download = `${fileName}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
        toast({ title: "Downloaded!", description: "QR Code saved as PNG." });
      };
      img.src = url;
    } catch {
      toast({ title: "Download failed", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Recipient scans this with their phone camera.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <div
            ref={wrapperRef}
            className="p-4 rounded-xl border-2 border-primary/30 bg-[hsl(48_100%_97%)]"
          >
            <QRCodeSVG
              value={shareUrl}
              size={200}
              bgColor="hsl(48 100% 97%)"
              fgColor="hsl(330 85% 55%)"
              level="M"
            />
          </div>
          <Button onClick={handleDownload} variant="outline" className="w-full rounded-xl border-2">
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
