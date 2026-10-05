import { Clock, Check, X, Ban } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import type { SettlementStatus } from "@/types/ui";
import { uiStrings } from "@/lib/uiStrings";
const icons = { PENDING: Clock, CONFIRMED: Check, REJECTED: X, CANCELLED: Ban };
const colors = { PENDING: "warning", CONFIRMED: "success", REJECTED: "danger", CANCELLED: "default" } as const;
/** Settlement state with accessible text and a distinct icon. */
export function StatusChip({ status, className }: { status: SettlementStatus; className?: string }) { const Icon = icons[status]; return <Chip className={className} color={colors[status]} startContent={<Icon size={16} aria-hidden="true" />}>{uiStrings.status[status]}</Chip>; }
