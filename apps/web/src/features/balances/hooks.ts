import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

export interface BalanceMember {
  id: string;
  name: string;
  avatarUrl?: string | null;
  role: string;
  balance: number;
}

export interface SuggestedTransfer {
  from: { id: string; name: string; avatarUrl?: string | null };
  to: { id: string; name: string; avatarUrl?: string | null };
  amount: number;
}

export interface GroupBalances {
  myBalance: number;
  members: BalanceMember[];
  suggestions: SuggestedTransfer[];
}

export interface GroupStats {
  totalSpend: number;
  byCategory: { category: string; amount: number }[];
  byMonth: { month: string; amount: number }[];
}

export function useGroupBalances(groupId: string) {
  return useQuery<GroupBalances>({
    queryKey: ["balances", groupId],
    queryFn: () => api.get<GroupBalances>(`/groups/${groupId}/balances`),
    enabled: !!groupId,
  });
}

export function useGroupStats(groupId: string, from?: string, to?: string) {
  const qs = new URLSearchParams();
  if (from) qs.set("from", from);
  if (to) qs.set("to", to);
  const query = qs.toString() ? `?${qs.toString()}` : "";

  return useQuery<GroupStats>({
    queryKey: ["stats", groupId, from, to],
    queryFn: () => api.get<GroupStats>(`/groups/${groupId}/balances/stats${query}`),
    enabled: !!groupId,
  });
}

export interface Settlement {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  fromUser: { id: string; name: string; avatarUrl?: string | null };
  toUser: { id: string; name: string; avatarUrl?: string | null };
  amount: number;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
  note?: string | null;
  createdAt: string;
  respondedAt?: string | null;
}

export function useSettlements(groupId: string, status?: string) {
  const qs = status ? `?status=${status}` : "";
  return useQuery<Settlement[]>({
    queryKey: ["settlements", groupId, status],
    queryFn: () => api.get<Settlement[]>(`/groups/${groupId}/settlements${qs}`),
    enabled: !!groupId,
  });
}

export function useCreateSettlement(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { toUserId: string; amount: number; note?: string }) => {
      const key = crypto.randomUUID();
      return api.post<Settlement>(`/groups/${groupId}/settlements`, data, {
        idempotencyKey: key,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settlements", groupId] });
      qc.invalidateQueries({ queryKey: ["balances", groupId] });
    },
  });
}

export function useConfirmSettlement(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post<Settlement>(`/groups/${groupId}/settlements/${id}/confirm`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settlements", groupId] });
      qc.invalidateQueries({ queryKey: ["balances", groupId] });
    },
  });
}

export function useRejectSettlement(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post<Settlement>(`/groups/${groupId}/settlements/${id}/reject`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settlements", groupId] });
    },
  });
}

export function useCancelSettlement(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post<Settlement>(`/groups/${groupId}/settlements/${id}/cancel`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settlements", groupId] });
    },
  });
}
