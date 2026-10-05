import { test, expect } from "@playwright/test";

test.describe("Auth & User API", () => {
  const timestamp = Date.now();
  const testUser = {
    name: "Zeeshan Siddiq",
    email: `zeeshan_${timestamp}@example.com`,
    password: "Password123!",
  };

  test("Signup, login, me, profile update, and logout flow", async ({ playwright }) => {
    const api = await playwright.request.newContext({
      baseURL: "http://localhost:5000",
    });

    // 1. Signup
    const signupRes = await api.post("/api/v1/auth/signup", {
      data: testUser,
    });
    expect(signupRes.status()).toBe(201);
    const signupBody = await signupRes.json();
    expect(signupBody.user.email).toBe(testUser.email.toLowerCase());
    expect(signupBody.user.name).toBe(testUser.name);
    expect(signupBody.user.id).toBeDefined();

    // 2. Duplicate signup fails with 409 Conflict
    const dupRes = await api.post("/api/v1/auth/signup", {
      data: testUser,
    });
    expect(dupRes.status()).toBe(409);

    // 3. /auth/me returns the signed-in user
    const meRes = await api.get("/api/v1/auth/me");
    expect(meRes.status()).toBe(200);
    const meBody = await meRes.json();
    expect(meBody.user.id).toBe(signupBody.user.id);

    // 4. Update profile
    const updateRes = await api.patch("/api/v1/users/me", {
      data: { name: "Zeeshan Ahmed" },
    });
    expect(updateRes.status()).toBe(200);
    const updateBody = await updateRes.json();
    expect(updateBody.user.name).toBe("Zeeshan Ahmed");

    // 5. Logout
    const logoutRes = await api.post("/api/v1/auth/logout");
    expect(logoutRes.status()).toBe(200);

    // 6. Accessing /auth/me after logout fails with 401
    const meAfterLogoutRes = await api.get("/api/v1/auth/me");
    expect(meAfterLogoutRes.status()).toBe(401);

    // 7. Login with invalid password fails with 401
    const invalidLoginRes = await api.post("/api/v1/auth/login", {
      data: {
        email: testUser.email,
        password: "WrongPassword!",
      },
    });
    expect(invalidLoginRes.status()).toBe(401);

    // 8. Login with correct password succeeds
    const loginRes = await api.post("/api/v1/auth/login", {
      data: {
        email: testUser.email,
        password: testUser.password,
      },
    });
    expect(loginRes.status()).toBe(200);
    const loginBody = await loginRes.json();
    expect(loginBody.user.email).toBe(testUser.email.toLowerCase());
  });
});
