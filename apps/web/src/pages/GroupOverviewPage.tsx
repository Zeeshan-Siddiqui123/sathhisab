import { useParams, Link, useNavigate } from "react-router-dom";
import { Plus, ArrowLeftRight, Activity, Settings } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { BalanceBadge } from "@/components/shared/BalanceBadge";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CardBody } from "@/components/ui/CardBody";
import { Grid } from "@/components/ui/Grid";
import { Text } from "@/components/ui/Text";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Chip";
import { formatPKR } from "@/lib/format";
import { strings } from "@/lib/strings";
import { useGroup } from "../features/groups/hooks";
import { useGroupBalances, type SuggestedTransfer } from "../features/balances/hooks";
import { useMe } from "../features/auth/hooks";

function TransferList({
  title,
  items,
  currentUserId,
  kind,
}: {
  title: string;
  items: SuggestedTransfer[];
  currentUserId?: string;
  kind: "collect" | "pay";
}) {
  if (items.length === 0) return null;
  return (
    <section className="mb-6">
      <SectionHeader title={title} />
      <div className="space-y-2 mt-3">
        {items.map((s, i) => {
          const other = kind === "collect" ? s.from : s.to;
          const label = other.id === currentUserId ? "You" : other.name;
          return (
            <Card key={`${other.id}-${i}`}>
              <CardBody className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar name={other.name} src={other.avatarUrl ?? undefined} size="sm" />
                  <Text size="sm" className="truncate">
                    {kind === "collect" ? strings.balance.collectFrom : strings.balance.payTo}{" "}
                    <strong>{label}</strong>
                  </Text>
                </div>
                <Chip color={kind === "collect" ? "success" : "danger"} variant="flat">
                  {formatPKR(s.amount)}
                </Chip>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export default function GroupOverviewPage() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { data: me } = useMe();
  const { data: group, isLoading: groupLoading, error: groupError, refetch } = useGroup(groupId!);
  const { data: balances, isLoading: balancesLoading } = useGroupBalances(groupId!);

  if (groupLoading) return <LoadingState />;
  if (groupError) return <ErrorState message={(groupError as Error).message} onRetry={refetch} />;
  if (!group) return null;

  const myBalance = balances?.myBalance ?? group.myBalance ?? 0;
  const suggestions = balances?.suggestions ?? [];
  const toCollect =
    balances?.toCollect ?? suggestions.filter((s) => s.to.id === me?.id);
  const toPay = balances?.toPay ?? suggestions.filter((s) => s.from.id === me?.id);

  return (
    <PageContainer>
      <Card className="mb-6 bg-primary/5 border-primary/20">
        <CardBody className="p-6">
          <Text muted size="sm">Your balance in {group.name}</Text>
          <div className="mt-2">
            <BalanceBadge amount={myBalance} className="text-lg px-4 py-2" />
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          id="add-expense-btn"
          onPress={() => navigate(`/groups/${groupId}/expenses/new`)}
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
        >
          Add expense
        </Button>
        <Button
          id="settle-up-btn"
          onPress={() => navigate(`/groups/${groupId}/settlements`)}
          variant="soft"
          startContent={<ArrowLeftRight className="w-4 h-4" />}
        >
          Settle up
        </Button>
      </div>

      {!balancesLoading && (
        <>
          <TransferList
            title={strings.balance.toCollect}
            items={toCollect}
            currentUserId={me?.id}
            kind="collect"
          />
          <TransferList
            title={strings.balance.toPay}
            items={toPay}
            currentUserId={me?.id}
            kind="pay"
          />
          {toCollect.length === 0 && toPay.length === 0 ? (
            <Text muted size="sm" className="mb-6">
              {strings.balance.noPersonalBalances}
            </Text>
          ) : null}
        </>
      )}

      <Grid className="grid-cols-2 md:grid-cols-4 gap-3">
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
