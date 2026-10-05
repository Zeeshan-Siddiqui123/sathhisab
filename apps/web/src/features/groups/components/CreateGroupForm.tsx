import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Stack } from "@/components/ui/Stack";
import { Alert } from "@/components/ui/Alert";
import { GROUP_TYPES, GROUP_TYPE_LABELS } from "@/lib/constants";
import { useCreateGroup } from "../hooks";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  type: z.enum(GROUP_TYPES),
});
type FormValues = z.infer<typeof schema>;

interface CreateGroupFormProps {
  onSuccess?: (groupId: string) => void;
}

export function CreateGroupForm({ onSuccess }: CreateGroupFormProps) {
  const create = useCreateGroup();

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "FLAT" },
  });

  const onSubmit = async (data: FormValues) => {
    const group = await create.mutateAsync(data);
    onSuccess?.(group.id);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack>
        {create.error && (
          <Alert tone="danger" title="Error">
            {(create.error as Error).message}
          </Alert>
        )}
        <Input
          id="group-name"
          label="Group name"
          placeholder="e.g. Flat 4B, Lahore Trip"
          autoFocus
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          {...register("name")}
        />
        <Select
          label="Group type"
          error={errors.type?.message}
              value={watch("type")}
              onValueChange={value => setValue("type", value as FormValues["type"], { shouldDirty: true, shouldValidate: true })}
          options={GROUP_TYPES.map((t) => ({
            value: t,
            label: GROUP_TYPE_LABELS[t],
          }))}
        />
        <Button
          id="group-create-submit"
          type="submit"
          color="primary"
          fullWidth
          isLoading={isSubmitting || create.isPending}
        >
          Create group
        </Button>
      </Stack>
    </form>
  );
}
