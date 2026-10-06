import { useParams } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Divider } from "@/components/ui/Divider";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/ModalHeader";
import { ModalBody } from "@/components/ui/ModalBody";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { MemberRow } from "../features/groups/components/MemberRow";
import { InvitePanel } from "../features/groups/components/InvitePanel";
import { useGroup, useLeaveGroup } from "../features/groups/hooks";
import { useMe } from "../features/auth/hooks";
import { useNavigate } from "react-router-dom";

export default function MembersPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { data: me } = useMe();
  const { data: group, isLoading, error, refetch } = useGroup(groupId!);
  const leave = useLeaveGroup(groupId!);
  const [showInvite, setShowInvite] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={(error as Error).message} onRetry={refetch} />;
  if (!group) return null;

  const isOwner = group.myRole === "OWNER";

  return (
    <PageContainer>
      <PageHeader
        title="Members"
        subtitle={`${group.members.length} active member${group.members.length !== 1 ? "s" : ""}`}
        action={
          isOwner ? (
            <Button
              id="invite-member-btn"
              color="primary"
              variant="soft"
              startContent={<UserPlus className="w-4 h-4" />}
              onPress={() => setShowInvite(true)}
            >
              Invite
            </Button>
          ) : undefined
        }
      />

      <div className="mt-4 divide-y divide-divider">
        {group.members.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            groupId={groupId!}
            canRemove={isOwner}
            isCurrentUser={member.id === me?.id}
          />
        ))}
      </div>

      <Divider className="my-6" />

      {/* Leave group */}
      <div className="flex justify-end">
        <Button
          id="leave-group-btn"
          color="danger"
          variant="ghost"
          onPress={() => setConfirmLeave(true)}
        >
          Leave group
        </Button>
      </div>

      {/* Invite modal */}
      <Modal isOpen={showInvite} onOpenChange={setShowInvite} size="md">
        <ModalHeader>Invite members</ModalHeader>
        <ModalBody>
          <InvitePanel groupId={groupId!} />
        </ModalBody>
      </Modal>

      {/* Leave confirm */}
      <ConfirmDialog
        isOpen={confirmLeave}
        title="Leave group?"
        message="You won't be able to rejoin unless someone sends you a new invite. You can only leave if your balance is zero."
        confirmLabel="Leave"
        danger
        onConfirm={async () => {
          await leave.mutateAsync();
          setConfirmLeave(false);
          navigate("/");
        }}
        onOpenChange={setConfirmLeave}
      />
    </PageContainer>
  );
}
