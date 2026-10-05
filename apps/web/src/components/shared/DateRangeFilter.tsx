import { Input } from "@/components/ui/Input";
import { uiStrings } from "@/lib/uiStrings";
import { cn } from "@/lib/cn";
/** Date-only ISO range; invalid ordering stays visible to the caller. */
export function DateRangeFilter({ value, onValueChange, className }: { value: { start: string; end: string }; onValueChange: (value: { start: string; end: string }) => void; className?: string }) {
 return <div className={cn("grid sm:grid-cols-2 gap-4", className)}><Input type="date" label={uiStrings.startDate} value={value.start} onValueChange={start => onValueChange({ ...value, start })} /><Input type="date" label={uiStrings.endDate} min={value.start} value={value.end} onValueChange={end => onValueChange({ ...value, end })} error={value.start && value.end && value.end < value.start ? uiStrings.dateError : undefined} /></div>;
}
