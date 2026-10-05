import { Select as HeroSelect, SelectItem } from "@heroui/react";
import type { Option } from "@/types/ui";
import { cn } from "@/lib/cn";
export interface SelectProps { label: string; options: Option[]; value?: string; onValueChange?: (value: string) => void; error?: string; helper?: string; placeholder?: string; isDisabled?: boolean; isRequired?: boolean; className?: string }
/** Single selection with stable string keys and visible labels. */
export function Select({ label, options, value, onValueChange, error, helper, className, ...props }: SelectProps) {
 return <HeroSelect label={label} labelPlacement="outside" variant="bordered" {...props} className={cn("min-w-0", className)} selectedKeys={value ? [value] : []} disabledKeys={options.filter(o => o.disabled).map(o => o.value)} onSelectionChange={keys => { if (keys !== "all") onValueChange?.(String([...keys][0] ?? "")); }} isInvalid={!!error} errorMessage={error} description={helper}>
 {options.map(option => <SelectItem key={option.value} textValue={option.label}>{option.label}</SelectItem>)}
 </HeroSelect>;
}
