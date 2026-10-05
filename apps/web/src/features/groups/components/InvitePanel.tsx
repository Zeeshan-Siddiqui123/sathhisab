import { useState } from "react";
import { Copy, RefreshCw, Trash2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { Heading } from "@/components/ui/Heading";
import { Divider } from "@/components/ui/Divider";
import { Stack } from "@/components/ui/Stack";
import { Spinner } from "@/components/ui/Spinner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CopyField } from "@/components/shared/CopyField";
import { formatDate } from "@/lib/format";
import {
  useGroupInvitations,
  useCreateInvitation,
  useRevokeInvitation,
} from "../hooks";

interface InviteDialogProps {
  groupId: string;
}

export function InvitePanel({ groupId }: InviteDialogProps) {
  const { data: invitations, isLoading } = useGroupInvitations(groupId);
  const create = useCreateInvitation(groupId);
  const revoke = useRevokeInvitation(groupId);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null);

  const generateLink = async () => {
    const result = await create.mutateAsync();
    setNewToken(result.token);
  };

  const inviteUrl = newToken
    ? `${window.location.origin}/join/${newToken}`
    : null;

  return (
    <Stack gap={5}>
      <div>
        <Heading level={4}>Invite link</Heading>
        <Text muted size="sm" className="mt-1">
          Anyone with this link can join the group. Links expire after 7 days.
        </Text>
      </div>

      {/* Generate new link */}
      <Button
        id="generate-invite-link"
        variant="flat"
        color="primary"
        startContent={<Link2 className="w-4 h-4" />}
        isLoading={create.isPending}
        onPress={generateLink}
      >
        Generate new link
      </Button>

      {/* Show newly generated link */}
      {inviteUrl && (
        <CopyField id="new-invite-url" label="New invite link" value={inviteUrl} />
      )}

      <Divider />

      {/* Active invitations */}
      <Heading level={5}>Active links</Heading>
      {isLoading ? (
        <Spinner />
      ) : invitations?.length === 0 ? (
        <Text muted size="sm">No active invite links</Text>
      ) : (
        <Stack gap={3}>
          {invitations?.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg border border-divider"
            >
              <div className="min-w-0">
                <Text size="sm">Created by {inv.creator.name}</Text>
                <Text muted size="xs">Expires {formatDate(inv.expiresAt)}</Text>
              </div>
              <Button
                id={`revoke-${inv.id}`}
                size="sm"
                variant="light"
                color="danger"
                isIconOnly
                aria-label="Revoke"
                isLoading={revoke.isPending && confirmRevokeId === inv.id}
                onPress={() => setConfirmRevokeId(inv.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </Stack>
      )}

      <ConfirmDialog
        isOpen={!!confirmRevokeId}
        title="Revoke invite link"
        body="This link will stop working immediately. Anyone with the link won't be able to join."
        confirmLabel="Revoke"
        confirmColor="danger"
        onConfirm={async () => {
          if (confirmRevokeId) {
            await revoke.mutateAsync(confirmRevokeId);
            setConfirmRevokeId(null);
          }
        }}
        onCancel={() => setConfirmRevokeId(null)}
      />
    </Stack>
  );
}
