import { ArrowUpRight, Receipt, Users, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { copy, members } from "./fixtures";
import { Grid } from "@/components/ui/Grid";
import { Stack } from "@/components/ui/Stack";
import { Card } from "@/components/ui/Card";
import { CardBody } from "@/components/ui/CardBody";
import { Text } from "@/components/ui/Text";
import { Heading } from "@/components/ui/Heading";
import { Money } from "@/components/ui/Money";
import { Avatar } from "@/components/ui/Avatar";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import { StatCard } from "@/components/shared/StatCard";
import { BalanceBadge } from "@/components/shared/BalanceBadge";
import { SectionHeader } from "@/components/shared/SectionHeader";
/** A composed product preview using the same reusable primitives. */
export function OverviewSection() {
 return <Stack className="gap-8">
 <Grid className="lg:grid-cols-3"><Card className="lg:col-span-2 bg-primary/5"><CardBody className="gap-6"><Text size="sm" muted>{copy.eyebrow}</Text><Heading level={1}>{copy.overview}</Heading><Text muted>{copy.overviewText}</Text><Stack className="flex-row items-center flex-wrap"><AvatarGroup>{members.map(m => <Avatar key={m.id} name={m.name} />)}</AvatarGroup><Text size="sm">{copy.sample}</Text></Stack></CardBody></Card><StatCard label={copy.balance} value={<Money amount={300000} size="hero" />} icon={<Wallet size={24} />} hint={copy.monthHint} /></Grid>
 <SectionHeader title={copy.metrics} action={<BalanceBadge amount={300000} />} /><Grid className="lg:grid-cols-3"><StatCard label={copy.total} value={<Money amount={900000} />} icon={<Receipt size={20} />} /><StatCard label={copy.paid} value={<Money amount={600000} />} icon={<ArrowUpRight size={20} />} /><StatCard label={copy.share} value={<Money amount={300000} />} icon={<Users size={20} />} /></Grid>
 <Grid>{["controls","overlays","data","layouts"].map((key, i) => <Link key={key} to={"/_playground/" + key} className="rounded-card focus-visible:outline focus-visible:outline-primary"><Card className="h-full hover:border-primary"><CardBody><Text size="sm" muted>{"0" + (i + 1)}</Text><Heading level={3}>{copy.sections[i + 1]}</Heading><Text size="sm" muted>{copy[(key + "Text") as "controlsText" | "overlaysText" | "dataText" | "layoutsText"]}</Text></CardBody></Card></Link>)}</Grid>
 </Stack>;
}
