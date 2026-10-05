import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CardBody } from "@/components/ui/CardBody";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { Select } from "@/components/ui/Select";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Stack } from "@/components/ui/Stack";
import { Text } from "@/components/ui/Text";
import { Textarea } from "@/components/ui/Textarea";
import { CATEGORY_LABELS, CATEGORIES, type Category } from "@/lib/constants";
import { formatPKR } from "@/lib/format";
import { useGroup } from "@/features/groups/hooks";
import { useCreateExpense, useUpdateExpense, type CreateExpensePayload, type Expense } from "../hooks";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function splitEqualPreview(amount: number, userIds: string[]) {
  const sorted = [...userIds].sort();
  const base = Math.floor(amount / sorted.length);
  const remainder = amount % sorted.length;
  return new Map(sorted.map((userId, index) => [userId, index < remainder ? base + 1 : base]));
}

export function ExpenseForm({ groupId, expense }: { groupId: string; expense?: Expense }) {
  const navigate = useNavigate();
  const { data: group } = useGroup(groupId);
  const create = useCreateExpense(groupId);
  const update = useUpdateExpense(groupId, expense?.id ?? "");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState<Category>("OTHER");
  const [expenseDate, setExpenseDate] = useState(today());
  const [paidBy, setPaidBy] = useState("");
  const [splitMethod, setSplitMethod] = useState<"EQUAL" | "CUSTOM">("EQUAL");
  const [participants, setParticipants] = useState<string[]>([]);
  const [customShares, setCustomShares] = useState<Record<string, number | null>>({});
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!group) return;
    if (expense) {
      setTitle(expense.title);
      setAmount(expense.amount);
      setCategory(expense.category as Category);
      setExpenseDate(String(expense.expenseDate).slice(0, 10));
      setPaidBy(expense.paidBy);
      setSplitMethod(expense.splitMethod);
      setParticipants(expense.shares.map((share) => share.userId));
      setCustomShares(Object.fromEntries(expense.shares.map((share) => [share.userId, share.shareAmount])));
      setNote(expense.note ?? "");
      return;
    }
    setPaidBy(group.members[0]?.id ?? "");
    setParticipants(group.members.map((member) => member.id));
  }, [expense, group]);

  const equalShares = useMemo(() => {
    if (!amount || participants.length === 0) return new Map<string, number>();
    return splitEqualPreview(amount, participants);
  }, [amount, participants]);

  const customTotal = participants.reduce((sum, userId) => sum + (customShares[userId] ?? 0), 0);
  const remaining = (amount ?? 0) - customTotal;
  const pending = create.isPending || update.isPending;

  const toggleParticipant = (userId: string, checked: boolean) => {
    setParticipants((current) => checked ? [...new Set([...current, userId])] : current.filter((id) => id !== userId));
  };

  const submit = async () => {
    setError("");
    if (!title.trim()) return setError("Title is required.");
    if (!amount || amount <= 0) return setError("Amount must be greater than zero.");
    if (!paidBy) return setError("Choose who paid.");
    if (participants.length === 0) return setError("Choose at least one participant.");
    if (splitMethod === "CUSTOM" && remaining !== 0) return setError("Custom shares must add up exactly to the expense amount.");

    const payload: CreateExpensePayload = {
      title: title.trim(),
      amount,
      paidBy,
      category,
      splitMethod,
      expenseDate,
      participants,
      note: note.trim() || undefined,
      shares: splitMethod === "CUSTOM" ? participants.map((userId) => ({ userId, amount: customShares[userId] ?? 0 })) : undefined,
    };
    const saved = expense ? await update.mutateAsync(payload) : await create.mutateAsync(payload);
    navigate(`/groups/${groupId}/expenses/${saved.id}`, { replace: true });
  };

  return (
    <Stack className="max-w-2xl">
      {error ? <Alert tone="danger" title="Check the expense">{error}</Alert> : null}
      {(create.error || update.error) ? <Alert tone="danger" title="Unable to save">{(create.error ?? update.error as Error).message}</Alert> : null}
      <Input label="Title" value={title} onValueChange={setTitle} autoFocus placeholder="Groceries, rent, dinner" />
      <MoneyInput value={amount} onValueChange={setAmount} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Expense date" type="date" value={expenseDate} onValueChange={setExpenseDate} />
        <Select label="Category" value={category} onValueChange={(value) => setCategory(value as Category)} options={CATEGORIES.map((value) => ({ value, label: CATEGORY_LABELS[value] }))} />
      </div>
      <Select label="Paid by" value={paidBy} onValueChange={setPaidBy} options={(group?.members ?? []).map((member) => ({ value: member.id, label: member.name }))} />
      <SegmentedControl label="Split method" value={splitMethod} onValueChange={(value) => setSplitMethod(value as "EQUAL" | "CUSTOM")} options={[{ value: "EQUAL", label: "Equal" }, { value: "CUSTOM", label: "Custom" }]} />
      <Card>
        <CardBody className="space-y-4 p-4">
          <Text className="font-semibold">Participants</Text>
          {(group?.members ?? []).map((member) => {
            const selected = participants.includes(member.id);
            return (
              <div key={member.id} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px] sm:items-center">
                <Checkbox isSelected={selected} onValueChange={(checked) => toggleParticipant(member.id, checked)}>
                  {member.name}
                </Checkbox>
                {splitMethod === "CUSTOM" ? (
                  <MoneyInput value={customShares[member.id] ?? null} onValueChange={(value) => setCustomShares((current) => ({ ...current, [member.id]: value }))} isDisabled={!selected} />
                ) : (
                  <Text muted size="sm">{selected ? formatPKR(equalShares.get(member.id) ?? 0) : "Not included"}</Text>
                )}
              </div>
            );
          })}
          {splitMethod === "CUSTOM" ? <Text size="sm" className={remaining === 0 ? "text-success" : "text-danger"}>Remaining: {formatPKR(remaining)}</Text> : null}
        </CardBody>
      </Card>
      <Textarea label="Note" value={note} onValueChange={setNote} maxLength={500} counter />
      <div className="sticky bottom-20 z-10 flex justify-end gap-3 rounded-input border border-border bg-surface p-3 md:static md:border-0 md:bg-transparent md:p-0">
        <Button variant="ghost" onPress={() => navigate(-1)}>Cancel</Button>
        <Button isLoading={pending} onPress={() => void submit()}>{expense ? "Save expense" : "Add expense"}</Button>
      </div>
    </Stack>
  );
}
