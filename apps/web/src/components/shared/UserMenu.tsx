import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Avatar } from "@/components/ui/Avatar";
import type { Member } from "@/types/ui";
import { uiStrings } from "@/lib/uiStrings";

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

  return (
    <Dropdown placement="bottom-end" className={className}>
      <DropdownTrigger>
        <button
          type="button"
          aria-label={uiStrings.userMenu}
          className="inline-flex items-center gap-2 p-1 md:px-3 md:py-2 rounded-xl text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-visible:outline-2 focus-visible:outline-primary touch-manipulation cursor-pointer"
        >
          <Avatar
            name={user.name}
            src={user.avatarUrl ?? undefined}
            size="sm"
          />
          <span className="hidden md:inline text-sm font-medium">{user.name}</span>
        </button>
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
