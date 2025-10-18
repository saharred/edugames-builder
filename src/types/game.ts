
export type Lang = 'ar' | 'en';
export type GameKind = 'quiz' | 'matching' | 'flashcards';

export type QuizItem = { id: string; question: string; answer: string };
export type MatchItem = { id: string; term: string; definition: string };
export type FlashItem = { id: string; textFront: string; textBack?: string };

export type GameProject = {
  title: string;
  lang: Lang;
  grade?: string;
  subject?: string;
  objective?: string;
  curriculumCode?: string;
  kind: GameKind;
  quizItems: QuizItem[];
  matchItems: MatchItem[];
  flashItems: FlashItem[];
};
