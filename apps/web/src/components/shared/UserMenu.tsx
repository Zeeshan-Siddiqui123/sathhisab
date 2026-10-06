import { Dropdown } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import type { Member } from "@/types/ui";
import { uiStrings } from "@/lib/uiStrings";
/** Feature-owned callbacks provide profile navigation and sign-out. */
export function UserMenu({ user, onProfile, onLogout, className }: { user: Member; onProfile: () => void; onLogout: () => void; className?: string }) {
 return <Dropdown className={className} label={uiStrings.userMenu} trigger={<Button variant="ghost" aria-label={uiStrings.userMenu} leftIcon={<Avatar name={user.name} src={user.avatarUrl ?? undefined} size="sm" />}>{user.name}</Button>} actions={[{ key: "profile", label: uiStrings.profile, onAction: onProfile }, { key: "logout", label: uiStrings.logout, onAction: onLogout }]} />;
}
