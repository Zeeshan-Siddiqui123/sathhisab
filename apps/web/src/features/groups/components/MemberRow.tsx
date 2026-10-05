import { UserMinus, Crown } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text";
import { Tooltip } from "@/components/ui/Tooltip";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { formatPKR } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useState } from "react";
import { useRemoveMember } from "../hooks";
import type { GroupMember } from "../hooks";

interface MemberRowProps {
  member: GroupMember;
  groupId: string;
  canRemove: boolean;
  isCurrentUser: boolean;
}

export function MemberRow({ member, groupId, canRemove, isCurrentUser }: MemberRowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const remove = useRemoveMember(groupId);

  const balance = member.balance ?? 0;
  const balanceColor =
    balance > 0 ? "text-success" : balance < 0 ? "text-danger" : "text-default-500";

  return (
    <>
      <div className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-default-100 transition-colors">
        <Avatar
          name={member.name}
          src={member.avatarUrl ?? undefined}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Text className="font-medium truncate">
              {member.name}
              {isCurrentUser && (
                <span className="text-default-400 text-xs ml-1">(you)</span>
              )}
            </Text>
            {member.role === "OWNER" && (
              <Tooltip content="Group owner">
                <Crown className="w-3.5 h-3.5 text-warning flex-shrink-0" />
              </Tooltip>
            )}
          </div>
          {member.email && (
            <Text muted size="sm" className="truncate">{member.email}</Text>
          )}
        </div>

        {/* Balance */}
        {balance !== undefined && (
          <Text size="sm" className={cn("font-semibold flex-shrink-0", balanceColor)}>
            {balance === 0
              ? "Settled"
              : balance > 0
              ? `+${formatPKR(balance)}`
              : formatPKR(balance)}
          </Text>
        )}

        {/* Remove button (owner only, not self) */}
        {canRemove && !isCurrentUser && (
          <Button
            id={`remove-member-${member.id}`}
            size="sm"
            variant="ghost"
            color="danger"
            isIconOnly
            aria-label={`Remove ${member.name}`}
            onPress={() => setConfirmOpen(true)}
          >
            <UserMinus className="w-4 h-4" />
          </Button>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title={`Remove ${member.name}?`}
        message="This member will be removed from the group. Their past expenses and shares will be preserved."
        confirmLabel="Remove"
        danger
        onConfirm={async () => {
          await remove.mutateAsync(member.id);
          setConfirmOpen(false);
        }}
        onOpenChange={setConfirmOpen}
      />
    </>
  );
}
