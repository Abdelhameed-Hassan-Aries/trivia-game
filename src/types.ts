// src/types.ts

export interface GameState {
  playerName: string;
  difficulty: string;
  token: string;
  selectedCategories: (number | null)[];
  currentCategory: number | null;
  score: number;
  totalQuestions: number;
  answers: Answer[];
  gameCompleted: boolean;
}

export interface Answer {
  question: string;
  category: string;
  correct: boolean;
  skipped: boolean;
  timeTaken: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface QuestionResponse {
  category: string;
  type: "multiple" | "boolean";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}
