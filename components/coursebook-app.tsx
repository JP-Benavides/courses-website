"use client";

import { useState } from "react";
import LandingPage from "./landing-page";
import SignInPage from "./sign-in-page";
import ProfilePage from "./profile-page";

// Demo screen navigation and user name live here; no real authentication yet.
export default function CoursebookApp() {
  const [page, setPage] = useState<"landing" | "signin" | "profile">("landing");
  const [userName, setUserName] = useState("Alex Johnson");

  const handleSignIn = (name: string) => {
    setUserName(name);
    setPage("profile");
  };

  return (
    <>
      {page === "landing" && <LandingPage onSignIn={() => setPage("signin")} />}
      {page === "signin" && <SignInPage onBack={() => setPage("landing")} onSignIn={handleSignIn} />}
      {page === "profile" && <ProfilePage userName={userName} onSignOut={() => setPage("landing")} />}
    </>
  );
}
