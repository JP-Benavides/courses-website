import OAuthConsent from "@/components/oauth-consent";

export const metadata = { title: "Authorize access | Coursebook", robots: { index: false, follow: false } };

export default async function ConsentPage({ searchParams }: {
  searchParams: Promise<{ authorization_id?: string | string[]; authError?: string }>;
}) {
  const params = await searchParams;
  const authorizationId = typeof params.authorization_id === "string" ? params.authorization_id : "";
  return <OAuthConsent key={authorizationId} authorizationId={authorizationId}
    initialError={params.authError ? "That sign-in link could not be completed. Please sign in again." : ""} />;
}
