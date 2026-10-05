import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeftRight, Plus } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusChip } from "@/components/shared/StatusChip";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CardBody } from "@/components/ui/CardBody";
import { Modal } from "@/components/ui/Modal";
import { ModalBody } from "@/components/ui/ModalBody";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { ModalHeader } from "@/components/ui/ModalHeader";
import { Money } from "@/components/ui/Money";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { Select } from "@/components/ui/Select";
import { Tabs } from "@/components/ui/Tabs";
import { Text } from "@/components/ui/Text";
import { Textarea } from "@/components/ui/Textarea";
import { formatDateTime } from "@/lib/format";
import { useMe } from "@/features/auth/hooks";
import { useGroup } from "@/features/groups/hooks";
import {
  useCancelSettlement,
  useConfirmSettlement,
  useCreateSettlement,
  useRejectSettlement,
  useSettlements,
  type Settlement,
} from "@/features/balances/hooks";

type TabKey = "PENDING" | "HISTORY";

function SettlementCard({
  settlement,
  currentUserId,
  onConfirm,
  onReject,
  onCancel,
}: {
  settlement: Settlement;
  currentUserId?: string;
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const isReceiver = settlement.toUserId === currentUserId;
  const isSender = settlement.fromUserId === currentUserId;
  return (
    <Card>
      <CardBody className="space-y-4 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Text className="font-semibold">
              {settlement.fromUser.name} paid {settlement.toUser.name}
            </Text>
            <Text muted size="sm">
              {formatDateTime(settlement.createdAt)}
            </Text>
          </div>
          <div className="text-right">
            <Money amount={settlement.amount} />
            <div className="mt-1">
              <StatusChip status={settlement.status} />
            </div>
          </div>
        </div>
        {settlement.note ? <Text>{settlement.note}</Text> : null}
        {settlement.status === "PENDING" ? (
          <div className="flex flex-wrap gap-2">
            {isReceiver ? (
              <Button size="sm" onPress={() => onConfirm(settlement.id)}>
                Confirm
              </Button>
            ) : null}
            {isReceiver ? (
              <Button size="sm" variant="danger" onPress={() => onReject(settlement.id)}>
                Reject
              </Button>
            ) : null}
            {isSender ? (
              <Button size="sm" variant="ghost" onPress={() => onCancel(settlement.id)}>
                Cancel
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

export default function SettlementsPage() {
  const { groupId = "" } = useParams<{ groupId: string }>();
  const { data: me } = useMe();
  const group = useGroup(groupId);
  const settlements = useSettlements(groupId);
  const create = useCreateSettlement(groupId);
  const confirm = useConfirmSettlement(groupId);
  const reject = useRejectSettlement(groupId);
  const cancel = useCancelSettlement(groupId);
  const [tab, setTab] = useState<TabKey>("PENDING");
  const [open, setOpen] = useState(false);
  const [toUserId, setToUserId] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const visible = useMemo(() => {
    const data = settlements.data ?? [];
    return tab === "PENDING"
      ? data.filter((item) => item.status === "PENDING")
      : data.filter((item) => item.status !== "PENDING");
  }, [settlements.data, tab]);

  const submit = async () => {
    setError("");
    if (!toUserId) return setError("Choose a receiver.");
    if (!amount || amount <= 0) return setError("Amount must be greater than zero.");
    await create.mutateAsync({ toUserId, amount, note: note.trim() || undefined });
    setOpen(false);
    setToUserId("");
    setAmount(null);
    setNote("");
  };

  if (settlements.isLoading) return <LoadingState />;
  if (settlements.error)
    return (
      <ErrorState
        message={(settlements.error as Error).message}
        onRetry={() => void settlements.refetch()}
      />
    );

  return (
    <PageContainer>
      <PageHeader
        title="Settlements"
        subtitle="Record payments and confirm received money"
        action={
          <Button leftIcon={<Plus size={16} />} onPress={() => setOpen(true)}>
            Record payment
          </Button>
        }
      />
      <Tabs
        label="Settlement views"
        value={tab}
        onValueChange={(key: string) => setTab(key as TabKey)}
        items={[
          { key: "PENDING", label: "Pending", content: null },
          { key: "HISTORY", label: "History", content: null },
        ]}
      />
      <div className="mt-5 space-y-3">
        {visible.length === 0 ? (
          <EmptyState
            title="No settlements"
            description="Payments recorded for this group will appear here."
            icon={<ArrowLeftRight />}
          />
        ) : null}
        {visible.map((settlement) => (
          <SettlementCard
            key={settlement.id}
            settlement={settlement}
            currentUserId={me?.id}
            onConfirm={(id) => void confirm.mutateAsync(id)}
            onReject={(id) => void reject.mutateAsync(id)}
            onCancel={(id) => void cancel.mutateAsync(id)}
          />
        ))}
      </div>
      <Modal isOpen={open} onOpenChange={setOpen}>
        <ModalHeader>Record payment</ModalHeader>
        <ModalBody>
          {error ? <Text className="text-danger">{error}</Text> : null}
          <Select
            label="Receiver"
            value={toUserId}
            onValueChange={setToUserId}
            options={(group.data?.members ?? [])
              .filter((member) => member.id !== me?.id)
              .map((member) => ({ value: member.id, label: member.name }))}
          />
          <MoneyInput value={amount} onValueChange={setAmount} />
          <Textarea
            label="Note"
            value={note}
            onValueChange={setNote}
            maxLength={300}
            counter
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onPress={() => setOpen(false)}>
            Cancel
          </Button>
          <Button isLoading={create.isPending} onPress={() => void submit()}>
            Save payment
          </Button>
        </ModalFooter>
      </Modal>
    </PageContainer>
  );
}
