import CourseTicker from "./course-ticker";

const features = [
  { label: "Explore courses", description: "Search the NYU catalog by topic, title, or course code." },
  { label: "Compare your options", description: "Retrieve and compare course details side by side." },
  { label: "Understand prerequisites", description: "Check prerequisites against completed coursework." },
];

export default function LandingPage({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Nav */}
      <header className="border-b border-gray-100 relative z-20 bg-white">
        <nav className="max-w-5xl mx-auto px-6 h-13 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 tracking-tight">Coursebook</span>
          <div className="flex items-center gap-6">
            <button className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">How it works</button>
            <button onClick={onSignIn} className="text-[13px] text-gray-800 font-medium hover:text-gray-950 transition-colors">Sign in</button>
          </div>
        </nav>
      </header>

      {/* Catalogue background + hero */}
      <div className="relative">
        <div className="absolute inset-0 flex flex-col gap-3 pt-4 pb-4 pointer-events-none z-0">
          <CourseTicker offset={0} reverse={false} />
          <CourseTicker offset={5} reverse={true} />
          <CourseTicker offset={10} reverse={false} />
          <CourseTicker offset={2} reverse={true} />
          <CourseTicker offset={15} reverse={false} />
          <CourseTicker offset={8} reverse={true} />
        </div>
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 80% at 50% 45%, rgba(255,255,255,0.97) 40%, rgba(255,255,255,0.82) 70%, rgba(255,255,255,0.1) 100%)" }}
        />
        <div className="relative z-20 max-w-5xl mx-auto px-6 pt-20 pb-20 text-center">
          <div className="inline-flex items-center gap-2 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#57068c]" />
            <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-gray-400">For NYU Students</span>
          </div>
          <h1 className="text-[52px] font-bold text-gray-950 leading-[1.08] mb-5" style={{ letterSpacing: "-0.03em" }}>
            Your course catalog.
            <br />
            A clearer conversation.
          </h1>
          <p className="text-[13px] text-gray-400 leading-relaxed mb-9 max-w-xs mx-auto">
            Explore courses, compare your options, and understand prerequisites in your AI assistant.
          </p>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onSignIn}
              className="inline-flex items-center gap-2 bg-gray-950 hover:bg-[#57068c] text-white text-[13px] font-medium px-5 py-2.5 rounded-md transition-all duration-200"
              style={{ letterSpacing: "-0.01em" }}
            >
              Sign in to get connected
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <p className="text-[11px] text-gray-400">Create an account, get your token, and connect the MCP.</p>
          </div>
        </div>
      </div>

      {/* Feature strip */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {features.map((f, i) => (
              <div key={i} className="px-6 first:pl-0 last:pr-0">
                <p className="text-[12px] font-semibold text-gray-700 mb-1" style={{ letterSpacing: "-0.01em" }}>{f.label}</p>
                <p className="text-[12px] text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <p className="text-[11px] text-gray-400">Independent project. Not affiliated with NYU.</p>
        </div>
      </footer>
    </div>
  );
}
