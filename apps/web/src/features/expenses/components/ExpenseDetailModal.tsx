import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Divider } from "@/components/ui/Divider";
import { Modal } from "@/components/ui/Modal";
import { ModalBody } from "@/components/ui/ModalBody";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { ModalHeader } from "@/components/ui/ModalHeader";
import { Money } from "@/components/ui/Money";
import { Text } from "@/components/ui/Text";
import { useGroup } from "@/features/groups/hooks";
import type { Category } from "@/lib/constants";
import { formatDate, formatDateTime } from "@/lib/format";
import { useDeleteExpense, type Expense } from "../hooks";

export function ExpenseDetailModal({ expense, currentUserId, onClose }: {
  expense: Expense;
  currentUserId?: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const group = useGroup(expense.groupId);
  const remove = useDeleteExpense(expense.groupId);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const canEdit = expense.createdBy === currentUserId || group.data?.myRole === "OWNER";
  const myShare = expense.shares.find((share) => share.userId === currentUserId)?.shareAmount ?? 0;

  return (
    <>
      <Modal isOpen onOpenChange={(open) => { if (!open) onClose(); }} size="2xl">
        <ModalHeader className="block break-words pr-12">{expense.title}</ModalHeader>
        <ModalBody>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><Text muted size="sm">Total amount</Text><Money amount={expense.amount} /></div>
            <CategoryBadge category={expense.category as Category} />
          </div>
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-muted">Paid by</dt><dd className="break-words font-semibold">{expense.payer?.name ?? "Member"}</dd></div>
            <div><dt className="text-muted">Expense date</dt><dd>{formatDate(expense.expenseDate)}</dd></div>
            <div><dt className="text-muted">Created</dt><dd>{formatDateTime(expense.createdAt)}</dd></div>
            <div><dt className="text-muted">Created by</dt><dd className="break-words">{expense.creator?.name ?? "Member"}</dd></div>
            <div><dt className="text-muted">Your share</dt><dd><Money amount={myShare} size="sm" /></dd></div>
            <div><dt className="text-muted">Split</dt><dd>{expense.splitMethod === "EQUAL" ? "Equal" : "Custom"}</dd></div>
          </dl>
          <div>
            <Text className="font-semibold">Description</Text>
            <Text className="whitespace-pre-wrap break-words" muted={!expense.note}>{expense.note || "No description"}</Text>
          </div>
          {expense.receiptUrl && /^(https?:\/\/|\/(?!\/))/i.test(expense.receiptUrl) ? (
            <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" className="w-fit text-primary underline">View receipt</a>
          ) : null}
          <Divider />
          <div className="space-y-3">
            <Text className="font-semibold">Shares</Text>
            {expense.shares.map((share) => (
              <div key={share.id} className="flex items-center justify-between gap-3">
                <Text className="min-w-0 break-words">{share.user?.name ?? "Member"}</Text>
                <Money amount={share.shareAmount} size="sm" className="shrink-0" />
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter className="flex-wrap">
          {canEdit ? (
            <>
              <Button variant="danger" leftIcon={<Trash2 size={16} />} onPress={() => setConfirmDelete(true)}>Delete</Button>
              <Button variant="secondary" leftIcon={<Pencil size={16} />} onPress={() => navigate(`/groups/${expense.groupId}/expenses/${expense.id}/edit`)}>Edit</Button>
            </>
          ) : null}
          <Button variant="ghost" onPress={onClose}>Close</Button>
        </ModalFooter>
      </Modal>
      <ConfirmDialog
        isOpen={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete expense?"
        message={`Delete "${expense.title}"? This will update the group's balances.`}
        confirmLabel="Delete"
        danger
        onConfirm={async () => {
          await remove.mutateAsync(expense.id);
          onClose();
        }}
      />
    </>
  );
}
