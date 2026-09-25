import McpTab from "./mcp-tab";

export default function ProfilePage({ userName, onSignOut }: { userName: string; onSignOut: () => void }) {
  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-13 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 tracking-tight">Coursebook</span>
          <div className="flex items-center gap-4">
            <div className="w-7 h-7 rounded-full bg-[#57068c] flex items-center justify-center text-white text-[11px] font-semibold">
              {firstName[0]}
            </div>
            <button onClick={onSignOut} className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Profile header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-semibold text-gray-950" style={{ letterSpacing: "-0.02em" }}>
            Hey, {userName}
          </h1>
        </div>

        {/* MCP */}
        <div className="bg-white rounded-xl border border-gray-100 p-8">
          <McpTab />
        </div>

      </div>
    </div>
  );
}
