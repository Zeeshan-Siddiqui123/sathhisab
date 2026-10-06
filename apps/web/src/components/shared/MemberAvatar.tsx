import type { Member } from "@/types/ui";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import { uiStrings } from "@/lib/uiStrings";
/** Member identity with optional role. */
export function MemberAvatar({
  member,
  showRole = false,
  className,
}: {
  member: Member;
  showRole?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 min-w-0", className)}>
      <Avatar name={member.name} src={member.avatarUrl ?? undefined} size="sm" />
      <span className="truncate">{member.name}</span>
      {showRole && member.role ? (
        <Chip size="sm">
          {member.role === "OWNER" ? uiStrings.owner : uiStrings.member}
        </Chip>
      ) : null}
    </div>
  );
}
