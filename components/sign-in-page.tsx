"use client";

import { useState } from "react";

export default function SignInPage({ onBack, onSignIn }: { onBack: () => void; onSignIn: (name: string) => void }) {
  const [mode, setMode] = useState<"choose" | "signup" | "login">("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <header className="border-b border-gray-100">
        <nav className="max-w-5xl mx-auto px-6 h-13 flex items-center justify-between">
          <button onClick={onBack} className="text-[14px] font-semibold text-gray-900 tracking-tight hover:text-[#57068c] transition-colors">
            Coursebook
          </button>
        </nav>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">

          {/* ── Choose mode ── */}
          {mode === "choose" && (
            <div>
              <div className="mb-8">
                <h2 className="text-[22px] font-semibold text-gray-950 mb-1" style={{ letterSpacing: "-0.02em" }}>
                  Welcome to Coursebook
                </h2>
                <p className="text-[13px] text-gray-400">Sign in or create an account to get started.</p>
              </div>

              {/* Create account first */}
              <button
                onClick={() => setMode("signup")}
                className="w-full bg-[#57068c] hover:bg-[#6d0faa] text-white rounded-md py-2.5 text-[13px] font-medium transition-colors mb-6"
              >
                Create an account
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[11px] text-gray-400">or sign in with</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* SSO buttons */}
              <div className="flex flex-col gap-3">
                <button onClick={() => onSignIn("Alex Johnson")} className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-md py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                    <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <button onClick={() => onSignIn("Alex Johnson")} className="flex items-center justify-center gap-3 w-full bg-gray-950 hover:bg-black rounded-md py-2.5 text-[13px] font-medium text-white transition-colors">
                  <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                    <path d="M13.194 9.545c-.02-2.11 1.724-3.13 1.803-3.18-0.983-1.438-2.513-1.634-3.057-1.655-1.3-.133-2.54.768-3.197.768-.662 0-1.683-.75-2.77-.73-1.425.022-2.74.83-3.474 2.108C.88 9.3 1.94 13.478 3.54 15.39c.795.955 1.74 2.028 2.98 1.984 1.196-.047 1.648-.769 3.094-.769 1.447 0 1.855.769 3.115.744 1.29-.022 2.102-.98 2.89-1.941.916-1.112 1.292-2.193 1.31-2.248-.028-.013-2.515-.965-2.535-3.815zM10.97 3.178C11.614 2.39 12.05 1.3 11.928.19c-.937.04-2.073.624-2.745 1.396-.603.693-1.132 1.804-.99 2.869 1.045.08 2.12-.53 2.777-1.277z" fill="white"/>
                  </svg>
                  Continue with Apple
                </button>
              </div>
            </div>
          )}

          {/* ── Login form ── */}
          {mode === "login" && (
            <div>
              <button onClick={() => setMode("choose")} className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-700 transition-colors mb-8">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>
              <div className="mb-8">
                <h2 className="text-[22px] font-semibold text-gray-950 mb-1" style={{ letterSpacing: "-0.02em" }}>Sign in</h2>
                <p className="text-[13px] text-gray-400">Enter your email and password.</p>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@nyu.edu"
                    className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-[13px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#57068c] focus:ring-1 focus:ring-[#57068c] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-[13px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#57068c] focus:ring-1 focus:ring-[#57068c] transition-colors"
                  />
                </div>
                <button onClick={() => onSignIn(email || "Alex Johnson")} className="w-full bg-gray-950 hover:bg-[#57068c] text-white rounded-md py-2.5 text-[13px] font-medium transition-colors mt-1">
                  Sign in
                </button>
              </div>
              <p className="text-[12px] text-gray-400 text-center mt-5">
                Don&apos;t have an account?{" "}
                <button onClick={() => setMode("signup")} className="text-[#57068c] font-medium hover:underline underline-offset-2">
                  Sign up
                </button>
              </p>
            </div>
          )}

          {/* ── Sign-up form ── */}
          {mode === "signup" && (
            <div>
              <button onClick={() => setMode("choose")} className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-700 transition-colors mb-8">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>
              <div className="mb-8">
                <h2 className="text-[22px] font-semibold text-gray-950 mb-1" style={{ letterSpacing: "-0.02em" }}>Create an account</h2>
                <p className="text-[13px] text-gray-400">Get started with Coursebook for free.</p>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-[13px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#57068c] focus:ring-1 focus:ring-[#57068c] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@nyu.edu"
                    className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-[13px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#57068c] focus:ring-1 focus:ring-[#57068c] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-[13px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#57068c] focus:ring-1 focus:ring-[#57068c] transition-colors"
                  />
                </div>
                <button onClick={() => onSignIn(name || "Alex Johnson")} className="w-full bg-[#57068c] hover:bg-[#6d0faa] text-white rounded-md py-2.5 text-[13px] font-medium transition-colors mt-1">
                  Create account
                </button>
              </div>
              <p className="text-[12px] text-gray-400 text-center mt-5">
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-[#57068c] font-medium hover:underline underline-offset-2">
                  Sign in
                </button>
              </p>
            </div>
          )}

        </div>
      </div>

      <div className="border-t border-gray-100 px-6 py-4">
        <p className="text-[11px] text-gray-400 text-center">Independent project. Not affiliated with NYU.</p>
      </div>
    </div>
  );
}
