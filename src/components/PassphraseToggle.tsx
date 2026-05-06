import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Lock } from "lucide-react";

interface PassphraseToggleProps {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  passphrase: string;
  onPassphraseChange: (v: string) => void;
  id?: string;
  label?: string;
  description?: string;
  placeholder?: string;
}

export function PassphraseToggle({
  enabled,
  onEnabledChange,
  passphrase,
  onPassphraseChange,
  id = "use-passphrase",
  label = "Passphrase protection (optional)",
  description = "This is a secret code that protects your message. Others need this password to decode it.",
  placeholder = "Enter passphrase",
}: PassphraseToggleProps) {
  return (
    <div className="space-y-3 p-4 bg-accent/30 rounded-xl border-2 border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          <Label htmlFor={id} className="text-foreground font-medium cursor-pointer">
            {label}
          </Label>
        </div>
        <Switch id={id} checked={enabled} onCheckedChange={onEnabledChange} />
      </div>
      {enabled && (
        <Input
          type="password"
          placeholder={placeholder}
          value={passphrase}
          onChange={(e) => onPassphraseChange(e.target.value)}
          className="bg-card border-2 border-border rounded-xl"
        />
      )}
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
