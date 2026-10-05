import { ShoppingBasket, House, Zap, Wifi, Utensils, Bus, Armchair, Clapperboard, Shapes } from "lucide-react";
import { CATEGORY_COLORS, type Category } from "@/lib/constants";
import { cn } from "@/lib/cn";
const icons = { GROCERY: ShoppingBasket, RENT: House, UTILITIES: Zap, INTERNET: Wifi, FOOD: Utensils, TRANSPORT: Bus, HOUSEHOLD: Armchair, ENTERTAINMENT: Clapperboard, OTHER: Shapes };
/** Category palette is centralized; surrounding text supplies the name. */
export function CategoryIcon({ category, className }: { category: Category; className?: string }) { const Icon = icons[category]; return <Icon size={20} aria-hidden="true" style={{ color: CATEGORY_COLORS[category] }} className={cn("shrink-0", className)} />; }
