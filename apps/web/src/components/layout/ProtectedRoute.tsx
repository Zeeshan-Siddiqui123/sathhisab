import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import type { Loadable, Member } from "@/types/ui";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
/** Phase 2 supplies a real session; unresolved/error states never render protected content. */
export function ProtectedRoute({ session, children }: { session: Loadable<Member | null>; children?: ReactNode }) {
 const location = useLocation();
 if (session.status === "loading") return <LoadingState />;
 if (session.status === "error") return <ErrorState message={session.message} onRetry={session.retry} />;
 if (!session.data) return <Navigate replace to={"/login?redirect=" + encodeURIComponent(location.pathname + location.search)} />;
 return children ?? <Outlet />;
}
