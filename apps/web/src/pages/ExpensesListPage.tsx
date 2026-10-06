import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadMore } from "@/components/ui/LoadMore";
import { Select } from "@/components/ui/Select";
import { CATEGORY_LABELS, CATEGORIES, type Category } from "@/lib/constants";
import { useMe } from "@/features/auth/hooks";
import { ExpenseRow } from "@/features/expenses/components/ExpenseRow";
import { ExpenseDetailModal } from "@/features/expenses/components/ExpenseDetailModal";
import { useExpenses } from "@/features/expenses/hooks";

export default function ExpensesListPage() {
  const { groupId = "" } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { data: me } = useMe();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const filters = useMemo(() => ({ search, category, from, to }), [search, category, from, to]);
  const expenses = useExpenses(groupId, filters);
  const rows = expenses.data?.pages.flatMap((page) => page.data) ?? [];
  const selectedExpense = rows.find((expense) => expense.id === selectedExpenseId);

  return (
    <PageContainer>
      <PageHeader
        title="Expenses"
        subtitle="Search, filter, and review every shared cost"
        action={<Button onPress={() => navigate(`/groups/${groupId}/expenses/new`)} leftIcon={<Plus size={16} />}>Add expense</Button>}
      />
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
        <SearchInput onSearch={setSearch} />
        <Select label="Category" value={category} onValueChange={setCategory} options={[{ value: "", label: "All categories" }, ...CATEGORIES.map((value) => ({ value, label: CATEGORY_LABELS[value as Category] }))]} />
        <Input label="From" type="date" value={from} onValueChange={setFrom} />
        <Input label="To" type="date" value={to} onValueChange={setTo} />
      </div>
      {expenses.isLoading ? <LoadingState /> : null}
      {expenses.error ? <ErrorState message={(expenses.error as Error).message} onRetry={() => void expenses.refetch()} /> : null}
      {!expenses.isLoading && !expenses.error && rows.length === 0 ? (
        <EmptyState title="No expenses yet" description="Add the first shared cost for this group." action={<Button onPress={() => navigate(`/groups/${groupId}/expenses/new`)}>Add expense</Button>} />
      ) : null}
      <div className="space-y-3">
        {rows.map((expense) => <ExpenseRow key={expense.id} expense={expense} currentUserId={me?.id} onPress={() => setSelectedExpenseId(expense.id)} />)}
      </div>
      <div className="mt-6 flex justify-center">
        <LoadMore hasMore={expenses.hasNextPage} isLoading={expenses.isFetchingNextPage} onPress={() => void expenses.fetchNextPage()} />
      </div>
      {selectedExpense ? (
        <ExpenseDetailModal
          key={selectedExpense.id}
          expense={selectedExpense}
          currentUserId={me?.id}
          onClose={() => setSelectedExpenseId(null)}
        />
      ) : null}
    </PageContainer>
  );
}
