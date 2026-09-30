import type { SupabaseClient } from "@supabase/supabase-js";

export function authorizationPath(authorizationId: string) {
  return `/oauth/consent?${new URLSearchParams({ authorization_id: authorizationId })}`;
}

// Only resume our consent route; never accept arbitrary post-login destinations.
export function safeAuthReturnPath(value: string | null | undefined): string {
  if (!value?.startsWith("/oauth/consent?")) return "/";
  const url = new URL(value, "https://coursebook.invalid");
  const id = url.searchParams.get("authorization_id");
  return url.pathname === "/oauth/consent" && id ? authorizationPath(id) : "/";
}

export async function requireAccount(supabase: SupabaseClient, expectedUserId?: string) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || user.is_anonymous) {
    throw new Error("Sign in or create an account to connect your assistant.");
  }
  if (expectedUserId && user.id !== expectedUserId) {
    throw new Error("Your account changed. Reload this page before continuing.");
  }
  return user;
}

export async function getAccountGrants(supabase: SupabaseClient) {
  const user = await requireAccount(supabase);
  const { data, error } = await supabase.auth.oauth.listGrants();
  if (error) throw error;
  await requireAccount(supabase, user.id);
  return { user, grants: data ?? [] };
}

// Only use redirect URLs returned by Supabase, never a query-string redirect URI.
export function oauthRedirectUrl(value: string): string {
  const url = new URL(value);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.username || url.password || (url.protocol !== "https:" && !(local && url.protocol === "http:"))) {
    throw new Error("The authorization server returned an invalid redirect. Restart the connection in your assistant.");
  }
  return url.href;
}
