import { test, expect } from "@playwright/test";

test.describe("Groups API & Authorization Isolation", () => {
  const ts = Date.now();
  const userA = { name: "User Alpha", email: `alpha_${ts}@example.com`, password: "Password123!" };
  const userB = { name: "User Beta", email: `beta_${ts}@example.com`, password: "Password123!" };

  test("Group lifecycle and membership permissions", async ({ playwright }) => {
    // 1. Setup User A
    const apiA = await playwright.request.newContext({ baseURL: process.env.API_BASE_URL || "http://localhost:5000" });
    const signupARes = await apiA.post("/api/v1/auth/signup", { data: userA });
    expect(signupARes.status()).toBe(201);
    const { user: userAData } = await signupARes.json();

    // 2. Setup User B
    const apiB = await playwright.request.newContext({ baseURL: process.env.API_BASE_URL || "http://localhost:5000" });
    const signupBRes = await apiB.post("/api/v1/auth/signup", { data: userB });
    expect(signupBRes.status()).toBe(201);

    // 3. User A creates a group
    const createRes = await apiA.post("/api/v1/groups", {
      data: { name: "Flat 402", type: "FLAT" },
    });
    expect(createRes.status()).toBe(201);
    const { group } = await createRes.json();
    expect(group.name).toBe("Flat 402");
    expect(group.createdBy).toBe(userAData.id);

    // 4. User A lists groups
    const listRes = await apiA.get("/api/v1/groups");
    expect(listRes.status()).toBe(200);
    const { groups } = await listRes.json();
    expect(groups.length).toBeGreaterThanOrEqual(1);
    const found = groups.find((g) => g.id === group.id);
    expect(found).toBeDefined();
    expect(found.myRole).toBe("OWNER");
    expect(found.myBalance).toBe(0);

    // 5. User A gets group details
    const detailRes = await apiA.get(`/api/v1/groups/${group.id}`);
    expect(detailRes.status()).toBe(200);
    const detailBody = await detailRes.json();
    expect(detailBody.group.members.length).toBe(1);
    expect(detailBody.group.members[0].id).toBe(userAData.id);

    // 6. User B tries to access User A's group -> gets 403 Forbidden
    const unauthGroupRes = await apiB.get(`/api/v1/groups/${group.id}`);
    expect(unauthGroupRes.status()).toBe(403);

    // 7. User A updates group details
    const updateRes = await apiA.patch(`/api/v1/groups/${group.id}`, {
      data: { name: "Flat 402 Renovated", type: "OTHER" },
    });
    expect(updateRes.status()).toBe(200);
    const updateBody = await updateRes.json();
    expect(updateBody.group.name).toBe("Flat 402 Renovated");
  });
});
