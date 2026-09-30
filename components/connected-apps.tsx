"use client";

import { useEffect, useState } from "react";
import type { OAuthGrant } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { getAccountGrants, requireAccount } from "@/lib/supabase/oauth";

async function readGrants() {
  const supabase = createClient();
  return getAccountGrants(supabase);
}

export default function ConnectedApps() {
  const [grants, setGrants] = useState<OAuthGrant[]>([]);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void readGrants().then(({ user, grants }) => {
      if (cancelled) return;
      setOwnerId(user.id);
      setGrants(grants);
    }).catch(() => {
      if (!cancelled) setError("Unable to load connected apps. Please try again.");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [loadAttempt]);

  async function disconnect(grant: OAuthGrant) {
    if (pending || !ownerId) return;
    setPending(grant.client.id);
    setError("");
    setMessage("");
    try {
      const supabase = createClient();
      await requireAccount(supabase, ownerId);
      const { error } = await supabase.auth.oauth.revokeGrant({ clientId: grant.client.id });
      if (error) throw error;
      setGrants(current => current.filter(item => item.client.id !== grant.client.id));
      setMessage(`${grant.client.name} disconnected. Existing access tokens may work until they expire.`);
    } catch {
      setError("Unable to disconnect this app. Reload to verify your account and try again.");
    } finally { setPending(null); }
  }

  return <section className="mb-8 pb-8 border-b border-gray-100" aria-busy={loading}>
    <h2 className="text-[18px] font-semibold text-gray-950 mb-2">Connected apps</h2>
    <p className="text-[13px] text-gray-600 mb-4">Signing out of Coursebook keeps your assistant connected. Disconnect an app here to revoke its authorization and prevent token renewal.</p>
    <p className="text-[12px] text-gray-600 mb-4">App names and website addresses are supplied by their developers. Check them before granting access.</p>
    {loading ? <p role="status" className="text-sm text-gray-600">Loading connections…</p> : !error && grants.length === 0 ? <p className="text-sm text-gray-600">No apps connected yet. Add the MCP URL in ChatGPT and sign in to authorize access.</p> : null}
    <ul className="space-y-3">{grants.map(grant => <li key={grant.client.id} className="border border-gray-200 rounded-md p-4 flex items-center justify-between gap-4">
      <div><p className="text-sm font-medium text-gray-900">{grant.client.name}</p><p className="text-xs text-gray-600 break-all">{grant.client.uri || grant.client.id}</p></div>
      <button disabled={pending !== null} onClick={() => void disconnect(grant)} className="text-sm text-red-700 underline disabled:opacity-50">{pending === grant.client.id ? "Disconnecting…" : "Disconnect"}</button>
    </li>)}</ul>
    {error && <p role="alert" className="text-sm text-red-700 mt-3">{error} <button disabled={loading} onClick={() => { setLoading(true); setError(""); setLoadAttempt(attempt => attempt + 1); }} className="underline">Retry</button></p>}
    {message && <p role="status" className="text-sm text-gray-700 mt-3">{message}</p>}
  </section>;
}
