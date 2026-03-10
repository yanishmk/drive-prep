"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredSession } from "@/lib/supabase/auth";
import type { PlanCode } from "@/lib/saas/plans";

type Props = {
  planCode: PlanCode;
  recommended?: boolean;
  label: string;
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

export function PlanCheckoutButton({ planCode, recommended, label }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    const session = getStoredSession();
    if (!session?.access_token) {
      router.push(`/inscription?plan=${planCode}`);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan: planCode }),
      });

      const json = await parseApiJson<{ url?: string }>(response);
      if (!response.ok || !json.url) {
        router.push("/simulations");
        return;
      }
      window.location.href = json.url;
    } catch {
      router.push("/simulations");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${
        recommended
          ? "bg-emerald-600 text-white hover:bg-emerald-500"
          : "border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
      }`}
    >
      {isLoading ? "Redirection..." : label}
    </button>
  );
}

