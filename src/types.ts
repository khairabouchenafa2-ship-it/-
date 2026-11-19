export type SectionTab = 'intro' | 'lessons' | 'examples' | 'quiz' | 'lab' | 'printable' | 'profile';

export type WordType = 'noun' | 'verb' | 'particle';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

export interface StudentProfile {
  name: string;
  avatar: string;
  grade: string;
  school: string;
  levelTitle: string;
  totalStars: number;
  mcqCompleted: number;
  diacriticsCompleted: number;
  parsingCompleted: number;
  wordHunterCompleted: number;
  dictionaryLookups: number;
  joinedDate: string;
  favoriteWord: string;
}

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
  targetWordBase: string;
  options: {
    label: string;
    harakaName: string;
    symbol: string;
    fullForm: string;
    isCorrect: boolean;
  }[];
  role: string;
  explanation: string;
}

export interface ParsingExercise {
  id: number;
  sentence: string;
  targetWord: string;
  targetRoleLabel: string;
  optionsOrderTokens: string[];
  correctTokens: string[];
  modelAnswer: string;
  reasonTip: string;
}

export interface WordHunterQuestion {
  id: number;
  prompt: string;
  targetRole: 'فاعل' | 'مفعول به' | 'فعل';
  words: {
    text: string;
    role: 'فاعل' | 'مفعول به' | 'فعل' | 'حرف' | 'اسم مجرور';
    isTarget: boolean;
    ierab: string;
  }[];
  explanation: string;
}

export interface ChallengeQuestion {
  id: string;
  sentence: string;
  question: string;
  targetRole: 'فاعل' | 'مفعول به' | 'تاء التأنيث' | 'تنوين الفتح';
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface MistakeItem {
  id: string;
  sourceLabel: string;
  sentence: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  resolved?: boolean;
}

export interface QuizResults {
  mcqScore: number;
  diacriticsScore: number;
  parsingScore: number;
  totalAnswered: number;
  completedAt?: string;
  studentName?: string;
}

export interface ProgressState {
  mcqAnswers: Record<number, string>;
  diacriticAnswers: Record<number, string>;
  parsingSelectedTokens: Record<number, string[]>;
  parsingRevealed: Record<number, boolean>;
  parsingSolved: Record<number, boolean>;
  wordHunterAnswers: Record<number, number>; // questionId -> chosen word index
  challengeSolvedCount: number;
  introWordChoices: Record<number, 'اسم' | 'فعل' | 'حرف'>;
  introSentenceChoice: 'فعلية' | 'اسمية' | null;
  lookedUpDictionaryIds: string[];
  awardedRewards: string[];
  mistakes: MistakeItem[];
}

export interface StudentAccount {
  id: string;
  profile: StudentProfile;
  starsCount: number;
  progress: ProgressState;
}

export interface DictionaryTerm {
  id: string;
  term: string;
  vocalized: string;
  lexicalCategory: string;
  icon: string;
  badge: string;
  color: string;
  shortDefinition: string;
  lexicalEntry: string;
  secretSigns: string[];
  magicQuestion?: string;
  vocalizedExamples: string[];
  ierabRule?: string;
  childTip: string;
}

export interface LabVerbItem {
  id: string;
  pastMasc: string;
  pastFem: string;
  pastFemBeforeAl: string; // e.g., أَكَلَتِ before "ال..."
  presentMasc: string;
  presentFem: string;
  icon: string;
  isTransitive: boolean;
  allowedObjectIds: string[];
}

export interface LabSubjectItem {
  id: string;
  vocalized: string;
  gender: 'masc' | 'fem';
  startsWithAl: boolean;
  icon: string;
}

export interface LabObjectItem {
  id: string;
  vocalized: string;
  icon: string;
}
