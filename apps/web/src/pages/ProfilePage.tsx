import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, X } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Alert } from "@/components/ui/Alert";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CardBody } from "@/components/ui/CardBody";
import { Input } from "@/components/ui/Input";
import { Stack } from "@/components/ui/Stack";
import { Text } from "@/components/ui/Text";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { EffectsToggle } from "@/components/shared/EffectsToggle";
import { usePWAInstallPrompt } from "@/hooks/usePWAInstallPrompt";
import { useMe, useUpdateProfile } from "@/features/auth/hooks";

const schema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").max(100, "Name must not exceed 100 characters"),
  avatarUrl: z
    .string()
    .trim()
    .max(500, "Profile picture URL is too long")
    .refine((value) => value === "" || z.string().url().safeParse(value).success, "Enter a valid image URL"),
});

type FormValues = z.infer<typeof schema>;

export default function ProfilePage() {
  const me = useMe();
  const updateProfile = useUpdateProfile();
  const { isInstallable, isInstalled, install } = usePWAInstallPrompt();
  const [saved, setSaved] = useState(false);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: me.data ? { name: me.data.name, avatarUrl: me.data.avatarUrl ?? "" } : undefined,
  });

  useEffect(() => {
    if (!saved) return;
    const timeout = window.setTimeout(() => setSaved(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [saved]);

  if (me.isLoading) return <PageContainer><LoadingState layout="page" /></PageContainer>;
  if (me.error) return <PageContainer><ErrorState message={(me.error as Error).message} onRetry={() => me.refetch()} /></PageContainer>;
  if (!me.data) return null;

  const avatarUrl = (watch("avatarUrl") ?? "").trim();

  const onSubmit = async (data: FormValues) => {
    const payload = {
      name: data.name,
      avatarUrl: data.avatarUrl.trim() ? data.avatarUrl.trim() : null,
    };
    const user = await updateProfile.mutateAsync(payload);
    reset({ name: user.name, avatarUrl: user.avatarUrl ?? "" });
    setSaved(true);
  };

  return (
    <PageContainer form>
      <PageHeader title="Profile" subtitle="Update your account details and profile picture." />

      <Card>
        <CardBody>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar name={me.data.name} src={avatarUrl || undefined} className="h-20 w-20 text-large" />
            <div className="min-w-0 space-y-1">
              <Text className="font-semibold">{me.data.name}</Text>
              <Text size="sm" muted className="break-all">{me.data.email}</Text>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack className="mt-6">
              {updateProfile.error ? (
                <Alert tone="danger" title="Profile update failed">
                  {(updateProfile.error as Error).message}
                </Alert>
              ) : null}
              {saved ? <Alert tone="success" title="Profile saved">Your profile has been updated.</Alert> : null}

              <Input
                id="profile-name"
                label="Full name"
                type="text"
                autoComplete="name"
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
                {...register("name")}
              />

              <Input
                id="profile-avatar"
                label="Profile picture URL"
                type="url"
                autoComplete="url"
                placeholder="https://example.com/photo.jpg"
                helper="Paste a direct image URL. Leave it empty to use initials."
                startContent={<Camera size={18} aria-hidden="true" />}
                endContent={
                  avatarUrl ? (
                    <Button
                      aria-label="Remove profile picture"
                      variant="ghost"
                      size="sm"
                      isIconOnly
                      onPress={() => setValue("avatarUrl", "", { shouldDirty: true, shouldValidate: true })}
                    >
                      <X size={16} />
                    </Button>
                  ) : null
                }
                isInvalid={!!errors.avatarUrl}
                errorMessage={errors.avatarUrl?.message}
                {...register("avatarUrl")}
              />

              <Input id="profile-email" label="Email" value={me.data.email} isReadOnly />

              <Button type="submit" color="primary" isDisabled={!isDirty} isLoading={isSubmitting || updateProfile.isPending}>
                Save profile
              </Button>
            </Stack>
          </form>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardBody>
          <div className="space-y-4">
            <div>
              <Text className="font-semibold text-base">Appearance & Effects</Text>
              <Text size="sm" muted>Customize color mode and tactile neumorphic shadow intensity.</Text>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-border-soft">
              <div>
                <Text className="font-medium">Theme Mode</Text>
                <Text size="sm" muted>Toggle between light and dark palette</Text>
              </div>
              <ThemeToggle />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-border-soft">
              <div>
                <Text className="font-medium">Neumorphic Effects</Text>
                <Text size="sm" muted>Toggle between Soft tactile shadows and Flat accessible mode</Text>
              </div>
              <EffectsToggle />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-border-soft">
              <div>
                <Text className="font-medium">Progressive Web App</Text>
                <Text size="sm" muted>
                  {isInstalled
                    ? "Installed as a standalone application on this device"
                    : isInstallable
                    ? "Install for instant access and offline functionality"
                    : "Installable via your browser's 'Add to Home Screen' menu"}
                </Text>
              </div>
              {isInstallable ? (
                <Button size="sm" variant="secondary" onPress={install}>
                  Install app
                </Button>
              ) : isInstalled ? (
                <span className="text-xs text-success font-semibold">
                  Installed
                </span>
              ) : null}
            </div>
          </div>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
