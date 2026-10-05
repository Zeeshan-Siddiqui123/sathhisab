import { RadioGroup as HeroRadioGroup, Radio, type RadioGroupProps } from "@heroui/react";
import type { Option } from "@/types/ui";
import { cn } from "@/lib/cn";
/** Radio options with a shared accessible group label. */
export function RadioGroup({ options, className, ...props }: Omit<RadioGroupProps, "children"> & { options: Option[] }) {
 return <HeroRadioGroup {...props} className={cn("gap-3", className)}>{options.map(o => <Radio key={o.value} value={o.value} isDisabled={o.disabled}>{o.label}</Radio>)}</HeroRadioGroup>;
}
