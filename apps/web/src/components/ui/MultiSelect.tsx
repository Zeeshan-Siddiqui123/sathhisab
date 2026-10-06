import { Select as HeroSelect, SelectItem } from "@heroui/react";
import type { SelectProps } from "./Select";
import { cn } from "@/lib/cn";
/** Multiple selections emit an array of stable option keys. */
export function MultiSelect({ label, options, value = [], onValueChange, error, helper, className, ...props }: Omit<SelectProps, "value" | "onValueChange"> & { value?: string[]; onValueChange?: (value: string[]) => void }) {
 return <HeroSelect label={label} labelPlacement="outside" variant="bordered" selectionMode="multiple" {...props} className={cn("min-w-0", className)} selectedKeys={value} disabledKeys={options.filter(o => o.disabled).map(o => o.value)} onSelectionChange={keys => onValueChange?.(keys === "all" ? options.filter(o => !o.disabled).map(o => o.value) : [...keys].map(String))} isInvalid={!!error} errorMessage={error} description={helper} popoverProps={{ placement: 'bottom', shouldBlockScroll: false, style: { zIndex: 100 } }}>
 {options.map(option => <SelectItem key={option.value} textValue={option.label}>{option.label}</SelectItem>)}
 </HeroSelect>;
}
