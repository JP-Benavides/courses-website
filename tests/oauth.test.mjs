import { expect, test } from "bun:test";
import { authorizationPath, safeAuthReturnPath, requireAccount, getAccountGrants, oauthRedirectUrl } from "../lib/supabase/oauth.ts";

const client = (user, error = null) => ({ auth: { getUser: async () => ({ data: { user }, error }) } });

test("account requirement rejects missing, invalid and anonymous users", async () => {
  for (const auth of [client(null), client({ id: "u" }, new Error("expired")), client({ id: "u", is_anonymous: true })]) {
    await expect(requireAccount(auth)).rejects.toThrow("Sign in or create an account");
  }
});

test("consent requires the same verified user who saw the request", async () => {
  const user = { id: "user-a", is_anonymous: false };
  expect(await requireAccount(client(user), "user-a")).toEqual(user);
  await expect(requireAccount(client(user), "user-b")).rejects.toThrow("Your account changed");
});

test("grant listing rejects an account switch before showing another account's apps", async () => {
  const users = [{ id: "user-a", is_anonymous: false }, { id: "user-b", is_anonymous: false }];
  const supabase = { auth: {
    getUser: async () => ({ data: { user: users.shift() }, error: null }),
    oauth: { listGrants: async () => ({ data: [{ client: { id: "client-b" } }], error: null }) },
  } };
  await expect(getAccountGrants(supabase)).rejects.toThrow("Your account changed");
});

test("grant listing returns grants only for a stable signed-in account", async () => {
  const user = { id: "user-a", is_anonymous: false };
  const grants = [{ client: { id: "client-a" } }];
  const supabase = { auth: {
    getUser: async () => ({ data: { user }, error: null }),
    oauth: { listGrants: async () => ({ data: grants, error: null }) },
  } };
  expect(await getAccountGrants(supabase)).toEqual({ user, grants });
});

test("login return preserves only the consent authorization ID", () => {
  const path = authorizationPath("request&with=special+chars");
  expect(safeAuthReturnPath(path)).toBe(path);
  expect(safeAuthReturnPath("/oauth/consent?authorization_id=abc&next=https://evil.example#fragment"))
    .toBe("/oauth/consent?authorization_id=abc");
  for (const path of [undefined, "https://evil.example", "//evil.example", "/\\evil.example", "/oauth/consent", "/oauth/consent?authorization_id=", "/profile", "/oauth/consent/../other?authorization_id=a"]) {
    expect(safeAuthReturnPath(path)).toBe("/");
  }
});

test("provider redirects allow HTTPS and local development, reject script and insecure destinations", () => {
  expect(oauthRedirectUrl("https://chatgpt.com/callback?code=abc&state=xyz"))
    .toBe("https://chatgpt.com/callback?code=abc&state=xyz");
  expect(oauthRedirectUrl("http://localhost:3000/callback")).toBe("http://localhost:3000/callback");
  for (const url of ["javascript:alert(1)", "data:text/html,hi", "http://evil.example/callback", "https://user:pass@example.com", "/relative"]) {
    expect(() => oauthRedirectUrl(url)).toThrow();
  }
});
