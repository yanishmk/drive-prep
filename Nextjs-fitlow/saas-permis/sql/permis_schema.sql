-- PostgreSQL schema for Drive-Prep

BEGIN;

CREATE TABLE IF NOT EXISTS questions (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE,
  question_text TEXT NOT NULL,
  answer_options JSONB NOT NULL
    CHECK (
      jsonb_typeof(answer_options) = 'array'
      AND jsonb_array_length(answer_options) = 4
    ),
  correct_option_index SMALLINT NOT NULL
    CHECK (correct_option_index BETWEEN 0 AND 3),
  explanation TEXT NOT NULL,
  difficulty VARCHAR(10) NOT NULL
    CHECK (difficulty IN ('facile', 'moyenne', 'difficile')),
  category VARCHAR(100) NOT NULL
    CHECK (length(trim(category)) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exams (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  question_count SMALLINT NOT NULL DEFAULT 25 CHECK (question_count > 0),
  pass_threshold NUMERIC(5,2) NOT NULL DEFAULT 80.00
    CHECK (pass_threshold BETWEEN 0 AND 100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exam_questions (
  exam_id BIGINT NOT NULL
    REFERENCES exams(id) ON DELETE CASCADE,
  question_id BIGINT NOT NULL
    REFERENCES questions(id) ON DELETE RESTRICT,
  position SMALLINT NOT NULL CHECK (position > 0),
  points SMALLINT NOT NULL DEFAULT 1 CHECK (points > 0),

  PRIMARY KEY (exam_id, question_id),
  UNIQUE (exam_id, position)
);

CREATE TABLE IF NOT EXISTS user_results (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  exam_id BIGINT NOT NULL
    REFERENCES exams(id) ON DELETE RESTRICT,
  attempt_no INT NOT NULL DEFAULT 1 CHECK (attempt_no > 0),

  total_questions SMALLINT NOT NULL CHECK (total_questions > 0),
  correct_answers SMALLINT NOT NULL CHECK (correct_answers >= 0),
  score_percent NUMERIC(5,2) NOT NULL CHECK (score_percent BETWEEN 0 AND 100),
  passed BOOLEAN NOT NULL,

  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  errors JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, exam_id, attempt_no),
  CHECK (correct_answers <= total_questions)
);

CREATE INDEX IF NOT EXISTS idx_questions_category
  ON questions(category);

CREATE INDEX IF NOT EXISTS idx_questions_difficulty
  ON questions(difficulty);

CREATE INDEX IF NOT EXISTS idx_questions_category_difficulty
  ON questions(category, difficulty);

CREATE INDEX IF NOT EXISTS idx_exams_is_active
  ON exams(is_active);

CREATE INDEX IF NOT EXISTS idx_exam_questions_question_id
  ON exam_questions(question_id);

CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_position
  ON exam_questions(exam_id, position);

CREATE INDEX IF NOT EXISTS idx_user_results_user_id
  ON user_results(user_id);

CREATE INDEX IF NOT EXISTS idx_user_results_exam_id
  ON user_results(exam_id);

CREATE INDEX IF NOT EXISTS idx_user_results_user_exam_completed
  ON user_results(user_id, exam_id, completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_results_passed
  ON user_results(passed);

COMMIT;
