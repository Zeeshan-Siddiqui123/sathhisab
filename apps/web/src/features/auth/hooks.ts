import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "../../lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: string;
}

interface LoginPayload { email: string; password: string; }
interface SignupPayload { name: string; email: string; password: string; }

export function useMe() {
  return useQuery<User | null>({
    queryKey: ["me"],
    queryFn: async () => {
      try { return (await api.get<{ user: User }>("/auth/me")).user; }
      catch (error) {
        if (error instanceof ApiError && error.statusCode === 401) return null;
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginPayload) =>
      api.post<{ user: User }>("/auth/login", data),
    onSuccess: (data) => {
      qc.setQueryData(["me"], data.user);
    },
  });
}

export function useSignup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SignupPayload) =>
      api.post<{ user: User }>("/auth/signup", data),
    onSuccess: (data) => {
      qc.setQueryData(["me"], data.user);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      qc.clear();
      window.location.href = "/login";
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string }) =>
      api.patch<User>("/users/me", data),
    onSuccess: (user) => {
      qc.setQueryData(["me"], user);
    },
  });
}
