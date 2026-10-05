import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
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
import { GroupCard } from "../features/groups/components/GroupCard";
import { CreateGroupForm } from "../features/groups/components/CreateGroupForm";
import { useGroups } from "../features/groups/hooks";

export default function MyGroupsPage() {
  const navigate = useNavigate();
  const { data: groups, isLoading, error, refetch } = useGroups();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <PageContainer>
      <PageHeader
        title="My Groups"
        subtitle="Manage your shared expense groups"
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
        <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap={4} className="mt-6">
          {groups?.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </Grid>
      )}

      {/* Create Group Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        size="md"
      >
        <ModalHeader>Create a new group</ModalHeader>
        <ModalBody>
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
