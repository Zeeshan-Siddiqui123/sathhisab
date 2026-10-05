import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export interface ExpenseShare {
  id: string;
  userId: string;
  shareAmount: number;
  user?: { id: string; name: string; avatarUrl?: string | null };
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  paidBy: string;
  payer?: { id: string; name: string; avatarUrl?: string | null };
  category: string;
  splitMethod: "EQUAL" | "CUSTOM";
  expenseDate: string;
  note?: string | null;
  receiptUrl?: string | null;
  createdBy: string;
  creator?: { id: string; name: string };
  createdAt: string;
  shares: ExpenseShare[];
}

export interface ExpensesPage {
  data: Expense[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

interface ExpenseFilters {
  search?: string;
  category?: string;
  paidBy?: string;
  from?: string;
  to?: string;
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") q.set(k, String(v));
  }
  return q.toString() ? `?${q.toString()}` : "";
}

export function useExpenses(groupId: string, filters: ExpenseFilters = {}) {
  return useInfiniteQuery<ExpensesPage>({
    queryKey: ["expenses", groupId, filters],
    queryFn: ({ pageParam = 1 }) => {
      const qs = buildQuery({ page: pageParam as number, limit: 20, ...filters });
      return api.get<ExpensesPage>(`/groups/${groupId}/expenses${qs}`);
    },
    getNextPageParam: (last) =>
      last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
    initialPageParam: 1,
    enabled: !!groupId,
  });
}

export function useExpense(groupId: string, expenseId: string) {
  return useQuery<Expense>({
    queryKey: ["expenses", groupId, expenseId],
    queryFn: () => api.get<Expense>(`/groups/${groupId}/expenses/${expenseId}`),
    enabled: !!groupId && !!expenseId,
  });
}

export interface CreateExpensePayload {
  title: string;
  amount: number;
  paidBy: string;
  category: string;
  splitMethod: "EQUAL" | "CUSTOM";
  expenseDate: string;
  participants: string[];
  shares?: { userId: string; amount: number }[];
  note?: string;
}

export function useCreateExpense(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExpensePayload) => {
      const key = crypto.randomUUID();
      return api.post<Expense>(`/groups/${groupId}/expenses`, data, {
        idempotencyKey: key,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
      qc.invalidateQueries({ queryKey: ["stats", groupId] });
      qc.invalidateQueries({ queryKey: ["activity", groupId] });
      qc.invalidateQueries({ queryKey: ["expenses", groupId] });
      qc.invalidateQueries({ queryKey: ["balances", groupId] });
    },
  });
}

export function useUpdateExpense(groupId: string, expenseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateExpensePayload>) =>
      api.patch<Expense>(`/groups/${groupId}/expenses/${expenseId}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
      qc.invalidateQueries({ queryKey: ["stats", groupId] });
      qc.invalidateQueries({ queryKey: ["activity", groupId] });
      qc.invalidateQueries({ queryKey: ["expenses", groupId] });
      qc.invalidateQueries({ queryKey: ["balances", groupId] });
    },
  });
}

export function useDeleteExpense(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (expenseId: string) =>
      api.delete(`/groups/${groupId}/expenses/${expenseId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
      qc.invalidateQueries({ queryKey: ["stats", groupId] });
      qc.invalidateQueries({ queryKey: ["activity", groupId] });
      qc.invalidateQueries({ queryKey: ["expenses", groupId] });
      qc.invalidateQueries({ queryKey: ["balances", groupId] });
    },
  });
}
