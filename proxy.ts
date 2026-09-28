import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Next.js runs this before matching pages and API routes.
export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.",
    );
  }

  let response = NextResponse.next({ request });

  // Create a client for this request, using this visitor's cookies.
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        // Downstream server code needs the refreshed cookies immediately.
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );

        const previousResponse = response;
        response = NextResponse.next({ request });
        // Preserve earlier cookie writes and cache headers if Supabase writes twice.
        previousResponse.cookies.getAll().forEach((cookie) =>
          response.cookies.set(cookie),
        );
        for (const name of ["Cache-Control", "Expires", "Pragma"]) {
          const value = previousResponse.headers.get(name);
          if (value !== null) response.headers.set(name, value);
        }

        // The browser needs the new cookies for subsequent requests.
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([name, value]) =>
          response.headers.set(name, value),
        );
      },
    },
  });

  // Validate the session and refresh expired tokens when needed.
  // Public pages still allow signed-out visitors; protected routes must check auth.
  await supabase.auth.getClaims();

  return response;
}

export const config = {
  matcher: [
    // Skip framework assets, static images, and the independent health check.
    "/((?!_next/static|_next/image|favicon.ico|api/health(?:/|$)|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
