import { NextRequest, NextResponse } from "next/server";
import { getUserFromAccessToken, getUserPayments } from "@/lib/server/supabaseServer";

function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) return null;
  return auth.slice(7).trim();
}

export async function GET(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const user = await getUserFromAccessToken(token);
    const payments = await getUserPayments(user.id);
    return NextResponse.json({ payments });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Impossible de charger les paiements.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
