export type SectionTab = 'intro' | 'lessons' | 'examples' | 'quiz' | 'lab' | 'printable';

export type WordType = 'noun' | 'verb' | 'particle';

export interface StoryCharacter {
  name: string;
  title: string;
  avatar: string;
  color: string;
  bgLight: string;
  badge: string;
  description: string;
  examples: string[];
}

export interface ParsedWord {
  word: string;
  vocalized: string;
  role: string;
  haraka: string;
  fullIerab: string;
  questionTip: string;
  color: string;
}

export interface ParsedSentenceExample {
  id: number;
  sentence: string;
  translationMeaning?: string;
  category: string;
  icon: string;
  words: ParsedWord[];
  simpleExplanation: string;
  memoryRule: string;
}

export interface MCQQuestion {
  id: number;
  question: string;
  sentence: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  targetRole: 'فاعل' | 'مفعول به' | 'فعل';
}

export interface DiacriticsQuestion {
  id: number;
  sentenceContext: string;
  targetWordBase: string; // e.g. "الوَلَد"
  options: {
    label: string;
    harakaName: string;
    symbol: string; // e.g. "ُ" or "َ"
    fullForm: string; // e.g. "الوَلَدُ"
    isCorrect: boolean;
  }[];
  role: string;
  explanation: string;
}

export interface ParsingExercise {
  id: number;
  sentence: string;
  targetWord: string;
  targetRoleLabel: string; // "إعراب كلمة: ..."
  optionsOrderTokens: string[]; // For interactive card order: ["فَاعِلٌ", "مَرْفُوعٌ", "وَعَلامَةُ", "رَفْعِهِ", "الضَّمَّةُ", "الظَّاهِرَةُ"]
  correctTokens: string[];
  modelAnswer: string;
  reasonTip: string;
}

export interface QuizResults {
  mcqScore: number;
  diacriticsScore: number;
  parsingScore: number;
  totalAnswered: number;
  completedAt?: string;
  studentName?: string;
}
