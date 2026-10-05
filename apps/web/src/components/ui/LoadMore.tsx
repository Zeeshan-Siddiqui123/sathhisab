import { Button, type ButtonProps } from "./Button";
import { uiStrings } from "@/lib/uiStrings";
/** Append the next page; hide once the data source has no next page. */
export function LoadMore({ hasMore = true, ...props }: ButtonProps & { hasMore?: boolean }) { return hasMore ? <Button variant="secondary" {...props}>{props.children ?? uiStrings.loadMore}</Button> : null; }
