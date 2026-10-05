import { useState } from "react";
import { Showcase } from "./Showcase";
import { copy, members, groups } from "./fixtures";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { GroupLayout } from "@/components/layout/GroupLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { GroupRoute } from "@/components/layout/GroupRoute";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CardBody } from "@/components/ui/CardBody";
import { CardFooter } from "@/components/ui/CardFooter";
import { Text } from "@/components/ui/Text";
import { Stack } from "@/components/ui/Stack";
import { Grid } from "@/components/ui/Grid";
/** Boundary previews use explicit states; no demo session escapes this dev route. */
export function LayoutsSection() {
 const [retried, setRetried] = useState(false);
 return <Stack><PageHeader title={copy.layouts} subtitle={copy.nav} breadcrumbs={[{label:"Playground",href:"/_playground"}]} /><SectionHeader title={copy.auth} href="/_playground/controls" /><AuthLayout title={copy.authTitle}><Input type="email" label="Email" /><PasswordInput label={copy.password} /><Button onPress={() => setRetried(true)}>{copy.authButton}</Button></AuthLayout>
 <Showcase title={copy.groups}><GroupLayout group={{ status:"ready", data:groups[0] }} links={[{label:copy.tabOne,href:"/_playground/layouts"}]}><Card><CardBody><Text>{copy.groupContent}</Text></CardBody><CardFooter><Text size="sm">{copy.sample}</Text></CardFooter></Card></GroupLayout></Showcase>
 <Showcase title={copy.guards}><Grid><ProtectedRoute session={{ status:"ready",data:members[0] }}><Text>{copy.allowed}</Text></ProtectedRoute><ProtectedRoute session={{ status:"loading" }} /><ProtectedRoute session={{ status:"error",message:copy.errorState,retry:() => setRetried(true) }} /><GroupRoute group={{ status:"ready",data:null }} /><GroupRoute group={{ status:"loading" }} /><GroupRoute group={{ status:"error",message:copy.errorState,retry:() => setRetried(true) }} /></Grid>{retried ? <Text role="status">{copy.retried}</Text> : null}</Showcase>
 </Stack>;
}
