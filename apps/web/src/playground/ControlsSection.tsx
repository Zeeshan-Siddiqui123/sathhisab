import { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { Showcase } from "./Showcase";
import { copy, members, splitOptions } from "./fixtures";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { Checkbox } from "@/components/ui/Checkbox";
import { Switch } from "@/components/ui/Switch";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { DatePicker } from "@/components/ui/DatePicker";
import { Grid } from "@/components/ui/Grid";
import { Stack } from "@/components/ui/Stack";
import { Text } from "@/components/ui/Text";
import { FormSection } from "@/components/shared/FormSection";
import { MemberPicker } from "@/components/shared/MemberPicker";
import { MemberMultiPicker } from "@/components/shared/MemberMultiPicker";
import { CategorySelect } from "@/components/shared/CategorySelect";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { MonthPicker } from "@/components/shared/MonthPicker";
import { SearchInput } from "@/components/shared/SearchInput";
/** Form examples remain independently editable. */
export function ControlsSection() {
 const [amount, setAmount] = useState<number | null>(10050);
 const [split, setSplit] = useState("equal");
 const [member, setMember] = useState("zeeshan");
 const [participants, setParticipants] = useState(["zeeshan", "ali"]);
 const [category, setCategory] = useState("GROCERY");
 const [range, setRange] = useState({ start: "", end: "" });
 const [query, setQuery] = useState("");
 return <Stack>
 <Showcase title={copy.buttons}><Stack className="flex-row flex-wrap">{(["primary","secondary","ghost","danger","soft"] as const).map(variant => <Button key={variant} variant={variant}>{variant}</Button>)}</Stack><Stack className="flex-row flex-wrap">{(["sm","md","lg"] as const).map(size => <Button key={size} size={size} variant="secondary">{size}</Button>)}<IconButton aria-label={copy.action}><Plus size={20} /></IconButton><Button leftIcon={<Plus size={16} />} rightIcon={<ArrowRight size={16} />}>{copy.action}</Button><Button isDisabled>{copy.disabled}</Button><Button isLoading>{copy.loading}</Button></Stack><Button fullWidth variant="soft">{copy.action}</Button></Showcase>
 <Grid>
 <Showcase title={copy.fields}><FormSection title={copy.name} description={copy.helper}><Input label={copy.name} placeholder={copy.placeholder} helper={copy.helper} isClearable /><Input label={copy.invalid} error={copy.invalid} /><Input label={copy.disabled} isDisabled /><PasswordInput label={copy.password} /><MoneyInput label={copy.money} value={amount} onValueChange={setAmount} /><Text size="sm"><span>{copy.paisa}: </span><output data-testid="paisa-value">{amount ?? "—"}</output></Text><Textarea label={copy.notes} placeholder={copy.notesHint} counter maxLength={100} /></FormSection></Showcase>
 <Showcase title={copy.selection}><Select label="Select" options={splitOptions} value={split} onValueChange={setSplit} /><MultiSelect label="MultiSelect" options={members.map(m => ({ value: m.id, label: m.name }))} value={participants} onValueChange={setParticipants} /><Checkbox defaultSelected>Checkbox</Checkbox><Checkbox isDisabled>{copy.disabled}</Checkbox><Switch defaultSelected>Switch</Switch><RadioGroup label="RadioGroup" options={splitOptions} value={split} onValueChange={setSplit} /><SegmentedControl label="SegmentedControl" options={splitOptions} value={split} onValueChange={setSplit} /><MemberPicker members={members} value={member} onValueChange={setMember} /><MemberMultiPicker members={members} value={participants} onValueChange={setParticipants} /><CategorySelect value={category} onValueChange={setCategory} /></Showcase>
 </Grid>
 <Showcase title={copy.dates}><Grid><DatePicker label="DatePicker" /><MonthPicker /><DateRangeFilter value={range} onValueChange={setRange} /><Stack><SearchInput onSearch={setQuery} /><Text size="sm">{copy.savedQuery}: <output data-testid="search-value">{query}</output></Text></Stack></Grid></Showcase>
 </Stack>;
}
