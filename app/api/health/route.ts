// GET /api/health confirms that the website API can respond.
// It does not check Supabase or the separate MCP server.
export function GET() {
  return Response.json(
    { status: "ok" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
