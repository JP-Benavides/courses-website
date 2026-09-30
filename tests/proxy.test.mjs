import { afterEach, beforeEach, expect, mock, test } from "bun:test";
import { NextRequest } from "next/server";

let refreshSession = false;

mock.module("@supabase/ssr", () => ({
  createServerClient: (_url, _key, { cookies }) => ({
    auth: {
      getClaims: async () => {
        if (refreshSession) {
          cookies.setAll([{ name: "session", value: "refreshed", options: { path: "/" } }], {});
        }
        return { data: { claims: null }, error: null };
      },
    },
  }),
}));

const { proxy } = await import("../proxy.ts");
const originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://supabase.example";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-key";
  refreshSession = false;
});

afterEach(() => {
  if (originalSupabaseUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = originalSupabaseUrl;
  if (originalSupabaseKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = originalSupabaseKey;
});

const request = (path) => new NextRequest(`http://localhost:3000${path}`);

test("sets anti-framing headers only on the OAuth consent route", async () => {
  const consent = await proxy(request("/oauth/consent?authorization_id=request-123"));
  expect(consent.headers.get("Content-Security-Policy")).toBe("frame-ancestors 'none'");
  expect(consent.headers.get("X-Frame-Options")).toBe("DENY");

  const home = await proxy(request("/"));
  expect(home.headers.get("Content-Security-Policy")).toBeNull();
  expect(home.headers.get("X-Frame-Options")).toBeNull();
});

test("preserves anti-framing headers when Supabase refresh rebuilds the response", async () => {
  refreshSession = true;

  const response = await proxy(request("/oauth/consent"));

  expect(response.headers.get("Content-Security-Policy")).toBe("frame-ancestors 'none'");
  expect(response.headers.get("X-Frame-Options")).toBe("DENY");
  expect(response.cookies.get("session").value).toBe("refreshed");
});
