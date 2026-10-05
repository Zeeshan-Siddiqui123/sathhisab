import { Select, type SelectProps } from "@/components/ui/Select";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/constants";
import { uiStrings } from "@/lib/uiStrings";
/** Central category options for forms. */
export function CategorySelect(props: Omit<SelectProps, "options" | "label">) { return <Select label={uiStrings.category} options={CATEGORIES.map(value => ({ value, label: CATEGORY_LABELS[value] }))} {...props} />; }
