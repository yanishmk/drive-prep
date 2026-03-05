import { NextRequest, NextResponse } from "next/server";
import { getAdminOverview, getUserFromAccessToken } from "@/lib/server/supabaseServer";

function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) return null;
  return auth.slice(7).trim();
}

function isAllowedAdmin(email?: string): boolean {
  if (!email) return false;
  const raw = process.env.ADMIN_EMAILS ?? "";
  const admins = raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}

export async function GET(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const user = await getUserFromAccessToken(token);
    if (!isAllowedAdmin(user.email)) {
      return NextResponse.json({ error: "Acces admin refuse." }, { status: 403 });
    }

    const overview = await getAdminOverview();
    return NextResponse.json({ adminEmail: user.email, overview });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Impossible de charger les statistiques admin.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
