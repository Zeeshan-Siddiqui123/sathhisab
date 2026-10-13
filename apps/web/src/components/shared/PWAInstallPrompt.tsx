import { useState } from "react";
import { Download, X } from "lucide-react";
import { usePWAInstallPrompt } from "@/hooks/usePWAInstallPrompt";
import { Surface } from "@/components/ui/Surface";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

export function PWAInstallPrompt({ className }: { className?: string }) {
  const { isInstallable, isInstalled, install } = usePWAInstallPrompt();
  const [dismissed, setDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  if (isInstalled || !isInstallable || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <Surface
      variant="raised"
      level="sm"
      radius="card"
      className={`p-4 flex items-center justify-between gap-4 border border-border-soft ${className ?? ""}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 shrink-0 rounded-full bg-primary-soft text-primary flex items-center justify-center">
          <Download size={20} />
        </div>
        <div className="min-w-0">
          <Text className="font-semibold text-sm">Install SaathHisab App</Text>
          <Text size="sm" muted className="truncate">
            Add to home screen for instant access and offline view.
          </Text>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          variant="primary"
          isLoading={isInstalling}
          onPress={handleInstall}
        >
          Install
        </Button>
        <Button
          size="sm"
          variant="ghost"
          aria-label="Dismiss installation prompt"
          isIconOnly
          onPress={() => setDismissed(true)}
        >
          <X size={16} />
        </Button>
      </div>
    </Surface>
  );
}
