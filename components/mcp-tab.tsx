"use client";

import { useState } from "react";

const MCP_URL = process.env.NEXT_PUBLIC_MCP_URL?.trim() ?? "";
const PROMPT = "Use Coursebook to list the available programs.";

export default function McpTab() {
  const [copied, setCopied] = useState<"url" | "prompt" | null>(null);
  const [copyError, setCopyError] = useState("");

  const handleCopy = async (text: string, field: "url" | "prompt") => {
    setCopyError("");
    setCopied(null);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
    } catch {
      setCopyError("Could not copy. Select the text and copy it manually.");
    }
  };

  return (
    <div>
      {/* Account sign-in is complete; MCP verification is not connected yet. */}
      <div className="mb-8 pb-8 border-b border-gray-100">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-[18px] font-semibold text-gray-950" style={{ letterSpacing: "-0.02em" }}>Connection setup</h2>
          <span className="text-[12px] text-gray-600">1 of 2 complete</span>
        </div>

        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6" role="progressbar" aria-label="Connection setup" aria-valuenow={1} aria-valuemin={0} aria-valuemax={2}>
          <div className="h-full w-1/2 bg-green-600 rounded-full" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center shrink-0">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M2.5 6.5l3 3 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-800">Account created</p>
              <p className="text-[11px] text-green-700">Signed in</p>
            </div>
          </div>

          <div className="hidden sm:block flex-1 h-px bg-gray-100" />

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-semibold text-gray-600">2</span>
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-700">Confirm your connection</p>
              <p className="text-[11px] text-gray-600">Pending · MCP verification is not connected yet</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 pb-8 border-b border-gray-100">
        <h2 className="text-[18px] font-semibold text-gray-950 mb-1" style={{ letterSpacing: "-0.02em" }}>MCP URL</h2>
        <p className="text-[13px] text-gray-600">Add this URL in your assistant’s MCP settings to set up Coursebook manually.</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4">
          <div className="min-w-0 flex-1 border border-gray-200 rounded-md px-4 py-2.5 bg-gray-50">
            {MCP_URL ? (
              <code className="text-[12px] text-gray-700 break-all">{MCP_URL}</code>
            ) : (
              <span className="text-[12px] text-gray-700">MCP URL coming soon</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleCopy(MCP_URL, "url")}
            disabled={!MCP_URL}
            className="px-4 py-2.5 border border-gray-200 rounded-md text-[12px] font-medium text-gray-700 enabled:hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#57068c] transition-colors whitespace-nowrap"
          >
            {copied === "url" ? "Copied!" : "Copy URL"}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-[18px] font-semibold text-gray-950 mb-1" style={{ letterSpacing: "-0.02em" }}>Run your MCP</h2>
        <p className="text-[13px] text-gray-600 mb-4">Once MCP authentication is configured, ask your assistant:</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="min-w-0 flex-1 border border-gray-200 rounded-md px-4 py-2.5 bg-gray-50">
            <code className="text-[12px] text-gray-700 break-words">{PROMPT}</code>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(PROMPT, "prompt")}
            className="px-4 py-2.5 border border-gray-200 rounded-md text-[12px] font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#57068c] transition-colors whitespace-nowrap"
          >
            {copied === "prompt" ? "Copied!" : "Copy prompt"}
          </button>
        </div>
      </div>

      <p role="status" className="sr-only">
        {copied === "url" ? "MCP URL copied." : copied === "prompt" ? "Prompt copied." : ""}
      </p>
      {copyError && <p role="alert" className="text-[12px] text-red-700 mt-3">{copyError}</p>}
    </div>
  );
}
