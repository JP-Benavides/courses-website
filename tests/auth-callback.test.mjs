import { afterEach, expect, mock, test } from "bun:test";
import { NextRequest } from "next/server";

let exchange;
mock.module("@supabase/ssr", () => ({
  createServerClient: (_url, _key, options) => ({
    auth: { exchangeCodeForSession: (code) => exchange(code, options.cookies) },
  }),
}));
const { GET } = await import("../app/auth/callback/route.ts");
afterEach(() => { exchange = undefined; });

const request = (query = "") => new NextRequest(`http://localhost:3000/auth/callback${query}`);

test("successful callback exchanges the code and preserves session cookies on the redirect", async () => {
  exchange = async (code, cookies) => {
    expect(code).toBe("valid-code");
    cookies.setAll([{ name: "session", value: "test-session", options: { path: "/", httpOnly: true } }], { "Cache-Control": "private, no-store" });
    return { error: null };
  };
  const response = await GET(request("?code=valid-code&next=https://untrusted.example"));
  expect(response.status).toBe(307);
  expect(response.headers.get("Location")).toBe("http://localhost:3000/");
  expect(response.cookies.get("session").value).toBe("test-session");
  expect(response.cookies.get("session").httpOnly).toBe(true);
  expect(response.headers.get("Cache-Control")).toBe("private, no-store");
});

test("missing codes and provider errors return a recoverable error without leaking provider text", async () => {
  const response = await GET(request("?error_description=private-provider-detail"));
  expect(response.headers.get("Location")).toBe("http://localhost:3000/?authError=callback");
  expect(response.headers.get("Cache-Control")).toBe("no-store");
});

test("rejected codes do not report a successful login", async () => {
  exchange = async () => ({ error: new Error("expired") });
  const response = await GET(request("?code=expired"));
  expect(response.headers.get("Location")).toContain("authError=callback");
});

test("network failures return the same recoverable error", async () => {
  exchange = async () => { throw new Error("offline"); };
  const response = await GET(request("?code=valid-code"));
  expect(response.headers.get("Location")).toContain("authError=callback");
});
