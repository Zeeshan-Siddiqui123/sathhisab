import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDownLeft, ArrowUpRight, Plus, Users } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
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

export default function MyGroupsPage() {
  const navigate = useNavigate();
  const { data: groups, isLoading, error, refetch } = useGroups();
  const [showCreate, setShowCreate] = useState(false);
  const amountToCollect = groups?.reduce(
    (total, group) => total + Math.max(group.myBalance, 0),
    0
  ) ?? 0;
  const amountToPay = groups?.reduce(
    (total, group) => total + Math.max(-group.myBalance, 0),
    0
  ) ?? 0;

  return (
    <PageContainer>
      <PageHeader
        title="Your overview"
        subtitle="Your shared expenses and balances at a glance"
        action={
          <Button
            id="create-group-btn"
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onPress={() => setShowCreate(true)}
          >
            New group
          </Button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          message={(error as Error).message}
          onRetry={() => refetch()}
        />
      ) : groups?.length === 0 ? (
        <EmptyState
          title="No groups yet"
          description="Create your first group to start splitting expenses with friends or flatmates."
          action={
            <Button
              id="create-group-empty-btn"
              color="primary"
              startContent={<Plus className="w-4 h-4" />}
              onPress={() => setShowCreate(true)}
            >
              Create group
            </Button>
          }
        />
      ) : (
        <>
          <Card className="mb-4 overflow-hidden border-0 bg-primary text-primary-foreground">
            <CardBody className="flex flex-row items-center justify-between gap-4 p-5 sm:p-6">
              <div>
                <Text size="sm" className="text-primary-foreground">
                  Net balance across your groups
                </Text>
                <Heading level={2} className="mt-1 text-3xl text-primary-foreground">
                  {formatPKR(amountToCollect - amountToPay)}
                </Heading>
                <Text size="sm" className="mt-1 text-primary-foreground">
                  {amountToCollect > amountToPay
                    ? "Overall, you are owed money"
                    : amountToPay > amountToCollect
                      ? "Overall, you owe money"
                      : "Your balances are settled"}
                </Text>
              </div>
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex">
                <Users aria-hidden="true" className="h-7 w-7" />
              </div>
            </CardBody>
          </Card>

          <Grid className="mb-8 grid-cols-2 gap-3">
            <Card>
              <CardBody className="p-4 sm:p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-success-soft text-success">
                  <ArrowDownLeft aria-hidden="true" className="h-5 w-5" />
                </div>
                <Text muted size="sm">You are owed</Text>
                <Heading level={3} className="mt-1 text-xl sm:text-2xl">
                  {formatPKR(amountToCollect)}
                </Heading>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4 sm:p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-danger-soft text-danger">
                  <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
                </div>
                <Text muted size="sm">You owe</Text>
                <Heading level={3} className="mt-1 text-xl sm:text-2xl">
                  {formatPKR(amountToPay)}
                </Heading>
              </CardBody>
            </Card>
          </Grid>

          <section aria-labelledby="groups-heading">
            <div className="mb-4 flex items-center justify-between gap-3">
              <Heading id="groups-heading" level={2}>Your groups</Heading>
              <Text muted size="sm">{groups?.length ?? 0} groups</Text>
            </div>
            <Grid className="grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groups?.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </Grid>
          </section>
        </>
      )}

      {/* Create Group Modal */}
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
