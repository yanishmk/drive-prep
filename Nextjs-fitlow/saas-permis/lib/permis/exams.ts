import type { Exam } from "@/lib/permis/types";
import {
  EASY_IDS,
  HARD_IDS,
  MEDIUM_IDS,
  QUESTION_BANK,
} from "@/lib/permis/questionBank";

const QUESTION_BY_ID = new Map(QUESTION_BANK.map((question) => [question.id, question]));

function makeRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

function pickUnique(pool: readonly string[], count: number, rng: () => number): string[] {
  const work = [...pool];
  const picked: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(rng() * work.length);
    picked.push(work[idx]);
    work.splice(idx, 1);
  }
  return picked;
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function categoryCount(ids: string[]): number {
  const categories = new Set<string>();
  for (const id of ids) {
    const question = QUESTION_BY_ID.get(id);
    if (question) categories.add(question.category);
  }
  return categories.size;
}

function normalizeQuestionText(id: string): string | undefined {
  return QUESTION_BY_ID.get(id)?.question.trim().toLowerCase();
}

function hasDuplicateQuestionText(ids: string[]): boolean {
  const texts = new Set<string>();
  for (const id of ids) {
    const normalized = normalizeQuestionText(id);
    if (!normalized) continue;
    if (texts.has(normalized)) return true;
    texts.add(normalized);
  }
  return false;
}

function pickUniqueByText(
  pool: readonly string[],
  count: number,
  rng: () => number,
  usedIds: Set<string>,
  usedTexts: Set<string>
): string[] {
  const shuffled = shuffle([...pool], rng);
  const picked: string[] = [];
  for (const id of shuffled) {
    if (usedIds.has(id)) continue;
    const text = normalizeQuestionText(id);
    if (!text || usedTexts.has(text)) continue;
    usedIds.add(id);
    usedTexts.add(text);
    picked.push(id);
    if (picked.length === count) break;
  }
  if (picked.length !== count) {
    throw new Error(`Unable to pick ${count} unique-text questions from a difficulty pool.`);
  }
  return picked;
}

function buildFallbackQuestions(examId: number): string[] {
  const usedIds = new Set<string>();
  const usedTexts = new Set<string>();
  const easy = pickUniqueByText(EASY_IDS, 8, makeRng(7000 + examId * 101), usedIds, usedTexts);
  const medium = pickUniqueByText(
    MEDIUM_IDS,
    12,
    makeRng(8000 + examId * 131),
    usedIds,
    usedTexts
  );
  const hard = pickUniqueByText(HARD_IDS, 5, makeRng(9000 + examId * 151), usedIds, usedTexts);
  return shuffle([...easy, ...medium, ...hard], makeRng(10000 + examId * 173));
}

function buildExam(examId: number): Exam {
  // 30% facile (8), 50% moyenne (12), 20% difficile (5) for 25 questions.
  let attempts = 0;
  while (attempts < 500) {
    attempts += 1;
    const rng = makeRng(1000 + examId * 67 + attempts * 13);
    const easy = pickUnique(EASY_IDS, 8, rng);
    const medium = pickUnique(MEDIUM_IDS, 12, rng);
    const hard = pickUnique(HARD_IDS, 5, rng);
    const questions = shuffle([...easy, ...medium, ...hard], makeRng(5000 + examId * 97 + attempts));

    if (new Set(questions).size !== 25) continue;
    if (hasDuplicateQuestionText(questions)) continue;
    if (categoryCount(questions) < 6) continue;
    return { exam_id: examId, questions };
  }

  // Fallback keeps the required difficulty ratio and enforces unique question text.
  return {
    exam_id: examId,
    questions: buildFallbackQuestions(examId),
  };
}

export const EXAMS: Exam[] = Array.from({ length: 20 }, (_, idx) => buildExam(idx + 1));

const EXAM_INDEX = new Map(EXAMS.map((exam) => [exam.exam_id, exam]));

export function getExamById(examId: number): Exam | undefined {
  return EXAM_INDEX.get(examId);
}
