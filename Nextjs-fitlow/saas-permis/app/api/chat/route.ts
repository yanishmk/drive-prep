import { NextRequest, NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatBody = {
  message?: string;
  history?: ChatMessage[];
};

const SYSTEM_PROMPT = `Tu es Coach Permis, un assistant specialise pour l'examen theorique SAAQ (Quebec).
Regles:
- Reponds en francais simple et clair.
- Sois concis, pratique, et oriente examen.
- Si la question est hors conduite/examen SAAQ, reponds brièvement puis recentre.
- Ne donne jamais de conseils illegaux ou dangereux.
- Quand pertinent, propose 2-3 points clefs faciles a memoriser.`;

function normalizeHistory(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter((item): item is ChatMessage => {
      if (!item || typeof item !== "object") return false;
      const role = (item as { role?: string }).role;
      const content = (item as { content?: string }).content;
      return (role === "user" || role === "assistant") && typeof content === "string";
    })
    .slice(-10)
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, 1200),
    }))
    .filter((item) => item.content.length > 0);
}

function extractText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const direct = (payload as { output_text?: unknown }).output_text;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const output = (payload as { output?: unknown }).output;
  if (!Array.isArray(output)) return "";
  for (const block of output) {
    if (!block || typeof block !== "object") continue;
    const content = (block as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (!part || typeof part !== "object") continue;
      const text = (part as { text?: unknown }).text;
      if (typeof text === "string" && text.trim()) return text.trim();
    }
  }
  return "";
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY manquant dans l'environnement serveur." },
        { status: 500 }
      );
    }

    const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
    const body = (await request.json()) as ChatBody;
    const message = (body.message ?? "").trim().slice(0, 1200);
    if (!message) {
      return NextResponse.json({ error: "Message vide." }, { status: 400 });
    }

    const history = normalizeHistory(body.history);
    const input = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((item) => ({ role: item.role, content: item.content })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input,
      }),
    });

    const raw = await response.text();
    let payload: unknown = {};
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      payload = {};
    }

    if (!response.ok) {
      const apiError =
        typeof payload === "object" && payload
          ? ((payload as { error?: { message?: string } }).error?.message ?? "Erreur API IA.")
          : "Erreur API IA.";
      return NextResponse.json({ error: apiError }, { status: 500 });
    }

    const reply = extractText(payload);
    if (!reply) {
      return NextResponse.json(
        { error: "Reponse IA vide. Reessaie dans quelques secondes." },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur serveur.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

