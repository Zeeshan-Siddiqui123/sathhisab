import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CalendarDays,
  Plus,
  Users,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/ModalHeader";
import { ModalBody } from "@/components/ui/ModalBody";
import { Button } from "@/components/ui/Button";
import { Grid } from "@/components/ui/Grid";
import { Card } from "@/components/ui/Card";
import { CardBody } from "@/components/ui/CardBody";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { formatPKR } from "@/lib/format";
import { GroupCard } from "../features/groups/components/GroupCard";
import { CreateGroupForm } from "../features/groups/components/CreateGroupForm";
import { useGroups } from "../features/groups/hooks";
import { useGroupsStats } from "../features/balances/hooks";
import { useMe } from "../features/auth/hooks";

function getLastSixMonths() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + index, 1)
    );
    return {
      key: date.toISOString().slice(0, 7),
      label: date.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
    };
  });
}

function makeChartPaths(values: number[]) {
  const left = 54;
  const right = 660;
  const top = 20;
  const bottom = 190;
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => ({
    x: left + (right - left) * (index / Math.max(values.length - 1, 1)),
    y: bottom - (value / max) * (bottom - top),
  }));
  const line = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const controlX = (previous.x + point.x) / 2;
    const controlY = (previous.y + point.y) / 2;
    return `${path} Q ${controlX} ${controlY} ${point.x} ${point.y}`;
  }, "");
  const area = `${line} L ${right} ${bottom} L ${left} ${bottom} Z`;
  return { area, line, points, max };
}

