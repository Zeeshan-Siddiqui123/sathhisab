import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  meta?: Record<string, unknown> | null;
  actor: { id: string; name: string; avatarUrl?: string | null };
  createdAt: string;
}

export interface ActivityPageResult {
  data: ActivityLog[];
  meta: { total: number; page: number; limit: number };
}

export function useActivity(groupId: string, action?: string) {
  return useInfiniteQuery<ActivityPageResult>({
    queryKey: ["activity", groupId, action],
    queryFn: ({ pageParam = 1 }) => {
      const qs = new URLSearchParams({ page: String(pageParam), limit: "30" });
      if (action) qs.set("action", action);
      return api.get<ActivityPageResult>(`/groups/${groupId}/activity?${qs.toString()}`);
    },
    getNextPageParam: (last) => {
      const shown = last.meta.page * last.meta.limit;
      return shown < last.meta.total ? last.meta.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!groupId,
  });
}
