import { test, expect } from "@playwright/test";

test.describe("Invitations API", () => {
  const ts = Date.now();
  const userA = { name: "Host Alpha", email: `host_${ts}@example.com`, password: "Password123!" };
  const userB = { name: "Guest Beta", email: `guest_${ts}@example.com`, password: "Password123!" };

  test("Invite creation, preview, acceptance, and revocation flow", async ({ playwright }) => {
    // 1. Setup User A & User B
    const apiA = await playwright.request.newContext({ baseURL: "http://localhost:5000" });
    const apiB = await playwright.request.newContext({ baseURL: "http://localhost:5000" });
    const anonApi = await playwright.request.newContext({ baseURL: "http://localhost:5000" });

    await apiA.post("/api/v1/auth/signup", { data: userA });
    await apiB.post("/api/v1/auth/signup", { data: userB });

    // 2. User A creates group
    const groupRes = await apiA.post("/api/v1/groups", {
      data: { name: "Hostel Room 12", type: "HOSTEL" },
    });
    const { group } = await groupRes.json();

    // 3. User A generates an invitation link
    const inviteRes = await apiA.post(`/api/v1/groups/${group.id}/invitations`, {
      data: { expiresInDays: 7 },
    });
    expect(inviteRes.status()).toBe(201);
    const { invitation } = await inviteRes.json();
    expect(invitation.token).toBeDefined();

    // 4. Anonymous user previews invitation
    const previewRes = await anonApi.get(`/api/v1/invitations/${invitation.token}`);
    expect(previewRes.status()).toBe(200);
    const previewBody = await previewRes.json();
    expect(previewBody.group.name).toBe("Hostel Room 12");
    expect(previewBody.inviter.name).toBe(userA.name);

    // 5. User B accepts the invitation
    const acceptRes = await apiB.post(`/api/v1/invitations/${invitation.token}/accept`);
    expect(acceptRes.status()).toBe(200);
    const acceptBody = await acceptRes.json();
    expect(acceptBody.group.id).toBe(group.id);

    // 6. User B can now access group details
    const groupAccessRes = await apiB.get(`/api/v1/groups/${group.id}`);
    expect(groupAccessRes.status()).toBe(200);
    const groupData = await groupAccessRes.json();
    expect(groupData.group.members.length).toBe(2);

    // 7. User A creates second invitation and revokes it
    const secondInviteRes = await apiA.post(`/api/v1/groups/${group.id}/invitations`, {
      data: { expiresInDays: 1 },
    });
    const { invitation: invite2 } = await secondInviteRes.json();

    const revokeRes = await apiA.delete(`/api/v1/groups/${group.id}/invitations/${invite2.id}`);
    expect(revokeRes.status()).toBe(200);

    // 8. Revoked invite cannot be previewed
    const revokedPreviewRes = await anonApi.get(`/api/v1/invitations/${invite2.token}`);
    expect(revokedPreviewRes.status()).toBe(404);
  });
});
