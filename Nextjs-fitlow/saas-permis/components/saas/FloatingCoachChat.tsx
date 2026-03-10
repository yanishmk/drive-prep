"use client";

import { FormEvent, useMemo, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
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

export function FloatingCoachChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Bonjour, je suis Coach Permis. Pose-moi une question sur l'examen theorique SAAQ.",
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;

    const message = input.trim();
    setInput("");
    const userMessage: ChatMessage = { role: "user", content: message };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);

    try {
      setLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: nextMessages.slice(-8),
        }),
      });

      const json = await parseApiJson<{ reply?: string; error?: string }>(response);
      if (!response.ok) {
        throw new Error(json.error ?? "Erreur IA.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: json.reply ?? "Je n'ai pas pu repondre pour le moment." },
      ]);
    } catch (error) {
      const err = error instanceof Error ? error.message : "Erreur IA.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Desole, je n'ai pas reussi a repondre. (${err})` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="mb-3 flex h-[480px] w-[340px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-emerald-600 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Coach Permis</p>
              <p className="text-xs opacity-90">Assistant IA SAAQ</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-white/15 px-2 py-1 text-xs font-semibold hover:bg-white/25"
            >
              Fermer
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[92%] rounded-xl px-3 py-2 text-sm leading-5 ${
                  message.role === "user"
                    ? "ml-auto bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading ? (
              <div className="max-w-[92%] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                Coach ecrit...
              </div>
            ) : null}
          </div>

          <form onSubmit={onSubmit} className="border-t border-slate-200 bg-white p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ex: qui a priorite a un arret 4 directions?"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="ml-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-2xl text-white shadow-[0_12px_28px_rgba(5,150,105,0.4)] transition hover:scale-[1.03] hover:bg-emerald-500"
        aria-label="Ouvrir le chat IA"
      >
        💬
      </button>
    </div>
  );
}

