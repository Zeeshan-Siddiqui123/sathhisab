import { useParams, Link } from "react-router-dom";
import { Plus, ArrowLeftRight, Activity, Settings, Users } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatCard } from "@/components/shared/StatCard";
import { BalanceBadge } from "@/components/shared/BalanceBadge";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CardBody } from "@/components/ui/CardBody";
import { Grid } from "@/components/ui/Grid";
import { Text } from "@/components/ui/Text";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Chip";
import { formatPKR } from "@/lib/format";
import { useGroup } from "../features/groups/hooks";
import { useGroupBalances } from "../features/balances/hooks";
import { useMe } from "../features/auth/hooks";

export default function GroupOverviewPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { data: me } = useMe();
  const { data: group, isLoading: groupLoading, error: groupError, refetch } = useGroup(groupId!);
  const { data: balances, isLoading: balancesLoading } = useGroupBalances(groupId!);

  if (groupLoading) return <LoadingState />;
  if (groupError) return <ErrorState message={(groupError as Error).message} onRetry={refetch} />;
  if (!group) return null;

  const myBalance = balances?.myBalance ?? group.myBalance ?? 0;
  const suggestions = balances?.suggestions ?? [];

  return (
    <PageContainer>
      {/* Balance hero */}
      <Card className="mb-6 bg-primary/5 border-primary/20">
        <CardBody className="p-6">
          <Text muted size="sm">Your balance in {group.name}</Text>
          <div className="mt-2">
            <BalanceBadge amount={myBalance} className="text-lg px-4 py-2" />
          </div>
        </CardBody>
      </Card>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          id="add-expense-btn"
          as={Link}
          to={`/groups/${groupId}/expenses/new`}
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
        >
          Add expense
        </Button>
        <Button
          id="settle-up-btn"
          as={Link}
          to={`/groups/${groupId}/settlements`}
          variant="flat"
          startContent={<ArrowLeftRight className="w-4 h-4" />}
        >
          Settle up
        </Button>
      </div>

      {/* Suggested transfers */}
      {suggestions.length > 0 && (
        <section className="mb-6">
          <SectionHeader title="Suggested transfers" />
          <div className="space-y-2 mt-3">
            {suggestions.map((s, i) => (
              <Card key={i}>
                <CardBody className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar name={s.from.name} src={s.from.avatarUrl ?? undefined} size="sm" />
                    <Text size="sm" className="truncate">
                      <strong>{s.from.id === me?.id ? "You" : s.from.name}</strong>
                      {" → "}
                      <strong>{s.to.id === me?.id ? "you" : s.to.name}</strong>
                    </Text>
                  </div>
                  <Chip color="primary" variant="flat">{formatPKR(s.amount)}</Chip>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Member balances grid */}
      {balances && !balancesLoading && (
        <section className="mb-6">
          <SectionHeader
            title="Member balances"
            action={
              <Button
                as={Link}
                to={`/groups/${groupId}/members`}
                size="sm"
                variant="light"
                endContent={<Users className="w-3.5 h-3.5" />}
              >
                See all
              </Button>
            }
          />
          <Grid cols={{ base: 1, sm: 2, md: 3 }} gap={3} className="mt-3">
            {balances.members.slice(0, 6).map((m) => (
              <StatCard
                key={m.id}
                label={m.name + (m.id === me?.id ? " (you)" : "")}
                value={
                  <BalanceBadge amount={m.balance} />
                }
                icon={<Avatar name={m.name} src={m.avatarUrl ?? undefined} size="sm" />}
              />
            ))}
          </Grid>
        </section>
      )}

      {/* Nav cards */}
      <Grid cols={{ base: 2, md: 4 }} gap={3}>
        {[
          { to: `/groups/${groupId}/expenses`, icon: <Plus className="w-5 h-5" />, label: "Expenses" },
          { to: `/groups/${groupId}/settlements`, icon: <ArrowLeftRight className="w-5 h-5" />, label: "Settlements" },
          { to: `/groups/${groupId}/activity`, icon: <Activity className="w-5 h-5" />, label: "Activity" },
          { to: `/groups/${groupId}/settings`, icon: <Settings className="w-5 h-5" />, label: "Settings" },
        ].map(({ to, icon, label }) => (
          <Link key={to} to={to} className="block group focus:outline-none">
            <Card isPressable className="h-full group-hover:shadow-md transition-shadow">
              <CardBody className="p-4 flex flex-col items-center gap-2 text-center">
                <div className="p-2 rounded-full bg-primary/10 text-primary">{icon}</div>
                <Text size="sm" className="font-medium">{label}</Text>
              </CardBody>
            </Card>
          </Link>
        ))}
      </Grid>
    </PageContainer>
  );
}
