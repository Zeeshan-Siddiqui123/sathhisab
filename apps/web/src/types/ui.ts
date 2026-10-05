import type { ReactNode } from "react";
export interface Option { value: string; label: string; disabled?: boolean }
export interface Member { id: string; name: string; avatarUrl?: string; role?: "OWNER" | "MEMBER" }
export interface GroupOption { id: string; name: string }
export interface NavItem { label: string; href: string; icon: ReactNode }
export type SettlementStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
export type Loadable<T> = { status: "loading" } | { status: "error"; message: string; retry: () => void } | { status: "ready"; data: T };
