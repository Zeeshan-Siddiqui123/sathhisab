import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { Option } from "@/types/ui";
import { cn } from "@/lib/cn";

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

function firstEnabledIndex(options: Option[]) {
  return options.findIndex((option) => !option.disabled);
}

function nextEnabledIndex(options: Option[], current: number, direction: 1 | -1) {
  if (!options.length) return -1;
  for (let offset = 1; offset <= options.length; offset += 1) {
    const index = (current + offset * direction + options.length) % options.length;
    if (!options[index]?.disabled) return index;
  }
  return -1;
}

/** Portal-free custom select that works inside modals and drawers. */
export function Select({
  label,
  options,
  value,
  onValueChange,
  error,
  helper,
  placeholder = "Select an option",
  isDisabled,
  isRequired,
  className,
}: SelectProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxId = `${id}-listbox`;
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => {
    const enabled = firstEnabledIndex(options);
    return selectedOption ? selectedIndex : Math.max(0, enabled);
  });

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const enabled = firstEnabledIndex(options);
    setActiveIndex(selectedOption ? selectedIndex : Math.max(0, enabled));
  }, [open, options, selectedIndex, selectedOption]);

  const choose = (option: Option) => {
    if (option.disabled) return;
    onValueChange?.(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => {
        const fallback = firstEnabledIndex(options);
        const start = current >= 0 ? current : fallback;
        return nextEnabledIndex(options, start, event.key === "ArrowDown" ? 1 : -1);
      });
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const option = options[activeIndex];
      if (option) choose(option);
    }
  };

  const helpId = error || helper ? `${id}-help` : undefined;

  return (
    <div ref={rootRef} className={cn("relative min-w-0 space-y-1", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {isRequired ? <span className="ml-1 text-danger">*</span> : null}
      </label>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-describedby={helpId}
        aria-invalid={!!error}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex min-h-11 w-full items-center justify-between gap-3 rounded-input border bg-surface px-3 py-2 text-left text-sm outline-none transition",
          "border-border hover:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
          error && "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
          isDisabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span className={cn("min-w-0 truncate", !selectedOption && "text-muted")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={cn("shrink-0 text-muted transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute z-[70] mt-2 max-h-64 w-full overflow-auto rounded-input border border-border bg-surface p-1 shadow-lg"
        >
          {options.map((option, index) => {
            const selected = option.value === value;
            const active = index === activeIndex;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={option.disabled}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(option)}
                className={cn(
                  "flex min-h-10 w-full items-center justify-between gap-3 rounded-input px-3 py-2 text-left text-sm outline-none",
                  active && "bg-primary/10 text-primary",
                  selected && "font-semibold",
                  option.disabled && "cursor-not-allowed opacity-50",
                )}
              >
                <span className="min-w-0 truncate">{option.label}</span>
                {selected ? <Check size={16} aria-hidden="true" className="shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
      {error || helper ? (
        <p id={helpId} className={cn("text-xs", error ? "text-danger" : "text-muted")}>
          {error ?? helper}
        </p>
      ) : null}
    </div>
  );
}
