import { test, expect } from "@playwright/test";

test.describe("Health API", () => {
  test("GET /api/v1/health returns ok status", async ({ request }) => {
    const res = await request.get("/api/v1/health");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body).toHaveProperty("environment");
    expect(body).toHaveProperty("timestamp");
  });
});
