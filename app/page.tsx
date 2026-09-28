import { cookies } from "next/headers";
import CoursebookApp from "@/components/coursebook-app";
import { createClient } from "@/lib/supabase/server";

export default async function Home({ searchParams }: {
  searchParams: Promise<{ authError?: string }>;
}) {
  const supabase = createClient(await cookies());
  // Verify the cookie-backed user with Supabase before restoring the profile.
  const { data: { user }, error } = await supabase.auth.getUser();
  const params = await searchParams;
  const initialError = params.authError
    ? "That sign-in link could not be completed. Try signing in again, or request a new confirmation email by signing up again."
    : error && error.name !== "AuthSessionMissingError"
      ? "We could not restore your session. Please sign in again."
      : "";

  return <CoursebookApp initialUser={user} initialError={initialError} />;
}
