import { useNavigate, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { BalanceBadge } from "@/components/shared/BalanceBadge";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CardBody } from "@/components/ui/CardBody";
import { Divider } from "@/components/ui/Divider";
import { Money } from "@/components/ui/Money";
import { Text } from "@/components/ui/Text";
import { formatDate, formatDateTime } from "@/lib/format";
import type { Category } from "@/lib/constants";
import { useMe } from "@/features/auth/hooks";
import { useDeleteExpense, useExpense } from "@/features/expenses/hooks";
import { useGroup } from "@/features/groups/hooks";

export default function ExpenseDetailPage() {
  const navigate = useNavigate();
  const { groupId = "", expenseId = "" } = useParams<{ groupId: string; expenseId: string }>();
  const { data: me } = useMe();
  const group = useGroup(groupId);
  const expense = useExpense(groupId, expenseId);
  const remove = useDeleteExpense(groupId);
  if (expense.isLoading) return <LoadingState />;
  if (expense.error) return <ErrorState message={(expense.error as Error).message} onRetry={() => void expense.refetch()} />;
  if (!expense.data) return null;
  const canEdit = expense.data.createdBy === me?.id || group.data?.myRole === "OWNER";
  const myShare = expense.data.shares.find((share) => share.userId === me?.id)?.shareAmount ?? 0;
  return (
    <PageContainer>
      <PageHeader
        title={expense.data.title}
        subtitle={`${formatDate(expense.data.expenseDate)} by ${expense.data.payer?.name ?? "member"}`}
        action={canEdit ? <Button onPress={() => navigate(`/groups/${groupId}/expenses/${expenseId}/edit`)} variant="secondary" leftIcon={<Pencil size={16} />}>Edit</Button> : undefined}
      />
      <Card>
        <CardBody className="space-y-6 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Text muted>Total amount</Text>
              <Money amount={expense.data.amount} size="hero" />
            </div>
            <CategoryBadge category={expense.data.category as Category} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div><Text muted>Paid by</Text><Text className="font-semibold">{expense.data.payer?.name ?? "Member"}</Text></div>
            <div><Text muted>Your share</Text><Money amount={myShare} /></div>
            <div><Text muted>Split</Text><Text className="font-semibold">{expense.data.splitMethod === "EQUAL" ? "Equal" : "Custom"}</Text></div>
          </div>
          {expense.data.note ? <Text>{expense.data.note}</Text> : null}
          <Divider />
          <div className="space-y-3">
            <Text className="font-semibold">Shares</Text>
            {expense.data.shares.map((share) => (
              <div key={share.id} className="flex items-center justify-between gap-3">
                <Text>{share.user?.name ?? "Member"}</Text>
                <BalanceBadge amount={share.userId === expense.data.paidBy ? expense.data.amount - share.shareAmount : -share.shareAmount} />
              </div>
            ))}
          </div>
          <Text muted size="sm">Created {formatDateTime(expense.data.createdAt)} by {expense.data.creator?.name ?? "member"}</Text>
          {canEdit ? (
            <ConfirmActionButton
              label="Delete expense"
              title="Delete expense?"
              message="This expense will be removed from balances and activity will keep the change."
              confirmLabel="Delete"
              danger
              onConfirm={async () => {
                await remove.mutateAsync(expenseId);
                navigate(`/groups/${groupId}/expenses`, { replace: true });
              }}
              className="w-fit"
            />
          ) : null}
        </CardBody>
      </Card>
    </PageContainer>
  );
}
