import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPatternExample } from "@/lib/encoding";

export function PatternExamples() {
  const examples = [
    { pattern: 'alnum', label: 'Alnum Blocks', example: getPatternExample('alnum') },
    { pattern: 'symbol', label: 'Symbol Stream', example: getPatternExample('symbol') },
    { pattern: 'caps', label: 'Caps Blast', example: getPatternExample('caps') },
    { pattern: 'hex', label: 'Hex Weave', example: getPatternExample('hex') },
    { pattern: 'emoji', label: 'Emoji Mask', example: getPatternExample('emoji') },
  ];

  return (
    <Card className="bg-gradient-to-br from-accent/50 to-card border-2 border-border rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground font-bold">Pattern Examples</CardTitle>
        <p className="text-sm text-muted-foreground">
          Original: "Meet me at the old oak tree"
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {examples.map((ex) => (
          <div key={ex.pattern} className="p-3 bg-card rounded-lg border border-border">
            <div className="text-xs font-semibold text-primary mb-1">{ex.label}</div>
            <div className="text-sm font-mono break-all text-foreground/80">{ex.example}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
