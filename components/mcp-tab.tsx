"use client";

import { useState } from "react";

export default function McpTab() {
  const [tokenState, setTokenState] = useState<"idle" | "generated">("idle");
  const [copied, setCopied] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const TOKEN = "coursebook_demo_not_a_live_token";
  const PROMPT = "Use Coursebook to list the available programs.";

  const handleCopy = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div>
      {/* Demo banner */}
      <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-2.5 mb-8">
        <p className="text-[12px] text-gray-500">Demo preview · No live credentials are created.</p>
      </div>

      {tokenState === "idle" ? (
        <>
          {/* MCP connection */}
          <div className="mb-8 pb-8 border-b border-gray-100">
            <h2 className="text-[18px] font-semibold text-gray-950 mb-1" style={{ letterSpacing: "-0.02em" }}>MCP connection</h2>
            <p className="text-[13px] text-gray-400 mb-6">Get your access token to finish connecting your AI assistant.</p>

            <p className="text-[12px] font-semibold text-gray-700 mb-1">Access token</p>
            <p className="text-[13px] text-gray-400 mb-4">You haven&apos;t generated a token yet.</p>
            <button
              onClick={() => setTokenState("generated")}
              className="inline-flex items-center gap-2 bg-gray-950 hover:bg-[#57068c] text-white text-[13px] font-medium px-5 py-2.5 rounded-md transition-colors duration-200 mb-3"
            >
              Generate your token
            </button>
            <p className="text-[12px] text-gray-400">A sample token lets you preview the connection flow.</p>
          </div>

          {/* Finish connecting */}
          <div>
            <h2 className="text-[18px] font-semibold text-gray-950 mb-5" style={{ letterSpacing: "-0.02em" }}>Finish connecting</h2>
            <div className="flex flex-col gap-4">
              {[
                "Generate your access token",
                "Copy the token into your existing MCP connection",
                "Return to your assistant to explore courses",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-[11px] font-medium text-gray-400 flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-[13px] text-gray-600">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Connection setup progress */}
          <div className="mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[18px] font-semibold text-gray-950" style={{ letterSpacing: "-0.02em" }}>Connection setup</h2>
              <span className="text-[12px] text-gray-400">1 of 2 complete</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div className="h-full w-1/2 bg-green-500 rounded-full transition-all duration-500" />
            </div>

            {/* Steps */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2.5 6.5l3 3 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-gray-800">Access token generated</p>
                  <p className="text-[11px] text-green-600">Step 1 complete</p>
                </div>
              </div>

              <div className="flex-1 h-px bg-gray-100" />

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-[11px] font-semibold text-gray-400">2</span>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-gray-600">Confirm your connection</p>
                  <p className="text-[11px] text-gray-400">Waiting for a successful MCP call</p>
                </div>
              </div>
            </div>
          </div>

          {/* Your access token */}
          <div className="mb-8 pb-8 border-b border-gray-100">
            <h2 className="text-[18px] font-semibold text-gray-950 mb-1" style={{ letterSpacing: "-0.02em" }}>Your access token</h2>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex-1 border border-gray-200 rounded-md px-4 py-2.5 bg-gray-50">
                <span className="text-[12px] font-mono text-gray-600">{TOKEN}</span>
              </div>
              <button
                onClick={() => handleCopy(TOKEN, setCopied)}
                className="px-4 py-2.5 border border-gray-200 rounded-md text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-2">Demo token only. No live access is granted.</p>
          </div>

          {/* Run your MCP */}
          <div>
            <h2 className="text-[18px] font-semibold text-gray-950 mb-1" style={{ letterSpacing: "-0.02em" }}>Run your MCP</h2>
            <p className="text-[13px] text-gray-400 mb-4">Add the token to your MCP connection, then ask your assistant:</p>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 border border-gray-200 rounded-md px-4 py-2.5 bg-gray-50">
                <span className="text-[12px] font-mono text-gray-600">{PROMPT}</span>
              </div>
              <button
                onClick={() => handleCopy(PROMPT, setCopiedPrompt)}
                className="px-4 py-2.5 border border-gray-200 rounded-md text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                {copiedPrompt ? "Copied!" : "Copy prompt"}
              </button>
            </div>

            <p className="text-[12px] text-gray-400 mb-4">This page will confirm automatically after a successful tool call using your token.</p>

            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
              <p className="text-[12px] text-gray-400">Waiting for your first successful call</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
