"use client";

import { useEffect, useState } from "react";
import { getStoredSession } from "@/lib/supabase/auth";

type AccessInfo = {
  hasPaidAccess: boolean;
  freeTrialUsed: boolean;
};

async function parseApiJson<T>(response: Response): Promise<T> {
  const raw = await response.text();
  if (!raw) return {} as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return {} as T;
  }
}

export function AccessStatusBadge() {
  const [status, setStatus] = useState<"hidden" | "active" | "trial" | "used">("hidden");

  useEffect(() => {
    async function loadStatus() {
      const session = getStoredSession();
      if (!session?.access_token) {
        setStatus("hidden");
        return;
      }

      try {
        const response = await fetch("/api/access", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          setStatus("hidden");
          return;
        }

        const data = await parseApiJson<AccessInfo>(response);
        if (data.hasPaidAccess) {
          setStatus("active");
          return;
        }
        setStatus(data.freeTrialUsed ? "used" : "trial");
      } catch {
        setStatus("hidden");
      }
    }

    loadStatus();
  }, []);

  if (status === "hidden") return null;

  const label =
    status === "active"
      ? "Plan actif"
      : status === "trial"
        ? "Essai gratuit"
        : "Essai utilise";

  const className =
    status === "active"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "trial"
        ? "border-teal-200 bg-teal-50 text-teal-700"
        : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50">
      <span
        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-wide shadow-sm ${className}`}
      >
        {label}
      </span>
    </div>
  );
}
