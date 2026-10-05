import { MonthPicker } from "./MonthPicker";
import { Select } from "@/components/ui/Select";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/constants";
import type { Member } from "@/types/ui";
import { uiStrings } from "@/lib/uiStrings";
import { cn } from "@/lib/cn";
export interface FilterValue { month: string; category: string; member: string }
/** Controlled expense filters; the feature decides how to query. */
export function FilterBar({ value, onValueChange, members, className }: { value: FilterValue; onValueChange: (v: FilterValue) => void; members: Member[]; className?: string }) {
 return <div className={cn("grid gap-4 sm:grid-cols-3", className)}><MonthPicker value={value.month} onValueChange={month => onValueChange({ ...value, month })} /><Select label={uiStrings.category} value={value.category || "all"} onValueChange={category => onValueChange({ ...value, category: category === "all" ? "" : category })} options={[{ value: "all", label: uiStrings.allCategories }, ...CATEGORIES.map(value => ({ value, label: CATEGORY_LABELS[value] }))]} /><Select label={uiStrings.member} value={value.member || "all"} onValueChange={member => onValueChange({ ...value, member: member === "all" ? "" : member })} options={[{ value: "all", label: uiStrings.allMembers }, ...members.map(m => ({ value: m.id, label: m.name }))]} /></div>;
}
