import { Select as HeroSelect, SelectItem } from '@heroui/react';
import type { Option } from '@/types/ui';
import { cn } from '@/lib/cn';

export interface SelectProps {
  label: string;
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  helper?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  className?: string;
}

/** Single selection with stable string keys and visible labels. */
export function Select({ label, options, value, onValueChange, error, helper, className, ...props }: SelectProps) {
  const selectedKeys = value === undefined ? [] : [value];
  const disabledKeys = options.filter((option) => option.disabled).map((option) => option.value);

  return (
    <HeroSelect
      label={label}
      labelPlacement='outside'
      variant='bordered'
      {...props}
      className={cn('min-w-0', className)}
      selectedKeys={selectedKeys}
      disabledKeys={disabledKeys}
      onSelectionChange={(keys) => {
        if (keys === 'all') return;
        const next = Array.from(keys).map(String)[0];
        if (next !== undefined) onValueChange?.(next);
      }}
      popoverProps={{
        placement: 'bottom',
        shouldBlockScroll: false,
        // Raise the positioned portal wrapper above the modal, not just its content.
        style: { zIndex: 100 },
      }}
      isInvalid={!!error}
      errorMessage={error}
      description={helper}
    >
      {options.map((option) => (
        <SelectItem key={option.value} textValue={option.label}>
          {option.label}
        </SelectItem>
      ))}
    </HeroSelect>
  );
}
