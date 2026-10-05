import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Stack } from "@/components/ui/Stack";
import { Divider } from "@/components/ui/Divider";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { GROUP_TYPES, GROUP_TYPE_LABELS } from "@/lib/constants";
import { useGroup, useUpdateGroup } from "../features/groups/hooks";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(2).max(100),
  type: z.enum(GROUP_TYPES),
});
type FormValues = z.infer<typeof schema>;

export default function GroupSettingsPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { data: group, isLoading, error, refetch } = useGroup(groupId!);
  const update = useUpdateGroup(groupId!);
  const [saved, setSaved] = useState(false);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: group ? { name: group.name, type: group.type as typeof GROUP_TYPES[number] } : undefined,
  });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={(error as Error).message} onRetry={refetch} />;
  if (!group) return null;

  const isOwner = group.myRole === "OWNER";

  const onSubmit = async (data: FormValues) => {
    await update.mutateAsync(data);
    setSaved(true);
    reset(data);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PageContainer>
      <PageHeader title="Settings" subtitle={group.name} />

      {isOwner ? (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack className="max-w-md">
            {update.error && (
              <Alert tone="danger" title="Unable to save">{(update.error as Error).message}</Alert>
            )}
            {saved && <Alert tone="success" title="Saved">Settings saved!</Alert>}

            <Input
              id="settings-name"
              label="Group name"
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              {...register("name")}
            />
            <Select
              label="Group type"
              error={errors.type?.message}
              value={watch("type")}
              onValueChange={value => setValue("type", value as FormValues["type"], { shouldDirty: true, shouldValidate: true })}
              options={GROUP_TYPES.map((t) => ({ value: t, label: GROUP_TYPE_LABELS[t] }))}
            />
            <Button
              id="settings-save"
              type="submit"
              color="primary"
              isDisabled={!isDirty}
              isLoading={isSubmitting || update.isPending}
            >
              Save changes
            </Button>
          </Stack>
        </form>
      ) : (
        <Alert tone="info" title="Group settings">Only group owners can change settings.</Alert>
      )}

      <Divider className="my-8" />

      {/* Danger zone */}
      <div className="rounded-xl border border-danger/30 p-5 space-y-3 max-w-md">
        <Heading level={4} className="text-danger">Danger zone</Heading>
        <Text muted size="sm">
          Once you delete a group, all data is permanently removed. This action cannot be undone.
        </Text>
        <Button
          id="settings-back"
          variant="soft"
          color="default"
          onPress={() => navigate(`/groups/${groupId}`)}
        >
          Back to overview
        </Button>
      </div>
    </PageContainer>
  );
}
