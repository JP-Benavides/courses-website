import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/server/supabase-admin";

function failure(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request: NextRequest) {
  // Cookie authentication needs CSRF protection. Browser fetch sends Origin on DELETE.
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return failure("This request must come from this website.", 403);
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !publicKey) return failure("Account deletion is unavailable. Please try again later.", 503);

    const response = NextResponse.json({ deleted: true }, { headers: { "Cache-Control": "no-store" } });
    const supabase = createServerClient(url, publicKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return failure("Please sign in again before deleting your account.", 401);

    const admin = createAdminClient();
    if (!admin) return failure("Account deletion is unavailable. Please try again later.", 503);

    // Never read a target user ID from the request: only delete the verified account.
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) return failure("Your account could not be deleted. Please try again or contact support.", 500);

    // Deletion has committed. A now-invalid session must not turn it into a UI failure.
    try { await supabase.auth.signOut({ scope: "local" }); } catch { /* Clear cookies below regardless. */ }
    const authCookie = `sb-${new URL(url).hostname.split(".")[0]}-auth-token`;
    const cookieNames = new Set([
      ...request.cookies.getAll().map(({ name }) => name),
      ...response.cookies.getAll().map(({ name }) => name),
    ]);
    for (const name of cookieNames) {
      if (name === authCookie || name.startsWith(`${authCookie}.`) || name === `${authCookie}-code-verifier`) {
        response.cookies.set(name, "", { path: "/", maxAge: 0 });
      }
    }
    return response;
  } catch {
    return failure("Account deletion is unavailable. Please try again later.", 500);
  }
}
