import { useEffect, useRef, useState } from "react";
import McpTab from "./mcp-tab";

export default function ProfilePage({ userName, onSignOut, signingOut, error }: {
  userName: string;
  onSignOut: () => void;
  signingOut: boolean;
  error: string;
}) {
  const firstName = userName.split(" ")[0];
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        avatarRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  function openDeleteDialog() {
    setMenuOpen(false);
    setDeleteError("");
    dialogRef.current?.showModal();
    cancelRef.current?.focus();
  }

  async function deleteAccount() {
    if (deleting) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const response = await fetch("/api/account", { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Your account could not be deleted. Please try again.");
      }
      // Reload after the server clears auth cookies; discard the browser client's
      // in-memory session as well as all account UI, even if remote sign-out failed.
      window.location.replace("/");
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Unable to reach the server. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-13 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-gray-900 tracking-tight">Coursebook</span>
          <div className="flex items-center gap-4">
            <div ref={menuRef} className="relative" onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
            }}>
              <button ref={avatarRef} type="button" aria-label="Account options" aria-expanded={menuOpen} aria-controls="account-options" disabled={signingOut}
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-full bg-[#57068c] flex items-center justify-center text-white text-[12px] font-semibold hover:bg-[#6d0faa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#57068c] disabled:opacity-50">
                {firstName[0]}
              </button>
              {menuOpen && (
                <div id="account-options" className="absolute right-0 top-full mt-2 w-44 rounded-md border border-gray-200 bg-white p-1">
                  <button type="button" onClick={openDeleteDialog} className="w-full rounded px-3 py-2 text-left text-[13px] font-medium text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-700">
                    Delete account
                  </button>
                </div>
              )}
            </div>
            <button disabled={signingOut} onClick={onSignOut} className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors">
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      </header>

      <dialog ref={dialogRef} aria-labelledby="delete-account-title" aria-describedby="delete-account-description" aria-busy={deleting}
        onCancel={(event) => { if (deleting) event.preventDefault(); }}
        onClose={() => avatarRef.current?.focus()}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-gray-200 bg-white p-6 text-gray-950 backdrop:bg-black/30">
        <h2 id="delete-account-title" className="text-xl font-semibold">Delete your account?</h2>
        <p id="delete-account-description" className="mt-3 text-sm leading-relaxed text-gray-600">
          This permanently deletes your Coursebook sign-in account and account information. You will be signed out. This cannot be undone.
        </p>
        {deleteError && <p role="alert" className="mt-4 text-sm text-red-700">{deleteError}</p>}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button ref={cancelRef} type="button" disabled={deleting} onClick={() => dialogRef.current?.close()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#57068c] disabled:opacity-50">Cancel</button>
          <button type="button" disabled={deleting} onClick={deleteAccount}
            className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:opacity-50">
            {deleting ? "Deleting account…" : "Delete account"}
          </button>
        </div>
      </dialog>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}

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
