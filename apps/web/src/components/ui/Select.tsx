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
  const selectedKeys = value === undefined ? new Set<string>() : new Set([value]);
  const disabledKeys = new Set(options.filter((option) => option.disabled).map((option) => option.value));

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
        const [next] = Array.from(keys).map(String);
        onValueChange?.(next ?? '');
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