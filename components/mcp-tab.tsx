"use client";

import { useState } from "react";
import ConnectedApps from "./connected-apps";

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
      <ConnectedApps />

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
        <p className="text-[13px] text-gray-600 mb-4">After authorizing Coursebook in ChatGPT, ask your assistant:</p>
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
