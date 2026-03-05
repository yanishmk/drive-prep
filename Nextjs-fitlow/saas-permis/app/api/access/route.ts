import { NextRequest, NextResponse } from "next/server";
import {
  consumeFreeTrialExam,
  getAccessState,
  getUserFromAccessToken,
} from "@/lib/server/supabaseServer";

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
    const access = await getAccessState(user.id, user.email);
    return NextResponse.json(access);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Impossible de verifier l acces.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const user = await getUserFromAccessToken(token);
    const body = (await request.json()) as { action?: string; examId?: number };

    if (body.action !== "consume_free_trial") {
      return NextResponse.json({ error: "Action invalide." }, { status: 400 });
    }

    const access = await getAccessState(user.id, user.email);
    const examId = body.examId ?? access.freeExamId;
    if (access.hasPaidAccess) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    if (examId !== access.freeExamId) {
      return NextResponse.json(
        { error: `Seul l examen ${access.freeExamId} est disponible en essai gratuit.` },
        { status: 403 }
      );
    }

    await consumeFreeTrialExam(user.id, examId);
    const updated = await getAccessState(user.id, user.email);
    return NextResponse.json({ ok: true, access: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Impossible de consommer l essai gratuit.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
