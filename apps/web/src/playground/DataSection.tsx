import { useState } from "react";
import { Plus, Receipt, Wallet } from "lucide-react";
import { Showcase } from "./Showcase";
import { copy, members, rows } from "./fixtures";
import { Avatar } from "@/components/ui/Avatar";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { Divider } from "@/components/ui/Divider";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { LoadMore } from "@/components/ui/LoadMore";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Money } from "@/components/ui/Money";
import { VisuallyHidden } from "@/components/ui/VisuallyHidden";
import { Container } from "@/components/ui/Container";
import { Stack } from "@/components/ui/Stack";
import { Grid } from "@/components/ui/Grid";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/shared/StatCard";
import { BalanceBadge } from "@/components/shared/BalanceBadge";
import { MemberAvatar } from "@/components/shared/MemberAvatar";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { StatusChip } from "@/components/shared/StatusChip";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { ChartCard } from "@/components/shared/ChartCard";
import { ActivityItem } from "@/components/shared/ActivityItem";
import { FilterBar } from "@/components/shared/FilterBar";
import { CATEGORIES } from "@/lib/constants";
import type { SettlementStatus } from "@/types/ui";
/** Data primitives, all domain badge variants and empty/loading states. */
export function DataSection() {
 const [page, setPage] = useState(1);
 const [count, setCount] = useState(1);
 const [retried, setRetried] = useState(false);
 const [filters, setFilters] = useState({ month:"2026-10", category:"", member:"" });
 return <Stack>
 <Grid className="lg:grid-cols-3"><StatCard label={copy.total} value={<Money amount={900000} />} icon={<Wallet size={20} />} hint={copy.monthHint} /><StatCard label={copy.paid} value={<Money amount={600000} />} /><StatCard label={copy.share} value={<Money amount={300000} />} /></Grid>
 <Showcase title={copy.badges}><Stack className="flex-row flex-wrap">{rows.map(row => <BalanceBadge key={row.id} amount={row.balance} />)}</Stack><Stack className="flex-row flex-wrap">{(["PENDING","CONFIRMED","REJECTED","CANCELLED"] as SettlementStatus[]).map(status => <StatusChip key={status} status={status} />)}</Stack><Stack className="flex-row flex-wrap">{CATEGORIES.map(category => <CategoryBadge key={category} category={category} />)}</Stack><Divider /><Stack className="flex-row flex-wrap items-center"><AvatarGroup>{members.map(member => <Avatar key={member.id} name={member.name} />)}</AvatarGroup><Badge content="3" color="primary"><Avatar name="Zeeshan" /></Badge><Chip>Chip</Chip></Stack>{members.map(member => <MemberAvatar key={member.id} member={member} showRole />)}</Showcase>
 <Showcase title={copy.filters}><FilterBar members={members} value={filters} onValueChange={setFilters} /></Showcase>
 <Showcase title={copy.table}><Table label={copy.table} rows={rows} rowKey={row => row.id} empty={<EmptyState title={copy.empty} />} columns={[{ key:"name", label:copy.member, render:row => <MemberAvatar member={row} /> }, { key:"balance", label:copy.balance, render:row => <BalanceBadge amount={row.balance} /> }]} /><Pagination aria-label="Pagination" total={5} page={page} onChange={setPage} /><LoadMore hasMore={count < 3} onPress={() => setCount(count + 1)} /><Text size="sm">Pagination: {page} / LoadMore: {count}</Text></Showcase>
 <Grid><Showcase title={copy.empty}><EmptyState title={copy.empty} description={copy.emptyHint} action={<Button leftIcon={<Plus size={16} />} onPress={() => setRetried(true)}>{copy.action}</Button>} /><ErrorState message={copy.errorState} onRetry={() => setRetried(true)} />{retried ? <Text role="status">{copy.retried}</Text> : null}</Showcase><Showcase title={copy.loadingStates}><Skeleton /><Skeleton variant="circle" /><Skeleton variant="card" /><Spinner label={copy.loading} /><ProgressBar label={copy.chartLabel} value={65} /><LoadingState layout="list" /><LoadingState layout="card" /><LoadingState layout="page" /></Showcase></Grid>
 <Grid><ChartCard title={copy.chart}><ProgressBar label={copy.chartLabel} value={67} /><Text>{copy.monthHint}</Text></ChartCard><ChartCard title={copy.chartEmpty} empty /></Grid>
 <Showcase title={copy.activity}><ActivityItem date="2026-10-02T08:00:00Z" icon={<Receipt size={20} />}>{copy.activityText}</ActivityItem></Showcase>
 <Showcase title={copy.shapes}><Container><Stack><Heading level={1}>{copy.typography}</Heading><Heading level={2}>{copy.body}</Heading><Heading level={3}>{copy.body}</Heading><Heading level={4}>{copy.body}</Heading>{(["sm","md","lg"] as const).map(size => <Text key={size} size={size} muted={size === "sm"}>{copy.small}</Text>)}<Grid>{(["positive","negative","neutral"] as const).map(tone => <Stack key={tone}>{(["sm","md","lg","hero"] as const).map(size => <Money key={size} amount={10050} tone={tone} size={size} />)}</Stack>)}</Grid><VisuallyHidden>{copy.tokenNote}</VisuallyHidden></Stack></Container></Showcase>
 </Stack>;
}
