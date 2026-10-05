import { CategoryIcon } from "./CategoryIcon";
import { Chip } from "@/components/ui/Chip";
import { CATEGORY_LABELS, type Category } from "@/lib/constants";
/** Category name and matching icon. */
export function CategoryBadge({ category, className }: { category: Category; className?: string }) { return <Chip className={className} startContent={<CategoryIcon category={category} />}>{CATEGORY_LABELS[category]}</Chip>; }
