import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { PatternType } from "@/lib/encoding";

interface PatternSelectorProps {
  value: PatternType;
  onChange: (value: PatternType) => void;
}

const patterns = [
  { value: 'alnum', label: 'Alnum Blocks', description: 'Grouped lowercase letters & numbers' },
  { value: 'symbol', label: 'Symbol Stream', description: 'Symbols-only mapping' },
  { value: 'caps', label: 'Caps Blast', description: 'Uppercase clusters' },
  { value: 'hex', label: 'Hex Weave', description: 'Hexadecimal-style blocks' },
  { value: 'emoji', label: 'Emoji Mask', description: 'Emojis as mapping' },
  { value: 'custom', label: 'Custom Pattern', description: 'Create your own or use passphrase-derived' },
];

export function PatternSelector({ value, onChange }: PatternSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="pattern" className="text-foreground font-medium">Pick a pattern</Label>
        <Tooltip>
          <TooltipTrigger>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">Choose a pattern. Decoding requires the same pattern.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Select value={value} onValueChange={(v) => onChange(v as PatternType)}>
        <SelectTrigger id="pattern" className="w-full bg-card border-2 border-border rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-2 border-border rounded-xl">
          {patterns.map((pattern) => (
            <SelectItem key={pattern.value} value={pattern.value} className="rounded-lg">
              <div className="flex flex-col items-start">
                <span className="font-medium">{pattern.label}</span>
                <span className="text-xs text-muted-foreground">{pattern.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
