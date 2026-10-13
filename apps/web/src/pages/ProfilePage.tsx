import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Trash2, Upload } from "lucide-react";
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
import { useMe, useUpdateProfile, useUploadAvatar } from "@/features/auth/hooks";

const schema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").max(100, "Name must not exceed 100 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function ProfilePage() {
  const me = useMe();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const { isInstallable, isInstalled, install } = usePWAInstallPrompt();
  const [saved, setSaved] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: me.data ? { name: me.data.name } : undefined,
  });

  useEffect(() => {
    if (!saved) return;
    const timeout = window.setTimeout(() => setSaved(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [saved]);

  if (me.isLoading) return <PageContainer><LoadingState layout="page" /></PageContainer>;
  if (me.error) return <PageContainer><ErrorState message={(me.error as Error).message} onRetry={() => me.refetch()} /></PageContainer>;
  if (!me.data) return null;

  const currentAvatarUrl = me.data.avatarUrl ?? null;

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so same file can be re-selected if desired
    e.target.value = "";

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setUploadError("Please select a valid image (JPEG, PNG, WebP, or GIF).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5 MB.");
      return;
    }

    setUploadError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        await uploadAvatar.mutateAsync(base64Data);
        setSaved(true);
      } catch (err) {
        setUploadError((err as Error).message || "Failed to upload photo");
      }
    };
    reader.onerror = () => {
      setUploadError("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    try {
      setUploadError(null);
      await updateProfile.mutateAsync({ avatarUrl: null });
      setSaved(true);
    } catch (err) {
      setUploadError((err as Error).message || "Failed to remove photo");
    }
  };

  const onSubmit = async (data: FormValues) => {
    const user = await updateProfile.mutateAsync({ name: data.name });
    reset({ name: user.name });
    setSaved(true);
  };

  return (
    <PageContainer form>
      <PageHeader title="Profile" subtitle="Update your account details and profile picture." />

      <Card>
        <CardBody>
          {/* Avatar & Photo Upload Controls */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-border-soft">
            <div className="relative group shrink-0">
              <Avatar
                name={me.data.name}
                src={currentAvatarUrl || undefined}
                className="h-24 w-24 text-2xl shadow-[var(--nm-raised-sm)]"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadAvatar.isPending}
                aria-label="Upload photo"
                className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer backdrop-blur-xs disabled:pointer-events-none"
              >
                <Camera size={22} />
                <span className="text-[10px] font-medium mt-1">Change</span>
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div>
                <Text className="font-semibold text-lg">{me.data.name}</Text>
                <Text size="sm" muted className="break-all">{me.data.email}</Text>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Upload size={15} />}
                  isLoading={uploadAvatar.isPending}
                  onPress={() => fileInputRef.current?.click()}
                >
                  Upload photo
                </Button>

                {currentAvatarUrl ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-danger hover:bg-danger/10"
                    leftIcon={<Trash2 size={15} />}
                    isLoading={updateProfile.isPending}
                    onPress={handleRemoveAvatar}
                  >
                    Remove photo
                  </Button>
                ) : null}
              </div>
              <Text size="sm" muted className="text-xs">
                JPG, PNG, GIF or WebP up to 5 MB.
              </Text>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack className="mt-6">
              {uploadError ? (
                <Alert tone="danger" title="Photo upload error">
                  {uploadError}
                </Alert>
              ) : null}
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
