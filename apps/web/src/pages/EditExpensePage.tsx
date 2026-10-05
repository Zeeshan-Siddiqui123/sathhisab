import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { ExpenseForm } from "@/features/expenses/components/ExpenseForm";
import { useExpense } from "@/features/expenses/hooks";

export default function EditExpensePage() {
  const { groupId = "", expenseId = "" } = useParams<{ groupId: string; expenseId: string }>();
  const expense = useExpense(groupId, expenseId);
  if (expense.isLoading) return <LoadingState />;
  if (expense.error) return <ErrorState message={(expense.error as Error).message} onRetry={() => void expense.refetch()} />;
  if (!expense.data) return null;
  return (
    <PageContainer form>
      <PageHeader title="Edit expense" subtitle={expense.data.title} />
      <ExpenseForm groupId={groupId} expense={expense.data} />
    </PageContainer>
  );
}
