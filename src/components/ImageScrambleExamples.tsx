import { Card } from "@/components/ui/card";
import { Shuffle, Grid3x3, Waves } from "lucide-react";

export function ImageScrambleExamples() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Scramble Styles</h3>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 space-y-3 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shuffle className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">Pixel Shuffle</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Splits image into blocks and randomly rearranges them. Perfect reversal by restoring original block positions.
          </p>
        </Card>

        <Card className="p-4 space-y-3 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Grid3x3 className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">Mosaic Blur</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Creates pixelated chunky blocks with color shifts. Original image stored in code for perfect restoration.
          </p>
        </Card>

        <Card className="p-4 space-y-3 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Waves className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">Glitch Lines</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Offsets horizontal bands with color channel shifts. Reverses by applying inverse offsets.
          </p>
        </Card>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
        <h4 className="font-semibold text-foreground mb-2">🔐 Private Pattern</h4>
        <p className="text-sm text-muted-foreground">
          Enable passphrase protection to make your scramble deterministic and secure. 
          Both sender and receiver need the same passphrase to scramble/reveal correctly.
        </p>
      </div>
    </div>
  );
}
