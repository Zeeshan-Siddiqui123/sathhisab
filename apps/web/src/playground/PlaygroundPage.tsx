import { useState } from "react";
import { useParams } from "react-router-dom";
import { LayoutDashboard, SlidersHorizontal, Layers, Rows3, PanelsTopLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { GroupSwitcher } from "@/components/shared/GroupSwitcher";
import { UserMenu } from "@/components/shared/UserMenu";
import { Text } from "@/components/ui/Text";
import { useToast } from "@/components/ui/Toast";
import { copy, groups, members } from "./fixtures";
import { OverviewSection } from "./OverviewSection";
import { ControlsSection } from "./ControlsSection";
import { OverlaySection } from "./OverlaySection";
import { DataSection } from "./DataSection";
import { LayoutsSection } from "./LayoutsSection";
const icons = [LayoutDashboard, SlidersHorizontal, Layers, Rows3, PanelsTopLeft];
const paths = ["", "/controls", "/overlays", "/data", "/layouts"];
const items = copy.sections.map((label, i) => { const Icon = icons[i]; return { label, href: "/_playground" + paths[i], icon: <Icon size={20} aria-hidden="true" /> }; });
/** Dev-only interactive catalogue; sample state never calls the backend. */
export default function PlaygroundPage() {
 const { section = "" } = useParams();
 const [group, setGroup] = useState("flat");
 const toast = useToast();
 return <AppShell items={items} groupSwitcher={<GroupSwitcher groups={groups} value={group} onValueChange={setGroup} />} search={<Text size="sm" muted>{copy.sample}</Text>} userMenu={<UserMenu user={members[0]} onProfile={() => toast.info(copy.sample)} onLogout={() => toast.info(copy.sample)} />}>
 <PageContainer><PageHeader title={section === "" ? copy.title : copy[section as "controls" | "overlays" | "data" | "layouts"] ?? copy.title} subtitle={copy.subtitle} />
 {section === "controls" ? <ControlsSection /> : section === "overlays" ? <OverlaySection /> : section === "data" ? <DataSection /> : section === "layouts" ? <LayoutsSection /> : <OverviewSection />}
 </PageContainer></AppShell>;
}
