import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import type { Member } from "@/types/ui";
import { uiStrings } from "@/lib/uiStrings";

/** Derive initials from a name, e.g. "Zeeshan Ahmed" → "ZA". */
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** Feature-owned callbacks provide profile navigation and sign-out. */
export function UserMenu({
  user,
  onProfile,
  onLogout,
  className,
}: {
  user: Member;
  onProfile: () => void;
  onLogout: () => void;
  className?: string;
}) {
  const initials = getInitials(user.name);

  return (
    <Dropdown className={className}>
      <DropdownTrigger>
        <Button
          variant="ghost"
          aria-label={uiStrings.userMenu}
          leftIcon={
            <Avatar
              name={user.name}
              src={user.avatarUrl ?? undefined}
              size="sm"
            />
          }
        >
          {/* Full name on desktop, initials on mobile */}
          <span className="hidden md:inline">{user.name}</span>
          <span className="md:hidden font-semibold">{initials}</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={uiStrings.userMenu}
        onAction={(key) => {
          if (key === "profile") onProfile();
          if (key === "logout") onLogout();
        }}
        className="bg-nm-bg border border-border-soft rounded-xl shadow-[var(--nm-raised-md)]"
      >
        <DropdownItem key="profile">{uiStrings.profile}</DropdownItem>
        <DropdownItem key="logout" color="danger">
          {uiStrings.logout}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
