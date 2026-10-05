import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { uiStrings } from "@/lib/uiStrings";
/** Recoverable load error. */
export function ErrorState({ message, onRetry, className }: { message: string; onRetry: () => void; className?: string }) {
 return <Alert tone="danger" title={message} className={className}><Button variant="ghost" onPress={onRetry}>{uiStrings.retry}</Button></Alert>;
}
