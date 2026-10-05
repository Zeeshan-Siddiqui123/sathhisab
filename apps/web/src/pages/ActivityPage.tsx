import { useState } from "react";
import { useParams } from "react-router-dom";
import { Activity } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ActivityItem } from "@/components/shared/ActivityItem";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Select } from "@/components/ui/Select";
import { LoadMore } from "@/components/ui/LoadMore";
import { useActivity } from "@/features/activity/hooks";

const ACTIONS = ["", "EXPENSE_CREATED", "EXPENSE_UPDATED", "EXPENSE_DELETED", "SETTLEMENT_CREATED", "SETTLEMENT_CONFIRMED", "MEMBER_JOINED"];

function sentence(action: string, actor: string) {
  const label = action.toLowerCase().split("_").join(" ");
  return `${actor} ${label}`;
}

export default function ActivityPage() {
  const { groupId = "" } = useParams<{ groupId: string }>();
  const [action, setAction] = useState("");
  const activity = useActivity(groupId, action);
  const rows = activity.data?.pages.flatMap((page) => page.data) ?? [];
  return (
    <PageContainer>
      <PageHeader title="Activity" subtitle="A timeline of changes in this group" action={<Select label="Type" value={action} onValueChange={setAction} options={ACTIONS.map((value) => ({ value, label: value ? value.split("_").join(" ") : "All activity" }))} />} />
      {activity.isLoading ? <LoadingState /> : null}
      {activity.error ? <ErrorState message={(activity.error as Error).message} onRetry={() => void activity.refetch()} /> : null}
      {!activity.isLoading && rows.length === 0 ? <EmptyState title="No activity yet" description="Group changes will appear here." icon={<Activity />} /> : null}
      <div className="divide-y divide-border">
        {rows.map((item) => <ActivityItem key={item.id} icon={<Activity size={18} />} date={item.createdAt}>{sentence(item.action, item.actor.name)}</ActivityItem>)}
      </div>
      <div className="mt-6 flex justify-center">
        <LoadMore hasMore={activity.hasNextPage} isLoading={activity.isFetchingNextPage} onPress={() => void activity.fetchNextPage()} />
      </div>
    </PageContainer>
  );
}
