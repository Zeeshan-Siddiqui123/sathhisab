import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

export interface GroupMember {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string | null;
  role: "OWNER" | "MEMBER";
  joinedAt?: string;
  balance?: number;
}

export interface Group {
  id: string;
  name: string;
  type: string;
  currency: string;
  createdBy: string;
  createdAt: string;
  myRole: "OWNER" | "MEMBER";
  myBalance: number;
  memberCount?: number;
  members: GroupMember[];
}

export interface Invitation {
  id: string;
  expiresAt: string;
  createdAt: string;
  creator: { id: string; name: string };
}

// ─── Groups ────────────────────────────────────────────────
export function useGroups() {
  return useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: async () => (await api.get<{ groups: Group[] }>("/groups")).groups,
    staleTime: 30_000,
  });
}

export function useGroup(groupId: string) {
  return useQuery<Group>({
    queryKey: ["groups", groupId],
    queryFn: async () => (await api.get<{ group: Group }>(`/groups/${groupId}`)).group,
    enabled: !!groupId,
  });
}

export function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; type: string }) =>
      (await api.post<{ group: Group }>("/groups", data)).group,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["groups"] }),
  });
}

export function useUpdateGroup(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name?: string; type?: string }) =>
      (await api.patch<{ group: Group }>(`/groups/${groupId}`, data)).group,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
      qc.invalidateQueries({ queryKey: ["groups", groupId] });
    },
  });
}

export function useRemoveMember(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      api.delete(`/groups/${groupId}/members/${userId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["groups", groupId] }),
  });
}

export function useLeaveGroup(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post(`/groups/${groupId}/leave`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["groups"] }),
  });
}

// ─── Invitations ───────────────────────────────────────────
export function useGroupInvitations(groupId: string) {
  return useQuery<Invitation[]>({
    queryKey: ["groups", groupId, "invitations"],
    queryFn: async () => (await api.get<{ invitations: Invitation[] }>(`/groups/${groupId}/invitations`)).invitations,
    enabled: !!groupId,
  });
}

export function useCreateInvitation(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      (await api.post<{ invitation: { token: string; expiresAt: string } }>(`/groups/${groupId}/invitations`)).invitation,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["groups", groupId, "invitations"] }),
  });
}

export function useRevokeInvitation(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) =>
      api.delete(`/groups/${groupId}/invitations/${invitationId}`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["groups", groupId, "invitations"] }),
  });
}

export interface InvitePreview {
  group: { id: string; name: string; type: string };
  inviter: { id: string; name: string };
  expiresAt: string;
}

export function useInvitePreview(token: string) {
  return useQuery<InvitePreview>({
    queryKey: ["invite-preview", token],
    queryFn: () => api.get<InvitePreview>(`/invitations/${token}`),
    enabled: !!token,
    retry: false,
  });
}

export function useAcceptInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (token: string) =>
      api.post<{ group: Group }>(`/invitations/${token}/accept`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["groups"] }),
  });
}
