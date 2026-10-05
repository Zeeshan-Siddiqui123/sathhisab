import { createBrowserRouter, Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { Activity, ArrowLeftRight, Home, Plus, ReceiptText, Users } from "lucide-react";
import type { Loadable, Member, NavItem } from "@/types/ui";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { GroupSwitcher } from "@/components/shared/GroupSwitcher";
import { UserMenu } from "@/components/shared/UserMenu";
import { useLogout, useMe } from "@/features/auth/hooks";
import { useGroups } from "@/features/groups/hooks";
import { NotFoundPage } from "./NotFoundPage";

function toSession(query: ReturnType<typeof useMe>): Loadable<Member | null> {
  if (query.isLoading) return { status: "loading" };
  if (query.error) return { status: "error", message: (query.error as Error).message, retry: () => void query.refetch() };
  return { status: "ready", data: query.data ? { id: query.data.id, name: query.data.name, avatarUrl: query.data.avatarUrl ?? undefined } : null };
}

function navItems(groupId?: string): NavItem[] {
  if (!groupId) {
    return [
      { label: 'Groups', href: '/', icon: <Home size={19} /> },
      { label: 'Members', href: '/', icon: <Users size={19} /> },
      { label: 'Add', href: '/', icon: <Plus size={22} /> },
      { label: 'Expenses', href: '/', icon: <ReceiptText size={19} /> },
      { label: 'Activity', href: '/', icon: <Activity size={19} /> },
    ];
  }
  return [
    { label: "Overview", href: `/groups/${groupId}`, icon: <Home size={19} /> },
    { label: "Add", href: `/groups/${groupId}/expenses/new`, icon: <Plus size={22} /> },
    { label: "Settle", href: `/groups/${groupId}/settlements`, icon: <ArrowLeftRight size={19} /> },
    { label: "Activity", href: `/groups/${groupId}/activity`, icon: <Activity size={19} /> },
  ];
}

function ProtectedShell() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const me = useMe();
  const groups = useGroups();
  const logout = useLogout();
  const session = toSession(me);

  return (
    <ProtectedRoute session={session}>
      <AppShell
        items={navItems(groupId)}
        groupSwitcher={groups.data?.length ? <GroupSwitcher groups={groups.data.map((group) => ({ id: group.id, name: group.name }))} value={groupId ?? ""} onValueChange={(id) => navigate(`/groups/${id}`)} /> : undefined}
        userMenu={me.data ? <UserMenu user={{ id: me.data.id, name: me.data.name, avatarUrl: me.data.avatarUrl ?? undefined }} onProfile={() => navigate("/")} onLogout={() => void logout.mutateAsync()} /> : undefined}
      >
        <Outlet />
      </AppShell>
    </ProtectedRoute>
  );
}

export const router = createBrowserRouter([
  ...(import.meta.env.DEV ? [{ path: "/_playground/:section?", lazy: async () => ({ Component: (await import("../playground/PlaygroundPage")).default }) }] : []),
  { path: "/login", lazy: async () => ({ Component: (await import("../pages/LoginPage")).default }) },
  { path: "/signup", lazy: async () => ({ Component: (await import("../pages/SignupPage")).default }) },
  { path: "/join/:token", lazy: async () => ({ Component: (await import("../pages/JoinGroupPage")).default }) },
  {
    element: <ProtectedShell />,
    children: [
      { path: "/", lazy: async () => ({ Component: (await import("../pages/MyGroupsPage")).default }) },
      { path: "/groups", element: <Navigate replace to="/" /> },
      { path: "/groups/:groupId", lazy: async () => ({ Component: (await import("../pages/GroupOverviewPage")).default }) },
      { path: "/groups/:groupId/expenses", lazy: async () => ({ Component: (await import("../pages/ExpensesListPage")).default }) },
      { path: "/groups/:groupId/expenses/new", lazy: async () => ({ Component: (await import("../pages/AddExpensePage")).default }) },
      { path: "/groups/:groupId/expenses/:expenseId", lazy: async () => ({ Component: (await import("../pages/ExpenseDetailPage")).default }) },
      { path: "/groups/:groupId/expenses/:expenseId/edit", lazy: async () => ({ Component: (await import("../pages/EditExpensePage")).default }) },
      { path: "/groups/:groupId/members", lazy: async () => ({ Component: (await import("../pages/MembersPage")).default }) },
      { path: "/groups/:groupId/settlements", lazy: async () => ({ Component: (await import("../pages/SettlementsPage")).default }) },
      { path: "/groups/:groupId/activity", lazy: async () => ({ Component: (await import("../pages/ActivityPage")).default }) },
      { path: "/groups/:groupId/settings", lazy: async () => ({ Component: (await import("../pages/GroupSettingsPage")).default }) },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
