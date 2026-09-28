import { beforeEach, expect, mock, test } from "bun:test";
import { NextRequest } from "next/server";

let authResult, deletionError, deletedIds, signOutCalls, signOutThrows, adminCalls;
mock.module("server-only", () => ({}));
mock.module("@supabase/ssr", () => ({
  createServerClient: () => ({ auth: {
    getUser: async () => authResult,
    signOut: async () => { signOutCalls++; if (signOutThrows) throw new Error("deleted user"); return { error: null }; },
  } }),
}));
mock.module("@supabase/supabase-js", () => ({
  createClient: (_url, key, options) => {
    adminCalls++;
    expect(key).toBe("test-server-secret");
    expect(options.auth.persistSession).toBe(false);
    return { auth: { admin: { deleteUser: async (id) => {
      deletedIds.push(id);
      return { error: deletionError };
    } } } };
  },
}));
const { DELETE } = await import("../app/api/account/route.ts");
beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test-project.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-public-key";
  process.env.SUPABASE_SECRET_KEY = "test-server-secret";
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  authResult = { data: { user: { id: "verified-account" } }, error: null };
  deletionError = null;
  deletedIds = [];
  signOutCalls = 0;
  adminCalls = 0;
  signOutThrows = false;
});
function request(origin = "http://localhost:3000") {
  return new NextRequest("http://localhost:3000/api/account?userId=someone-else", {
    method: "DELETE",
    headers: {
      ...(origin === null ? {} : { origin }),
      cookie: "sb-test-project-auth-token.0=old-session; sb-test-project-auth-token.1=other-chunk; preference=keep",
    },
    body: JSON.stringify({ userId: "someone-else" }),
  });
}

test("deletes only the verified account and clears its chunked cookies", async () => {
  const response = await DELETE(request());
  expect(response.status).toBe(200);
  expect(deletedIds).toEqual(["verified-account"]);
  expect(signOutCalls).toBe(1);
  expect(response.cookies.get("sb-test-project-auth-token.0").maxAge).toBe(0);
  expect(response.cookies.get("sb-test-project-auth-token.1").maxAge).toBe(0);
  expect(response.cookies.has("preference")).toBe(false);
  expect(response.headers.get("Cache-Control")).toBe("no-store");
});

test("rejects missing and cross-site origins before authentication or admin calls", async () => {
  for (const origin of [null, "https://attacker.example", "null"]) {
    expect((await DELETE(request(origin))).status).toBe(403);
  }
  expect(adminCalls).toBe(0);
  expect(deletedIds).toEqual([]);
});

test("rejects absent and invalid users before creating an admin client", async () => {
  for (const result of [
    { data: { user: null }, error: null },
    { data: { user: { id: "unverified" } }, error: new Error("invalid") },
  ]) {
    authResult = result;
    expect((await DELETE(request())).status).toBe(401);
  }
  expect(adminCalls).toBe(0);
});

test("missing privileged config fails safely without deleting or signing out", async () => {
  delete process.env.SUPABASE_SECRET_KEY;
  const response = await DELETE(request());
  expect(response.status).toBe(503);
  expect(adminCalls).toBe(0);
  expect(signOutCalls).toBe(0);
  expect(response.cookies.getAll()).toEqual([]);
});

test("provider deletion errors preserve the session and do not expose internals", async () => {
  deletionError = new Error("private-provider-detail");
  const response = await DELETE(request());
  expect(response.status).toBe(500);
  expect(await response.text()).not.toContain("private-provider-detail");
  expect(signOutCalls).toBe(0);
  expect(response.cookies.getAll()).toEqual([]);
});

test("a deleted user's sign-out failure still clears cookies and reports success", async () => {
  signOutThrows = true;
  const response = await DELETE(request());
  expect(response.status).toBe(200);
  expect(response.cookies.get("sb-test-project-auth-token.0").maxAge).toBe(0);
});
