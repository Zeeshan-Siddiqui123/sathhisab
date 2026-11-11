import { Dropdown } from "@/components/ui/Dropdown";
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
    <Dropdown
      label={uiStrings.userMenu}
      className={className}
      actions={[
        { key: "profile", label: uiStrings.profile, onAction: onProfile },
        {
          key: "logout",
          label: uiStrings.logout,
          danger: true,
          onAction: onLogout,
        },
      ]}
      trigger={
        <button
          type="button"
          aria-label={uiStrings.userMenu}
          className="inline-flex cursor-pointer touch-manipulation items-center gap-2 rounded-xl p-1 text-[#0F0F10] transition-colors hover:bg-[#F4F5F7] focus-visible:outline-2 focus-visible:outline-[#0F0F10] md:px-3 md:py-2"
        >
          <Avatar name={user.name} src={user.avatarUrl ?? undefined} size="sm" />
          <span className="hidden text-sm font-medium md:inline">{user.name}</span>
        </button>
      }
    />
  );
}
