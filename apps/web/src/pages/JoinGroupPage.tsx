import { useNavigate, useParams } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CardBody } from "@/components/ui/CardBody";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { formatDate } from "@/lib/format";
import { useMe } from "@/features/auth/hooks";
import { useAcceptInvitation, useInvitePreview } from "@/features/groups/hooks";

export default function JoinGroupPage() {
  const navigate = useNavigate();
  const { token = "" } = useParams<{ token: string }>();
  const { data: me, isLoading: meLoading } = useMe();
  const preview = useInvitePreview(token);
  const accept = useAcceptInvitation();

  if (preview.isLoading || meLoading) return <LoadingState />;
  if (preview.error) return <ErrorState message={(preview.error as Error).message} onRetry={() => void preview.refetch()} />;
  if (!preview.data) return null;

  const join = async () => {
    if (!me) {
      navigate(`/login?redirect=${encodeURIComponent(`/join/${token}`)}`);
      return;
    }
    const result = await accept.mutateAsync(token);
    navigate(`/groups/${result.group.id}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <AuthLayout title="Join group">
        <Card className="mt-6">
          <CardBody className="items-center gap-4 p-6 text-center">
            <div className="rounded-full bg-primary/10 p-4 text-primary"><UserPlus aria-hidden="true" /></div>
            <Heading level={2}>{preview.data.group.name}</Heading>
            <Text muted>{preview.data.inviter.name} invited you to join this SaathHisab group.</Text>
            <Text muted size="sm">Invite expires {formatDate(preview.data.expiresAt)}</Text>
            <Button isLoading={accept.isPending} onPress={() => void join()} fullWidth>{me ? "Join group" : "Sign in to join"}</Button>
          </CardBody>
        </Card>
      </AuthLayout>
    </div>
  );
}
