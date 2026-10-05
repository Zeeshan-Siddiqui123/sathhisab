import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { IconButton } from "@/components/ui/IconButton";
import { uiStrings } from "@/lib/uiStrings";
/** Read-only text and clipboard feedback, including permission failures. */
export function CopyField({ label, value, className }: { label: string; value: string; className?: string }) {
 const [copiedValue, setCopiedValue] = useState<string | null>(null);
 const [error, setError] = useState("");
 const copied = copiedValue === value;
 const copy = async () => { try { await navigator.clipboard.writeText(value); setCopiedValue(value); setError(""); } catch { setError(uiStrings.copyFailed); } };
 return <Input className={className} label={label} value={value} isReadOnly error={error} helper={copied ? uiStrings.copied : undefined} endContent={<IconButton aria-label={copied ? uiStrings.copied : uiStrings.copy} onPress={() => void copy()}>{copied ? <Check size={18} /> : <Copy size={18} />}</IconButton>} />;
}
