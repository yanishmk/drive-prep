export type Difficulty = "facile" | "moyenne" | "difficile";

export type CardinalDirection = "N" | "S" | "E" | "W";

export type CarMove = "left" | "straight" | "right";

export type IntersectionControl = "none" | "stop" | "yield";

export type IntersectionVehicleKind =
  | "car"
  | "bus"
  | "truck"
  | "emergency"
  | "cyclist";

export type IntersectionCar = {
  id: string;
  from: CardinalDirection;
  move: CarMove;
  color?: string;
  kind?: IntersectionVehicleKind;
};

export type IntersectionPedestrian = {
  id: string;
  at: CardinalDirection;
  color?: string;
};

export type Intersection4WayIllustration = {
  kind: "intersection_4way";
  context?: string;
  firstPassId?: string;
  controls?: Partial<Record<CardinalDirection, IntersectionControl>>;
  cars: [IntersectionCar, ...IntersectionCar[]];
  pedestrians?: IntersectionPedestrian[];
};

export type PhotoIllustration = {
  kind: "photo";
  imageUrl: string;
  alt: string;
  sourceLabel?: string;
  sourceUrl?: string;
  context?: string;
  overlayTag?: string;
};

export type QuestionIllustration = Intersection4WayIllustration | PhotoIllustration;

export type Question = {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctOptionIndex: number;
  explanation: string;
  difficulty: Difficulty;
  category: string;
  illustration?: QuestionIllustration;
};

export type Exam = {
  exam_id: number;
  questions: string[];
};

export type UserAnswers = Record<string, number | null | undefined>;

export type EvaluationError = {
  questionId: string;
  reponseUtilisateur: number | null;
  reponseCorrecte: number;
};

export type EvaluationResult = {
  score: number;
  reussite: boolean;
  erreurs: EvaluationError[];
};

export type PriorityScenario = {
  id: number;
  titre: string;
  sceneVueDessus: string;
  positionsVoitures: string;
  directions: string;
  passeEnPremier: string;
};
