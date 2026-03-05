import type {
  EvaluationError,
  EvaluationResult,
  Question,
  UserAnswers,
} from "@/lib/permis/types";

export function evaluateExam(
  questions: Question[],
  userAnswers: UserAnswers
): EvaluationResult {
  let correctCount = 0;
  const errors: EvaluationError[] = [];

  for (const question of questions) {
    const selected = userAnswers[question.id] ?? null;
    if (selected === question.correctOptionIndex) {
      correctCount += 1;
      continue;
    }

    errors.push({
      questionId: question.id,
      reponseUtilisateur: selected,
      reponseCorrecte: question.correctOptionIndex,
    });
  }

  const score =
    questions.length === 0
      ? 0
      : Number(((correctCount / questions.length) * 100).toFixed(2));

  return {
    score,
    reussite: score >= 80,
    erreurs: errors,
  };
}
