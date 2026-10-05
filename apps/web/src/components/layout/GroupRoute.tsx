import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import type { Loadable, GroupOption } from "@/types/ui";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Alert } from "@/components/ui/Alert";
import { uiStrings } from "@/lib/uiStrings";
/** Group access is resolved by the feature; this boundary never fetches or trusts URL IDs. */
export function GroupRoute({ group, children }: { group: Loadable<GroupOption | null>; children?: ReactNode }) {
 if (group.status === "loading") return <LoadingState />;
 if (group.status === "error") return <ErrorState message={group.message} onRetry={group.retry} />;
 if (!group.data) return <Alert tone="danger" title={uiStrings.denied} />;
 return children ?? <Outlet />;
}
