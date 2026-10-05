import { useState } from "react";
import { Input, type InputProps } from "./Input";
import { fromPaisa } from "@/lib/money";
import { uiStrings } from "@/lib/uiStrings";
export interface MoneyInputProps extends Omit<InputProps, "value" | "defaultValue" | "onChange" | "onValueChange" | "type"> { value: number | null; onValueChange: (paisa: number | null) => void }
/** Rupee text stays editable; callbacks contain exact safe integer paisa, or null when empty. */
export function MoneyInput({ value, onValueChange, ...props }: MoneyInputProps) {
 const [draft, setDraft] = useState<{ text: string; paisa: number | null }>({ text: value === null ? "" : fromPaisa(value), paisa: value });
 const text = draft.paisa === value ? draft.text : value === null ? "" : fromPaisa(value);
 const change = (next: string) => {
  if (!/^\d*(\.\d{0,2})?$/.test(next)) return;
  const [whole = "", fraction = ""] = next.split(".");
  const amount = next === "" || next === "." ? null : BigInt(whole || "0") * 100n + BigInt(fraction.padEnd(2, "0"));
  if (amount !== null && amount > BigInt(Number.MAX_SAFE_INTEGER)) return;
  const paisa = amount === null ? null : Number(amount);
  setDraft({ text: next, paisa }); onValueChange(paisa);
 };
 return <Input label={uiStrings.amount} {...props} type="text" inputMode="decimal" startContent={<span aria-hidden="true">Rs</span>} value={text} onValueChange={change} />;
}
