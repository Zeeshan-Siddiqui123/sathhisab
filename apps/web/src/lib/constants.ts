export const CATEGORIES = [
  "GROCERY",
  "RENT",
  "UTILITIES",
  "INTERNET",
  "FOOD",
  "TRANSPORT",
  "HOUSEHOLD",
  "ENTERTAINMENT",
  "OTHER",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<Category, string> = {
  GROCERY: "#16A34A",
  RENT: "#4F46E5",
  UTILITIES: "#F59E0B",
  INTERNET: "#0EA5E9",
  FOOD: "#EF4444",
  TRANSPORT: "#8B5CF6",
  HOUSEHOLD: "#14B8A6",
  ENTERTAINMENT: "#EC4899",
  OTHER: "#64748B",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  GROCERY: "Grocery",
  RENT: "Rent",
  UTILITIES: "Utilities",
  INTERNET: "Internet",
  FOOD: "Food & Dining",
  TRANSPORT: "Transport",
  HOUSEHOLD: "Household",
  ENTERTAINMENT: "Entertainment",
  OTHER: "Other",
};

export const GROUP_TYPES = ["FLAT", "HOSTEL", "FAMILY", "TRIP", "OTHER"] as const;
export type GroupType = (typeof GROUP_TYPES)[number];

export const GROUP_TYPE_LABELS: Record<GroupType, string> = {
  FLAT: "Flat / Apartment",
  HOSTEL: "Hostel / Room",
  FAMILY: "Family",
  TRIP: "Trip / Vacation",
  OTHER: "Other",
};
