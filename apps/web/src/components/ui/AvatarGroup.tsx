import { AvatarGroup as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { getProxiedImageUrl } from "@/lib/image";

/** Themed AvatarGroup; accepts the underlying accessible control's props. */
export function AvatarGroup({ className, ...props }: ComponentProps<typeof Base>) {
  // If users array is passed, ensure all avatar srcs are proxied
  const proxiedUsers = (props as { users?: Array<{ name?: string; src?: string }> }).users?.map((u) => ({
    ...u,
    src: getProxiedImageUrl(u.src),
  }));

  return <Base {...props} {...(proxiedUsers ? { users: proxiedUsers } : {})} className={cn("", className)} />;
}
