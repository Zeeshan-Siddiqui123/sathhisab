import { Input, type InputProps } from "@/components/ui/Input";
import { uiStrings } from "@/lib/uiStrings";
/** Native month input emits YYYY-MM. */
export function MonthPicker(props: InputProps) { return <Input label={uiStrings.month} {...props} type="month" />; }
