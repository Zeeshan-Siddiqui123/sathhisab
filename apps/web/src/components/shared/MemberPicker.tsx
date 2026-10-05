import type { Member } from "@/types/ui";
import { Select, type SelectProps } from "@/components/ui/Select";
import { uiStrings } from "@/lib/uiStrings";
/** Pick one active member supplied by the feature. */
export function MemberPicker({ members, label = uiStrings.payer, ...props }: Omit<SelectProps, "options" | "label"> & { members: Member[]; label?: string }) { return <Select label={label} options={members.map(m => ({ value: m.id, label: m.name }))} {...props} />; }
