"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const AUTH_KEYS = [
  "access_token",
  "refresh_token",
  "token_hash",
  "type",
  "code",
  "error",
  "error_description",
] as const;

function hasAuthParams(params: URLSearchParams) {
  return AUTH_KEYS.some((key) => params.has(key));
}

export function AuthRedirectBridge() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname.startsWith("/auth/callback")) return;

    const search = window.location.search ?? "";
    const hash = window.location.hash?.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash ?? "";

    const searchParams = new URLSearchParams(search);
    const hashParams = new URLSearchParams(hash);

    if (!hasAuthParams(searchParams) && !hasAuthParams(hashParams)) return;

    router.replace(`/auth/callback${search}${window.location.hash ?? ""}`);
  }, [pathname, router]);

  return null;
}

