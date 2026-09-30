import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { safeAuthReturnPath } from "@/lib/supabase/oauth";

// Supabase redirects email-confirmation and OAuth flows here with a PKCE code.
export async function GET(request: NextRequest) {
  const destination = new URL(safeAuthReturnPath(request.nextUrl.searchParams.get("next")), request.url);
  const response = NextResponse.redirect(destination);
  response.headers.set("Cache-Control", "no-store");
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll(cookiesToSet, headers) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
            Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
          },
        },
      },
    );
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return response;
    } catch {
      // Show a recoverable error without exposing provider details in the URL.
    }
  }

  destination.searchParams.set("authError", "callback");
  response.headers.set("Location", destination.toString());
  return response;
}
