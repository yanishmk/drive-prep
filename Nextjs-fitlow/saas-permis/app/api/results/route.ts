import { NextRequest, NextResponse } from "next/server";
import { getUserFromAccessToken, saveUserResult } from "@/lib/server/supabaseServer";

function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) return null;
  return auth.slice(7).trim();
}

type SaveResultBody = {
  examId: number;
  totalQuestions: number;
  correctAnswers: number;
  scorePercent: number;
  passed: boolean;
  answers: Record<string, number | null | undefined>;
  errors: Array<{
    questionId: string;
    reponseUtilisateur: number | null;
    reponseCorrecte: number;
  }>;
  sectionScores?: Array<{
    section: string;
    correct: number;
    total: number;
    score: number;
  }>;
};

export async function POST(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }
    const user = await getUserFromAccessToken(token);
    const rawBody = await request.text();
    if (!rawBody.trim()) {
      return NextResponse.json({ error: "Corps de requete vide." }, { status: 400 });
    }

    let body: SaveResultBody;
    try {
      body = JSON.parse(rawBody) as SaveResultBody;
    } catch {
      return NextResponse.json(
        { error: "Format JSON invalide pour l enregistrement du resultat." },
        { status: 400 }
      );
    }

    if (!body.examId || !body.totalQuestions) {
      return NextResponse.json({ error: "Resultat incomplet." }, { status: 400 });
    }

    await saveUserResult({
      userId: user.id,
      examId: body.examId,
      totalQuestions: body.totalQuestions,
      correctAnswers: body.correctAnswers,
      scorePercent: body.scorePercent,
      passed: body.passed,
      answers: body.answers ?? {},
      errors: body.errors ?? [],
      sectionScores: body.sectionScores ?? [],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Impossible d enregistrer le resultat.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