export default function MyGroupsPage() {
  const navigate = useNavigate();
  const { data: groups, isLoading, error, refetch } = useGroups();
  const { data: me } = useMe();
  const [showCreate, setShowCreate] = useState(false);
  const months = getLastSixMonths();
  const today = new Date();
  const from = `${months[0].key}-01`;
  const to = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1)
  )
    .toISOString()
    .slice(0, 10);
  const groupStats = useGroupsStats(groups?.map((group) => group.id) ?? [], from, to);
  const statsError = groupStats.find((result) => result.error)?.error;
  const statsLoading = groupStats.some((result) => result.isLoading);
  const amountToCollect =
    groups?.reduce((total, group) => total + Math.max(group.myBalance, 0), 0) ?? 0;
  const amountToPay =
    groups?.reduce((total, group) => total + Math.max(-group.myBalance, 0), 0) ?? 0;
  const netBalance = amountToCollect - amountToPay;
  const groupsToSettle = groups?.filter((group) => group.myBalance !== 0).length ?? 0;
  const monthlySpend = months.map((month) => ({
    ...month,
    amount: groupStats.reduce(
      (total, result) =>
        total +
        (result.data?.byMonth.find((entry) => entry.month === month.key)?.amount ?? 0),
      0
    ),
  }));
  const totalSpend = groupStats.reduce(
    (total, result) => total + (result.data?.totalSpend ?? 0),
    0
  );
  const categorySpend = groupStats.reduce((totals, result) => {
    for (const entry of result.data?.byCategory ?? []) {
      totals.set(entry.category, (totals.get(entry.category) ?? 0) + entry.amount);
    }
    return totals;
  }, new Map<string, number>());
  const topCategory = [...categorySpend.entries()].sort((a, b) => b[1] - a[1])[0];
  const topCategoryLabel = topCategory?.[0]
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
  const {
    area,
    line,
    points,
    max: chartMax,
  } = makeChartPaths(monthlySpend.map((month) => month.amount));
  const hour = today.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const displayName = me?.name.split(" ")[0] || "there";

  const stats = [
    {
      label: "Group spend · 6 months",
      value: statsError ? "—" : statsLoading ? "…" : formatPKR(totalSpend),
      icon: ArrowLeftRight,
      highlight: true,
    },
    { label: "You are owed", value: formatPKR(amountToCollect), icon: ArrowDownLeft },
    { label: "You owe", value: formatPKR(amountToPay), icon: ArrowUpRight },
    { label: "Your groups", value: String(groups?.length ?? 0), icon: Users },
  ];

  const retryStats = () => {
    for (const result of groupStats) void result.refetch();
  };

  return (
    <PageContainer className="min-h-[calc(100vh-4rem)] max-w-none bg-[#F4F5F7] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <Text
            size="sm"
            className="mb-1 font-medium uppercase tracking-[0.12em] text-[#8A8F98]"
          >
            Your dashboard
          </Text>
          <Heading level={1} className="text-[clamp(1.75rem,4vw,2.25rem)] font-medium">
            {greeting}, <em className="font-normal text-[#71757D]">{displayName}</em>
          </Heading>
          <Text className="mt-1 text-[#71757D]">
            Here&apos;s what&apos;s happening across your groups.
          </Text>
        </div>
        <Button
          id="create-group-btn"
          color="primary"
          className="!rounded-full !bg-[#C8F23A] !px-5 !font-semibold !text-[#0F0F10] !shadow-none hover:!bg-[#B6E02A]"
          startContent={<Plus className="h-4 w-4" />}
          onPress={() => setShowCreate(true)}
        >
          New group
        </Button>
      </header>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={(error as Error).message} onRetry={() => refetch()} />
      ) : groups?.length === 0 ? (
        <Card className="border-[#ECEDEF] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <CardBody className="p-2">
            <EmptyState
              title="No groups yet"
              description="Create your first group to start splitting expenses with friends or flatmates."
              action={
                <Button
                  id="create-group-empty-btn"
                  color="primary"
                  className="!rounded-full !bg-[#C8F23A] !px-5 !font-semibold !text-[#0F0F10] !shadow-none hover:!bg-[#B6E02A]"
                  startContent={<Plus className="h-4 w-4" />}
                  onPress={() => setShowCreate(true)}
                >
                  Create group
                </Button>
              }
            />
          </CardBody>
        </Card>
      ) : (
        <>
          <Grid className="mb-6 grid-cols-2 gap-3 min-[1200px]:grid-cols-4 min-[1200px]:gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className={
                    stat.highlight
                      ? "border-transparent bg-[#C8F23A] text-[#0F0F10] shadow-none"
                      : "border-[#ECEDEF] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  }
                >
                  <CardBody className="min-h-32 gap-3 p-4 sm:min-h-36 sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                      <Text
                        size="sm"
                        className={
                          stat.highlight
                            ? "font-medium text-[#0F0F10]/75"
                            : "font-medium text-[#8A8F98]"
                        }
                      >
                        {stat.label}
                      </Text>
                      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                    </div>
                    <Heading
                      level={3}
                      className="break-words text-[clamp(1.05rem,3vw,1.75rem)] font-semibold tracking-[-0.02em] tabular-nums"
                    >
                      {stat.value}
                    </Heading>
                    {stat.highlight && !statsLoading && !statsError ? (
                      <svg
                        aria-label="Monthly group spending for the last six months"
                        className="h-8 w-full"
                        viewBox="0 0 180 32"
                        preserveAspectRatio="none"
                        role="img"
                      >
                        <polyline
                          fill="none"
                          points={monthlySpend
                            .map(
                              (month, index) =>
                                `${index * 36},${30 - (month.amount / Math.max(chartMax, 1)) * 26}`
                            )
                            .join(" ")}
                          stroke="#0F0F10"
                          strokeWidth="2"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    ) : null}
                  </CardBody>
                </Card>
              );
            })}
          </Grid>

          <Grid className="mb-8 grid-cols-1 gap-4 md:grid-cols-1 min-[1200px]:grid-cols-3">
            <Card className="border-[#ECEDEF] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] min-[1200px]:col-span-2">
              <CardBody className="gap-5 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Text size="sm" className="font-medium text-[#8A8F98]">
                      Total across your groups
                    </Text>
                    <Heading
                      level={2}
                      className="mt-1 text-3xl font-semibold tabular-nums"
                    >
                      {statsError ? "—" : statsLoading ? "…" : formatPKR(totalSpend)}
                    </Heading>
                    <Text size="sm" className="mt-1 text-[#8A8F98]">
                      Spending by month
                    </Text>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#ECEDEF] px-3 py-2 text-xs font-medium text-[#71757D]">
                    <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                    Last 6 months
                  </div>
                </div>

                {statsError ? (
                  <ErrorState
                    message={(statsError as Error).message}
                    onRetry={retryStats}
                  />
                ) : statsLoading ? (
                  <div
                    aria-label="Loading spending chart"
                    className="h-56 animate-pulse rounded-xl bg-[#F4F5F7]"
                  />
                ) : totalSpend === 0 ? (
                  <div className="flex h-56 items-center justify-center rounded-xl bg-[#F4F5F7] px-4 text-center">
                    <Text size="sm" className="text-[#71757D]">
                      No expenses have been recorded in the last six months.
                    </Text>
                  </div>
                ) : (
                  <div className="min-w-0">
                    <svg
                      role="img"
                      aria-label={`Monthly group spending for the last six months. Total ${formatPKR(totalSpend)}.`}
                      className="h-56 w-full overflow-visible"
                      viewBox="0 0 680 230"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="spending-fill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#C8F23A" stopOpacity="0.55" />
                          <stop offset="100%" stopColor="#C8F23A" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      {[40, 85, 130, 175].map((y) => (
                        <line
                          key={y}
                          x1="54"
                          x2="660"
                          y1={y}
                          y2={y}
                          stroke="#ECEDEF"
                          strokeDasharray="2 5"
                        />
                      ))}
                      {[0, 0.5, 1].map((fraction) => (
                        <text
                          key={fraction}
                          x="0"
                          y={194 - fraction * 170}
                          fill="#8A8F98"
                          fontSize="10"
                        >
                          {formatPKR(Math.round(chartMax * fraction))}
                        </text>
                      ))}
                      <path d={area} fill="url(#spending-fill)" />
                      <path
                        d={line}
                        fill="none"
                        stroke="#0B0B0B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                      {points.map((point, index) =>
                        index === points.length - 1 ? (
                          <g key={point.x}>
                            <circle cx={point.x} cy={point.y} r="5" fill="#0B0B0B" />
                            <circle cx={point.x} cy={point.y} r="2" fill="#C8F23A" />
                            <title>
                              {monthlySpend[index].label}:{" "}
                              {formatPKR(monthlySpend[index].amount)}
                            </title>
                          </g>
                        ) : null
                      )}
                      {monthlySpend.map((month, index) => (
                        <text
                          key={month.key}
                          x={54 + (606 * index) / 5}
                          y="218"
                          fill="#8A8F98"
                          fontSize="11"
                          textAnchor="middle"
                        >
                          {month.label}
                        </text>
                      ))}
                    </svg>
                  </div>
                )}
              </CardBody>
            </Card>

            <Card className="overflow-hidden border-0 bg-[#0B0B0B] text-white shadow-none">
              <CardBody className="min-h-64 justify-between gap-6 p-5 sm:p-6">
                <div>
                  <Text size="sm" className="font-medium text-white/65">
                    Net balance
                  </Text>
                  <Heading
                    level={2}
                    className="mt-3 break-words text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-white tabular-nums"
                  >
                    {formatPKR(netBalance)}
                  </Heading>
                  <Text size="sm" className="mt-2 text-white/65">
                    {netBalance > 0
                      ? "Overall, you are owed money"
                      : netBalance < 0
                        ? "Overall, you owe money"
                        : "Your balances are settled"}
                  </Text>
                </div>
                <div>
                  {[
                    ["Owed to you", formatPKR(amountToCollect)],
                    ["You owe", formatPKR(amountToPay)],
                    ["Groups to settle", String(groupsToSettle)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-3 border-t border-white/10 py-3"
                    >
                      <Text size="sm" className="text-white/65">
                        {label}
                      </Text>
                      <Text size="sm" className="font-medium text-white tabular-nums">
                        {value}
                      </Text>
                    </div>
                  ))}
                </div>
                {topCategory && !statsLoading && !statsError ? (
                  <Text size="sm" className="text-white/65">
                    Top expense category:{" "}
                    <span className="font-medium text-[#C8F23A]">{topCategoryLabel}</span>
                  </Text>
                ) : null}
              </CardBody>
            </Card>
          </Grid>

          <section aria-labelledby="groups-heading">
            <div className="mb-4 flex items-center justify-between gap-3">
              <Heading id="groups-heading" level={2}>
                Your groups
              </Heading>
              <Text size="sm" className="text-[#8A8F98]">
                {groups?.length ?? 0} groups
              </Text>
            </div>
            <Grid className="grid-cols-1 gap-4 min-[768px]:grid-cols-2 2xl:grid-cols-3">
              {groups?.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </Grid>
          </section>
        </>
      )}

      <Modal
        isOpen={showCreate}
        onOpenChange={setShowCreate}
        scrollBehavior="normal"
        classNames={{
          base: "overflow-visible",
          body: "overflow-visible pb-6",
        }}
      >
        <ModalHeader>Create a new group</ModalHeader>
        <ModalBody className="overflow-visible">
          <CreateGroupForm
            onSuccess={(groupId) => {
              setShowCreate(false);
              navigate(`/groups/${groupId}`);
            }}
          />
        </ModalBody>
      </Modal>
    </PageContainer>
  );
}
