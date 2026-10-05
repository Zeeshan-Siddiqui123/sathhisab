import { useState } from "react";
import { Showcase } from "./Showcase";
import { copy, demoImage } from "./fixtures";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/ModalHeader";
import { ModalBody } from "@/components/ui/ModalBody";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { Drawer } from "@/components/ui/Drawer";
import { Dropdown } from "@/components/ui/Dropdown";
import { Popover } from "@/components/ui/Popover";
import { Tooltip } from "@/components/ui/Tooltip";
import { Alert } from "@/components/ui/Alert";
import { useToast } from "@/components/ui/Toast";
import { Tabs } from "@/components/ui/Tabs";
import { Stack } from "@/components/ui/Stack";
import { Grid } from "@/components/ui/Grid";
import { Text } from "@/components/ui/Text";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { CopyField } from "@/components/shared/CopyField";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { ImagePreviewModal } from "@/components/shared/ImagePreviewModal";
import { uiStrings } from "@/lib/uiStrings";
/** Overlay triggers, async confirmation and feedback examples. */
export function OverlaySection() {
 const [modal, setModal] = useState(false);
 const [drawer, setDrawer] = useState(false);
 const [preview, setPreview] = useState(false);
 const [file, setFile] = useState<File | null>(null);
 const [action, setAction] = useState(copy.noAction);
 const toast = useToast();
 return <Stack>
 <Showcase title={copy.dialogs}><Stack className="flex-row flex-wrap"><Button onPress={() => setModal(true)}>{copy.modal}</Button><Button variant="secondary" onPress={() => setDrawer(true)}>{copy.drawer}</Button><ConfirmActionButton label={copy.confirm} title={copy.confirmTitle} message={copy.confirmMessage} confirmLabel={copy.confirmLabel} onConfirm={async () => { await new Promise(resolve => setTimeout(resolve, 400)); setAction(copy.confirmation); }} /><ConfirmActionButton danger label={copy.failing} title={copy.failTitle} message={copy.failMessage} onConfirm={async () => { throw new Error(copy.failError); }} /></Stack>
 <Stack className="flex-row flex-wrap"><Dropdown label={copy.menu} trigger={<Button variant="ghost">{copy.menuTrigger}</Button>} actions={[{ key:"edit", label: copy.edit, onAction: () => setAction(copy.edit) }, { key:"archive", label:copy.archive, danger:true, onAction: () => setAction(copy.archive) }]} /><Popover trigger={<Button variant="ghost">{copy.popover}</Button>}><Text size="sm">{copy.popoverText}</Text></Popover><Tooltip content={copy.tooltip}><Button variant="soft">{copy.tooltip}</Button></Tooltip></Stack><Text role="status">{copy.result}: {action}</Text></Showcase>
 <Modal isOpen={modal} onOpenChange={setModal}><ModalHeader>{copy.modalTitle}</ModalHeader><ModalBody><Text>{copy.modalText}</Text></ModalBody><ModalFooter><Button onPress={() => setModal(false)}>{uiStrings.close}</Button></ModalFooter></Modal>
 <Drawer title={copy.drawerTitle} isOpen={drawer} onOpenChange={setDrawer}><Text>{copy.modalText}</Text></Drawer>
 <Showcase title={copy.notices}><Grid>{(["info","success","warning","danger"] as const).map(tone => <Alert key={tone} tone={tone} title={tone === "danger" ? copy.error : copy[tone]} />)}</Grid><Stack className="flex-row flex-wrap"><Button onPress={() => toast.success(copy.toastMessage)}>{copy.successToast}</Button><Button variant="danger" onPress={() => toast.error(copy.toastMessage)}>{copy.errorToast}</Button><Button variant="soft" onPress={() => toast.info(copy.toastMessage)}>{copy.infoToast}</Button></Stack><Tabs label={copy.notices} items={[copy.tabOne,copy.tabTwo,copy.tabThree].map(label => ({ key:label, label, content:<Text>{label}</Text> }))} /></Showcase>
 <Grid><Showcase title={copy.copy}><CopyField label={copy.copy} value={copy.inviteValue} /></Showcase><Showcase title={copy.upload}><FileDropzone value={file} onValueChange={setFile} /><Button variant="secondary" onPress={() => setPreview(true)}>{copy.image}</Button><ImagePreviewModal src={demoImage} isOpen={preview} onOpenChange={setPreview} /></Showcase></Grid>
 </Stack>;
}
