import { Link } from "react-router-dom";
import { Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CardBody } from "@/components/ui/CardBody";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Chip } from "@/components/ui/Chip";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import { formatPKR } from "@/lib/format";
import { cn } from "@/lib/cn";
import { GROUP_TYPE_LABELS } from "@/lib/constants";
import type { Group } from "../hooks";

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  const balance = group.myBalance;
  const isPositive = balance > 0;
  const isNegative = balance < 0;

  const balanceColor = isPositive
    ? "text-success"
    : isNegative
    ? "text-danger"
    : "text-default-500";

  const BalanceIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <Link to={`/groups/${group.id}`} className="block group focus:outline-none">
      <Card
        isPressable
        className="h-full transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-primary"
      >
        <CardBody className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Heading level={3} className="truncate text-lg">
                {group.name}
              </Heading>
              <Chip size="sm" variant="flat" className="mt-1">
                {GROUP_TYPE_LABELS[group.type as keyof typeof GROUP_TYPE_LABELS] ?? group.type}
              </Chip>
            </div>
            <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Member avatars */}
          {group.members.length > 0 && (
            <AvatarGroup
              users={group.members.map((m) => ({ name: m.name, src: m.avatarUrl ?? undefined }))}
              max={5}
            />
          )}

          {/* Balance */}
          <div className="pt-2 border-t border-divider">
            <div className={cn("flex items-center gap-1.5", balanceColor)}>
              <BalanceIcon className="w-4 h-4 flex-shrink-0" />
              <Text size="sm" className={cn("font-semibold", balanceColor)}>
                {balance === 0
                  ? "All settled"
                  : isPositive
                  ? `You get back ${formatPKR(balance)}`
                  : `You owe ${formatPKR(Math.abs(balance))}`}
              </Text>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
