import { Navigate, useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { InvitePanel } from "@/features/groups/components/InvitePanel";
import { useGroup } from "@/features/groups/hooks";

export default function InvitePage() {
  const { groupId = "" } = useParams<{ groupId: string }>();
  const { data: group, isLoading, error, refetch } = useGroup(groupId);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={(error as Error).message} onRetry={() => void refetch()} />;
  if (!group) return null;
  if (group.myRole !== "OWNER") return <Navigate to={`/groups/${groupId}`} replace />;

  return (
    <PageContainer>
      <PageHeader
        title="Invite members"
        subtitle="Share a link so people can join this group"
      />
      <div className="mt-4 max-w-md">
        <InvitePanel groupId={groupId} />
      </div>
    </PageContainer>
  );
}
