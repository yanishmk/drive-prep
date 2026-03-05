"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredSession } from "@/lib/supabase/auth";

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20c1.6-3.3 4.1-5 7.5-5s5.9 1.7 7.5 5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function ProfileConnectedIcon() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    function syncSessionState() {
      const session = getStoredSession();
      setIsConnected(Boolean(session?.access_token));
    }

    syncSessionState();
    window.addEventListener("focus", syncSessionState);
    window.addEventListener("storage", syncSessionState);
    return () => {
      window.removeEventListener("focus", syncSessionState);
      window.removeEventListener("storage", syncSessionState);
    };
  }, []);

  if (!isConnected) return null;

  return (
    <Link
      href="/compte"
      aria-label="Profil connecte"
      title="Profil connecte"
      className="fixed right-4 top-12 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
    >
      <UserIcon />
    </Link>
  );
}
