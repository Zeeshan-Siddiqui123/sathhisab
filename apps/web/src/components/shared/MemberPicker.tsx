import { Select, type SelectProps } from "@/components/ui/Select";
import { uiStrings } from "@/lib/uiStrings";

type PickableMember = { id: string; name: string };
/** Pick one active member supplied by the feature. */
export function MemberPicker({
  members,
  label = uiStrings.payer,
  ...props
}: Omit<SelectProps, "options" | "label"> & { members: PickableMember[]; label?: string }) {
  return (
    <Select
      label={label}
      options={members.map((m) => ({ value: m.id, label: m.name }))}
      {...props}
    />
  );
}
