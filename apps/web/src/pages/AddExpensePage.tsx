import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { ExpenseForm } from "@/features/expenses/components/ExpenseForm";

export default function AddExpensePage() {
  const { groupId = "" } = useParams<{ groupId: string }>();
  return (
    <PageContainer form>
      <PageHeader title="Add expense" subtitle="Record who paid and how the cost is shared" />
      <ExpenseForm groupId={groupId} />
    </PageContainer>
  );
}
