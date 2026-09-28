"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import LandingPage from "./landing-page";
import SignInPage from "./sign-in-page";
import ProfilePage from "./profile-page";

export default function CoursebookApp({ initialUser, initialError = "" }: {
  initialUser: User | null;
  initialError?: string;
}) {
  const [user, setUser] = useState(initialUser);
  const [page, setPage] = useState<"landing" | "signin" | "profile">(
    initialUser ? "profile" : initialError ? "signin" : "landing",
  );
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const { data: { subscription } } = createClient().auth.onAuthStateChange((event, session) => {
      // The server already verified the initial user. Later auth events keep
      // this browser UI in sync; API endpoints must still check auth themselves.
      if (event === "INITIAL_SESSION") return;
      setUser(session?.user ?? null);
      if (session?.user) setPage("profile");
      else setPage("landing");
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    setError("");
    try {
      const { error } = await createClient().auth.signOut({ scope: "local" });
      if (error) throw error;
      setUser(null);
      setPage("landing");
    } catch {
      setError("Unable to sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  const fullName = user?.user_metadata?.full_name;
  const userName = typeof fullName === "string" && fullName.trim()
    ? fullName.trim() : user?.email ?? "there";

  return (
    <>
      {page === "landing" && <LandingPage onSignIn={() => setPage("signin")} />}
      {page === "signin" && <SignInPage onBack={() => setPage("landing")} initialError={initialError} />}
      {page === "profile" && user && (
        <ProfilePage key={user.id} userName={userName} onSignOut={handleSignOut} signingOut={signingOut} error={error} />
      )}
    </>
  );
}
