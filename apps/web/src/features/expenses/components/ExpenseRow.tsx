import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CardBody } from "@/components/ui/CardBody";
import { Text } from "@/components/ui/Text";
import { Money } from "@/components/ui/Money";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { formatDate } from "@/lib/format";
import type { Category } from "@/lib/constants";
import type { Expense } from "../hooks";

export function ExpenseRow({ expense, groupId, currentUserId }: { expense: Expense; groupId: string; currentUserId?: string }) {
  const myShare = expense.shares.find((share) => share.userId === currentUserId)?.shareAmount ?? 0;
  return (
    <Link to={`/groups/${groupId}/expenses/${expense.id}`} className="block">
      <Card isPressable className="transition-shadow hover:shadow-md">
        <CardBody className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Text className="font-semibold">{expense.title}</Text>
              <CategoryBadge category={expense.category as Category} />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-1"><CalendarDays size={15} aria-hidden="true" />{formatDate(expense.expenseDate)}</span>
              <span>Paid by {expense.payer?.name ?? "member"}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-between gap-6 sm:justify-end">
            <div>
              <Text muted size="sm">Your share</Text>
              <Money amount={myShare} size="sm" />
            </div>
            <div className="text-right">
              <Text muted size="sm">Total</Text>
              <Money amount={expense.amount} />
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
