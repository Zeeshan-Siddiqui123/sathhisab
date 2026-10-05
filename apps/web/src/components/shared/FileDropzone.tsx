import { useEffect, useId, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { cn } from "@/lib/cn";
import { uiStrings } from "@/lib/uiStrings";
/** Local image selection only; upload persistence belongs to the feature. */
export function FileDropzone({ value, onValueChange, className }: { value: File | null; onValueChange: (file: File | null) => void; className?: string }) {
 const id = useId();
 const [preview, setPreview] = useState("");
 const [error, setError] = useState("");
 const [dragging, setDragging] = useState(false);
 useEffect(() => {
  if (!value) { setPreview(""); return; }
  const url = URL.createObjectURL(value); setPreview(url);
  return () => URL.revokeObjectURL(url);
 }, [value]);
 const choose = (file?: File) => {
  if (!file) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024 || !file.size) { setError(uiStrings.uploadError); return; }
  setError(""); onValueChange(file);
 };
 return <div className={cn("space-y-3", className)}>
 <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); choose(e.dataTransfer.files[0]); }} className={cn("rounded-card border-2 border-dashed border-border p-6 text-center space-y-3", dragging && "border-primary bg-primary/10")}>
 <Upload className="mx-auto text-muted" aria-hidden="true" /><label htmlFor={id} className="block font-medium">{uiStrings.upload}</label><p id={id + "-hint"} className="text-sm text-muted">{uiStrings.uploadHint}</p><input id={id} type="file" accept="image/jpeg,image/png,image/webp" aria-describedby={id + "-hint"} className="w-full text-sm file:rounded-input file:border-0 file:p-3 file:bg-primary/10 file:text-foreground" onChange={e => { choose(e.target.files?.[0]); e.target.value = ""; }} />
 </div>
 {error ? <Alert tone="danger" title={error} /> : null}
 {preview ? <div className="space-y-3"><img src={preview} alt={uiStrings.preview} className="max-h-48 rounded-input object-contain" onError={() => { setError(uiStrings.imageError); onValueChange(null); }} /><p className="text-sm break-all">{value?.name}</p><Button variant="ghost" onPress={() => { setError(""); onValueChange(null); }}>{uiStrings.removeImage}</Button></div> : null}
 </div>;
}
