import { Select } from "@/components/ui/Select";
import type { GroupOption } from "@/types/ui";
import { uiStrings } from "@/lib/uiStrings";
/** Group selection delegates navigation to the caller. */
export function GroupSwitcher({ groups, value, onValueChange, className }: { groups: GroupOption[]; value: string; onValueChange: (id: string) => void; className?: string }) { return <Select className={className} label={uiStrings.group} options={groups.map(g => ({ value: g.id, label: g.name }))} value={value} onValueChange={onValueChange} />; }
