import type { Member } from "@/types/ui";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { Button } from "@/components/ui/Button";
import { uiStrings } from "@/lib/uiStrings";
import { cn } from "@/lib/cn";
/** Participant selection with select-all/clear convenience. */
export function MemberMultiPicker({ members, value, onValueChange, error, className }: { members: Member[]; value: string[]; onValueChange: (ids: string[]) => void; error?: string; className?: string }) {
 const all = members.length > 0 && members.every(m => value.includes(m.id));
 return <div className={cn("space-y-2", className)}><MultiSelect label={uiStrings.participants} options={members.map(m => ({ value: m.id, label: m.name }))} value={value} onValueChange={onValueChange} error={error} /><Button size="sm" variant="ghost" onPress={() => onValueChange(all ? [] : members.map(m => m.id))}>{all ? uiStrings.clearAll : uiStrings.selectAll}</Button></div>;
}
