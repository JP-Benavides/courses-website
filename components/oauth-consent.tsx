"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { OAuthAuthorizationDetails } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { authorizationPath, oauthRedirectUrl, requireAccount } from "@/lib/supabase/oauth";
import SignInPage from "./sign-in-page";

const scopeLabels: Record<string, string> = {
  openid: "Identify your Coursebook account",
  email: "Read your email address",
  profile: "Read your basic profile",
  phone: "Read your phone number",
};

export default function OAuthConsent({ authorizationId, initialError }: { authorizationId: string; initialError: string }) {
  const router = useRouter();
  const [details, setDetails] = useState<OAuthAuthorizationDetails | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!authorizationId) {
        setError("This connection link is missing its authorization request. Start again from your assistant.");
        setLoading(false);
        return;
      }
      const supabase = createClient();
      try {
        let user;
        try { user = await requireAccount(supabase); }
        catch {
          if (active) setNeedsLogin(true);
          return;
        }
        const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId);
        if (!active) return;
        if (error || !data) throw new Error("This authorization request is invalid or expired. Start the connection again from your assistant.");
        if ("redirect_url" in data) {
          window.location.assign(oauthRedirectUrl(data.redirect_url));
        } else {
          if (data.user.id !== user.id) throw new Error("Your account changed. Reload this page before continuing.");
          setError("");
          setDetails(data);
        }
      } catch (error) {
        if (active) setError(error instanceof Error ? error.message : "Unable to load the authorization request.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    if (pending || !details) return;
    setPending(true);
    setError("");
    try {
      const supabase = createClient();
      await requireAccount(supabase, details.user.id);
      const { data, error } = await (approve
        ? supabase.auth.oauth.approveAuthorization(authorizationId, { skipBrowserRedirect: true })
        : supabase.auth.oauth.denyAuthorization(authorizationId, { skipBrowserRedirect: true }));
      if (error || !data) throw new Error("Unable to complete authorization. Try again, or restart the connection in your assistant.");
      window.location.assign(oauthRedirectUrl(data.redirect_url));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to complete authorization.");
      setPending(false);
    }
  }

  if (needsLogin) return <SignInPage onBack={() => router.push("/")} initialError={error}
    returnTo={authorizationPath(authorizationId)} onAuthenticated={() => window.location.reload()} />;

  return <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
    <section className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8" aria-busy={loading || pending}>
      <p className="text-sm font-semibold text-[#57068c] mb-6">Coursebook</p>
      <h1 className="text-2xl font-semibold text-gray-950 mb-4">Authorize access</h1>
      {loading && <p role="status" className="text-sm text-gray-600">Loading your connection request…</p>}
      {error && <p role="alert" className="text-sm text-red-700 mb-4">{error}</p>}
      {details && <>
        <p className="text-sm text-gray-700 mb-4"><strong>{details.client.name}</strong> wants to connect to Coursebook as {details.user.email}.</p>
        <p className="text-xs text-gray-600 mb-4">The app name is supplied by its developer and is not verified by Coursebook. Check the return address before allowing access.</p>
        <p className="text-xs text-gray-600 break-all mb-4">Return address: {details.redirect_uri}</p>
        <h2 className="text-sm font-medium text-gray-950">Requested account permissions</h2>
        <ul className="list-disc pl-5 my-3 text-sm text-gray-700">
          {details.scope.split(/\s+/).filter(Boolean).map(scope => <li key={scope}>{scopeLabels[scope] ?? scope}</li>)}
        </ul>
        <p className="text-sm text-gray-600 mb-6">This app can search and read the course catalog with your account. Signing out of this website keeps the connection active. You can disconnect it separately in your account.</p>
        <div className="flex gap-3">
          <button disabled={pending} onClick={() => void decide(false)} className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm disabled:opacity-50">Deny</button>
          <button disabled={pending} onClick={() => void decide(true)} className="flex-1 bg-[#57068c] text-white rounded-md px-4 py-2 text-sm disabled:opacity-50">{pending ? "Continuing…" : "Allow access"}</button>
        </div>
      </>}
      {!loading && !details && <Link href="/" className="text-sm text-[#57068c] underline">Return to Coursebook</Link>}
    </section>
  </main>;
}
