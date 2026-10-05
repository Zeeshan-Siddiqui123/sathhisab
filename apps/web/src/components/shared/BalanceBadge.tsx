import { ArrowDownLeft, ArrowUpRight, Check } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { formatPKR } from "@/lib/money";
import { strings } from "@/lib/strings";
/** Sign, label and icon communicate balance without relying on color. */
export function BalanceBadge({ amount, className }: { amount: number; className?: string }) {
 const Icon = amount > 0 ? ArrowDownLeft : amount < 0 ? ArrowUpRight : Check;
 return <Chip className={className} color={amount > 0 ? "success" : amount < 0 ? "danger" : "default"} startContent={<Icon size={16} aria-hidden="true" />}>{amount === 0 ? strings.balance.settled : (amount > 0 ? strings.balance.getsBack : strings.balance.owes) + " " + formatPKR(Math.abs(amount))}</Chip>;
}
