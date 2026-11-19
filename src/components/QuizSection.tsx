import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Award,
  RefreshCw,
  Trash2,
  AlertCircle,
  MousePointerClick,
  Zap,
  BookCheck,
} from 'lucide-react';
import {
  MCQ_QUESTIONS,
  DIACRITICS_QUESTIONS,
  PARSING_EXERCISES,
  WORD_HUNTER_QUESTIONS,
  CHALLENGE_QUESTIONS_POOL,
  MOTIVATIONAL_PHRASES,
} from '../data/curriculumData';
import { MistakeItem, ChallengeQuestion } from '../types';
import { sounds, speakArabic } from '../utils/audio';
import { MascotMessage } from './MascotMessage';
import { VocalizedWord } from './VocalizedWord';

interface QuizSectionProps {
  onEarnStar: (rewardId?: string) => void;
  onOpenCertificate: () => void;
  mcqAnswers: Record<number, string>;
  onSelectMCQ: (questionId: number, optionId: string) => void;
  onResetMCQ: () => void;
  diacriticAnswers: Record<number, string>;
  onSelectDiacritic: (qId: number, chosenLabel: string) => void;
  onResetDiacritics: () => void;
  parsingSelectedTokens: Record<number, string[]>;
  onUpdateParsingTokens: (exerciseId: number, tokens: string[]) => void;
  parsingRevealed: Record<number, boolean>;
  parsingSolved: Record<number, boolean>;
  onRevealParsing: (exerciseId: number, isExact: boolean) => void;
  onResetParsing: () => void;
  wordHunterAnswers: Record<number, number>;
  onSelectWordHunter: (questionId: number, wordIdx: number) => void;
  onResetWordHunter: () => void;
  onIncrementChallengeSolved: () => void;
  mistakes: MistakeItem[];
  onRecordMistake: (mistake: MistakeItem) => void;
  onResolveMistake: (mistakeId: string) => void;
}

const pickShuffledRound = (): ChallengeQuestion[] => {
  const copy = [...CHALLENGE_QUESTIONS_POOL];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 4);
};

export const QuizSection: React.FC<QuizSectionProps> = ({
  onEarnStar,
  onOpenCertificate,
  mcqAnswers,
  onSelectMCQ,
  onResetMCQ,
  diacriticAnswers,
  onSelectDiacritic,
  onResetDiacritics,
  parsingSelectedTokens,
  onUpdateParsingTokens,
  parsingRevealed,
  parsingSolved,
  onRevealParsing,
  onResetParsing,
  wordHunterAnswers,
  onSelectWordHunter,
  onResetWordHunter,
  onIncrementChallengeSolved,
  mistakes,
  onRecordMistake,
  onResolveMistake,
}) => {
  const [activePart, setActivePart] = useState<
    'mcq' | 'diacritics' | 'parsing' | 'hunter' | 'challenge' | 'mistakes'
  >('mcq');
  const [motivationalMessage, setMotivationalMessage] = useState<string | null>(null);
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ephemeral Challenge Round state (regenerates fresh rounds on demand)
  const [challengeRound, setChallengeRound] = useState<ChallengeQuestion[]>(() =>
    CHALLENGE_QUESTIONS_POOL.slice(0, 4)
  );
  const [challengeAnswers, setChallengeAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    return () => {
      if (bannerTimerRef.current) {
        clearTimeout(bannerTimerRef.current);
      }
    };
  }, []);

  const mcqScore = MCQ_QUESTIONS.filter((q) => {
    const chosenId = mcqAnswers[q.id];
    return q.options.some((opt) => opt.id === chosenId && opt.isCorrect);
  }).length;

  const diacriticScore = DIACRITICS_QUESTIONS.filter((q) => {
    const chosenLabel = diacriticAnswers[q.id];
    return q.options.some((opt) => opt.label === chosenLabel && opt.isCorrect);
  }).length;

  const parsingScore = PARSING_EXERCISES.filter((ex) => parsingSolved[ex.id]).length;

  const hunterScore = WORD_HUNTER_QUESTIONS.filter((q) => {
    const chosenIdx = wordHunterAnswers[q.id];
    return chosenIdx !== undefined && q.words[chosenIdx]?.isTarget;
  }).length;

  const unresolvedMistakes = mistakes.filter((m) => !m.resolved);

  const triggerCelebration = (rewardId?: string, message?: string) => {
    sounds.playCorrect();
    if (rewardId) {
      onEarnStar(rewardId);
    }

    const randomMsg =
      message ||
      MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
    setMotivationalMessage(randomMsg);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
    });

    if (bannerTimerRef.current) {
      clearTimeout(bannerTimerRef.current);
    }
    bannerTimerRef.current = setTimeout(() => {
      setMotivationalMessage(null);
      bannerTimerRef.current = null;
    }, 4500);
  };

  const handleSelectMCQ = (questionId: number, optionId: string, isCorrect: boolean) => {
    if (mcqAnswers[questionId]) return;

    sounds.playClick();
    onSelectMCQ(questionId, optionId);

    if (isCorrect) {
      triggerCelebration(`mcq-${questionId}`);
    } else {
      sounds.playWrong();
      const q = MCQ_QUESTIONS.find((item) => item.id === questionId);
      if (q) {
        const chosenText = q.options.find((o) => o.id === optionId)?.text || '';
        const correctText = q.options.find((o) => o.isCorrect)?.text || '';
        onRecordMistake({
          id: `mcq-${q.id}`,
          sourceLabel: 'اخْتِيَارٌ مِن مُتَعَدِّدٍ',
          sentence: q.question,
          userAnswer: chosenText,
          correctAnswer: correctText,
          explanation: q.explanation,
          resolved: false,
        });
      }
    }
  };

  const handleSelectDiacritic = (
    qId: number,
    chosenLabel: string,
    isCorrect: boolean
  ) => {
    if (diacriticAnswers[qId]) return;

    sounds.playClick();
    onSelectDiacritic(qId, chosenLabel);

    if (isCorrect) {
      triggerCelebration(`diacritic-${qId}`);
    } else {
      sounds.playWrong();
      const q = DIACRITICS_QUESTIONS.find((item) => item.id === qId);
      if (q) {
        const chosenOpt = q.options.find((o) => o.label === chosenLabel);
        const correctOpt = q.options.find((o) => o.isCorrect);
        onRecordMistake({
          id: `diacritic-${q.id}`,
          sourceLabel: 'ضَبْطُ الحَرَكَاتِ',
          sentence: q.sentenceContext.replace(`${q.targetWordBase}(؟)`, q.targetWordBase),
          userAnswer: chosenOpt?.fullForm || chosenLabel,
          correctAnswer: correctOpt?.fullForm || '',
          explanation: q.explanation,
          resolved: false,
        });
      }
    }
  };

  const handleToggleToken = (exerciseId: number, token: string) => {
    if (parsingSolved[exerciseId]) return;
    sounds.playClick();
    const current = parsingSelectedTokens[exerciseId] || [];
    if (current.includes(token)) {
      onUpdateParsingTokens(
        exerciseId,
        current.filter((t) => t !== token)
      );
    } else {
      onUpdateParsingTokens(exerciseId, [...current, token]);
    }
  };

  const handleClearTokens = (exerciseId: number) => {
    if (parsingSolved[exerciseId]) return;
    sounds.playClick();
    onUpdateParsingTokens(exerciseId, []);
  };

  const handleCheckParsingAnswer = (exerciseId: number, correctTokens: string[]) => {
    const userTokens = parsingSelectedTokens[exerciseId] || [];
    const isExact =
      userTokens.length === correctTokens.length &&
      userTokens.every((t, i) => t === correctTokens[i]);

    onRevealParsing(exerciseId, isExact);

    if (isExact) {
      triggerCelebration(
        `parsing-${exerciseId}`,
        'مُمْتَازٌ جِدّاً! إِعْرَابٌ كَامِلٌ وَصَحِيحٌ مِئَةً بِالمِئَةِ! 🏆'
      );
    } else {
      sounds.playWrong();
      const ex = PARSING_EXERCISES.find((item) => item.id === exerciseId);
      if (ex) {
        onRecordMistake({
          id: `parsing-${ex.id}`,
          sourceLabel: 'الإِعْرَابُ الكَامِلُ',
          sentence: ex.sentence,
          userAnswer: userTokens.join(' ') || '—',
          correctAnswer: ex.modelAnswer,
          explanation: ex.reasonTip,
          resolved: false,
        });
      }
    }
  };

  const handlePickHunterWord = (questionId: number, wordIdx: number) => {
    if (wordHunterAnswers[questionId] !== undefined) return;
    sounds.playClick();
    onSelectWordHunter(questionId, wordIdx);

    const q = WORD_HUNTER_QUESTIONS.find((item) => item.id === questionId);
    const chosenWord = q?.words[wordIdx];
    if (q && chosenWord) {
      if (chosenWord.isTarget) {
        triggerCelebration(
          `hunter-${questionId}`,
          'قَنَّاصٌ بَارِعٌ! عَثَرْتَ عَلَى الكَلِمَةِ الصَّحِيحَةِ فِي الجُمْلَةِ! 🎯'
        );
      } else {
        sounds.playWrong();
        const correctWord = q.words.find((w) => w.isTarget);
        onRecordMistake({
          id: `hunter-${q.id}`,
          sourceLabel: 'صَيَّادُ الكَلِمَاتِ',
          sentence: q.words.map((w) => w.text).join(' '),
          userAnswer: `${chosenWord.text} (${chosenWord.role})`,
          correctAnswer: correctWord ? `${correctWord.text} (${correctWord.role})` : '',
          explanation: q.explanation,
          resolved: false,
        });
      }
    }
  };

  const handleSelectChallenge = (q: ChallengeQuestion, chosen: string) => {
    if (challengeAnswers[q.id]) return;
    sounds.playClick();
    setChallengeAnswers((prev) => ({ ...prev, [q.id]: chosen }));

    if (chosen === q.correctAnswer) {
      onIncrementChallengeSolved();
      triggerCelebration(`challenge-${q.id}`);
    } else {
      sounds.playWrong();
      onRecordMistake({
        id: `challenge-${q.id}`,
        sourceLabel: 'تَحَدِّي الأَبْطَالِ',
        sentence: q.sentence,
        userAnswer: chosen,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        resolved: false,
      });
    }
  };

  const handleNewChallengeRound = () => {
    sounds.playClick();
    setChallengeAnswers({});
    setChallengeRound(pickShuffledRound());
  };

  const getVocalizedRoleLabel = (role: 'فاعل' | 'مفعول به' | 'فعل') => {
    if (role === 'فاعل') return 'فَاعِلٌ';
    if (role === 'مفعول به') return 'مَفْعُولٌ بِهِ';
    return 'فِعْلٌ';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Mascot cheer */}
      <MascotMessage
        message="مَرْحَباً بِكَ فِي مَيْدَانِ التَّحَدِّي وَالبُطُولَةِ! أَضَفْنَا لَكَ لُعْبَةَ «صَيَّادِ الكَلِمَاتِ» وَ«تَحَدِّي الأَبْطَالِ» المُتَجَدِّدِ، وَرُكْنَ «نُصْلِحُ مَعاً»!"
        subtext="حُلَّ التَّمَارِينَ لِتَجْمَعَ النُّجُومَ وَتُتْقِنَ الفَاعِلَ وَالمَفْعُولَ بِهِ قَبْلَ اسْتِخْرَاجِ الشَّهَادَةِ!"
        variant="amber"
        emotion="celebrating"
      />

      {/* Floating motivational cheer banner */}
      {motivationalMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-black text-base md:text-xl px-6 py-3.5 rounded-3xl shadow-2xl border-2 border-white animate-bounce flex items-center gap-2">
          <span>🎉</span>
          <span>{motivationalMessage}</span>
        </div>
      )}

      {/* Part Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => {
            sounds.playClick();
            setActivePart('mcq');
          }}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activePart === 'mcq'
              ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-300'
              : 'bg-white hover:bg-amber-50 text-stone-700 border border-stone-200'
          }`}
        >
          <span>🎯</span>
          <span>1. اخْتِيَارٌ مِن مُتَعَدِّدٍ</span>
          <span className="text-[11px] bg-white/20 px-1.5 py-0.5 rounded-full tabular-nums">
            {Object.keys(mcqAnswers).length}/5
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActivePart('diacritics');
          }}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activePart === 'diacritics'
              ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-300'
              : 'bg-white hover:bg-sky-50 text-stone-700 border border-stone-200'
          }`}
        >
          <span>⚖️</span>
          <span>2. مُخْتَبَرُ الحَرَكَاتِ</span>
          <span className="text-[11px] bg-white/20 px-1.5 py-0.5 rounded-full tabular-nums">
            {Object.keys(diacriticAnswers).length}/5
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActivePart('parsing');
          }}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activePart === 'parsing'
              ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-300'
              : 'bg-white hover:bg-purple-50 text-stone-700 border border-stone-200'
          }`}
        >
          <span>📜</span>
          <span>3. الإِعْرَابُ الكَامِلُ</span>
          <span className="text-[11px] bg-white/20 px-1.5 py-0.5 rounded-full tabular-nums">
            {parsingScore}/3
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActivePart('hunter');
          }}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activePart === 'hunter'
              ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
              : 'bg-white hover:bg-emerald-50 text-stone-700 border border-stone-200'
          }`}
        >
          <MousePointerClick size={16} />
          <span>4. صَيَّادُ الكَلِمَاتِ</span>
          <span className="text-[11px] bg-white/20 px-1.5 py-0.5 rounded-full tabular-nums">
            {Object.keys(wordHunterAnswers).length}/5
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActivePart('challenge');
          }}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activePart === 'challenge'
              ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
              : 'bg-white hover:bg-indigo-50 text-stone-700 border border-stone-200'
          }`}
        >
          <Zap size={16} />
          <span>5. تَحَدِّي الأَبْطَالِ</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActivePart('mistakes');
          }}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activePart === 'mistakes'
              ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-300'
              : 'bg-white hover:bg-rose-50 text-stone-700 border border-stone-200'
          }`}
        >
          <BookCheck size={16} />
          <span>نُصْلِحُ مَعاً</span>
          {unresolvedMistakes.length > 0 && (
            <span className="text-[11px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full tabular-nums">
              {unresolvedMistakes.length}
            </span>
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* PART 1: 5 MCQs                                           */}
      {/* ======================================================== */}
      {activePart === 'mcq' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-amber-800">
                  الجُزْءُ الأَوَّلُ · اخْتِيَارٌ مِن مُتَعَدِّدٍ
                </span>
                <h3 className="text-xl md:text-2xl font-black text-stone-900 mt-1">
                  اسْتِخْرَاجُ الفَاعِلِ أَوِ المَفْعُولِ بِهِ
                </h3>
                <p className="text-xs md:text-sm text-stone-500 font-medium">
                  اقْرَأِ الجُمْلَةَ بِعِنَايَةٍ، ثُمَّ اخْتَرِ الإِجَابَةَ الصَّحِيحَةَ.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-amber-950 bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300 tabular-nums">
                  النَّتِيجَةُ: {mcqScore} / 5 ⭐
                </span>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onResetMCQ();
                  }}
                  className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 cursor-pointer"
                  title="إعادة المحاولة للتدرب"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {MCQ_QUESTIONS.map((q, idx) => {
                const chosenOptionId = mcqAnswers[q.id];
                const isAnswered = Boolean(chosenOptionId);

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-stone-50/70 border-2 border-stone-200 space-y-3.5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="text-base md:text-lg font-black text-stone-900">
                          {q.question}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-stone-600 bg-white px-2.5 py-0.5 rounded-lg border border-stone-200 flex-shrink-0">
                        {getVocalizedRoleLabel(q.targetRole)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {q.options.map((opt) => {
                        const isChosen = chosenOptionId === opt.id;
                        let btnStyle =
                          'bg-white hover:bg-amber-50 text-stone-800 border-stone-200 hover:border-amber-300';

                        if (isAnswered) {
                          if (opt.isCorrect) {
                            btnStyle =
                              'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-300';
                          } else if (isChosen && !opt.isCorrect) {
                            btnStyle = 'bg-rose-500 text-white border-rose-600';
                          } else {
                            btnStyle = 'bg-stone-100 text-stone-400 border-stone-200 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            disabled={isAnswered}
                            onClick={() => handleSelectMCQ(q.id, opt.id, opt.isCorrect)}
                            className={`p-3 rounded-xl border-2 font-black text-sm md:text-base flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                          >
                            <span>{opt.text}</span>
                            {isAnswered && opt.isCorrect && <CheckCircle2 size={18} />}
                            {isAnswered && isChosen && !opt.isCorrect && <XCircle size={18} />}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs md:text-sm text-stone-800 font-medium space-y-1">
                        <div className="flex items-center gap-1 font-black text-amber-900">
                          <Sparkles size={14} />
                          <span>الشَّرْحُ النَّحْوِيُّ المُبَسَّطُ:</span>
                        </div>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PART 2: 5 Diacritics Questions                           */}
      {/* ======================================================== */}
      {activePart === 'diacritics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-sky-200 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-sky-800">
                  الجُزْءُ الثَّانِي · مُخْتَبَرُ الحَرَكَاتِ
                </span>
                <h3 className="text-xl md:text-2xl font-black text-stone-900 mt-1">
                  مَلْءُ الفَرَاغِ بِالحَرَكَةِ المُنَاسِبَةِ: الضَّمَّةُ ( ُ ) أَوِ الفَتْحَةُ ( َ )
                </h3>
                <p className="text-xs md:text-sm text-stone-500 font-medium">
                  حَدِّدْ: هَلِ الكَلِمَةُ فَاعِلٌ نَرْفَعُهَا بِالضَّمَّةِ ُ أَمْ مَفْعُولٌ بِهِ نَنْصِبُهُ بِالفَتْحَةِ َ ؟
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-sky-950 bg-sky-100 px-3 py-1.5 rounded-xl border border-sky-300 tabular-nums">
                  النَّتِيجَةُ: {diacriticScore} / 5 ⭐
                </span>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onResetDiacritics();
                  }}
                  className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 cursor-pointer"
                  title="إعادة المحاولة للتدرب"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {DIACRITICS_QUESTIONS.map((q, idx) => {
                const chosen = diacriticAnswers[q.id];
                const isAnswered = Boolean(chosen);
                const chosenOption = q.options.find((opt) => opt.label === chosen);
                const renderedSentence = chosenOption
                  ? q.sentenceContext.replace(`${q.targetWordBase}(؟)`, chosenOption.fullForm)
                  : q.sentenceContext;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-stone-50/70 border-2 border-stone-200 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-sky-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <div className="text-lg md:text-xl font-black text-stone-900">
                          {renderedSentence}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-stone-600 bg-white px-2 py-1 rounded-lg border border-stone-200 self-start sm:self-auto">
                        المَطْلُوبُ: ضَبْطُ كَلِمَةِ «{q.targetWordBase}»
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt) => {
                        const isChosen = chosen === opt.label;
                        let btnStyle =
                          'bg-white hover:bg-sky-50 text-stone-800 border-stone-200 hover:border-sky-300';

                        if (isAnswered) {
                          if (opt.isCorrect) {
                            btnStyle =
                              'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-300';
                          } else if (isChosen && !opt.isCorrect) {
                            btnStyle = 'bg-rose-500 text-white border-rose-600';
                          } else {
                            btnStyle = 'bg-stone-100 text-stone-400 border-stone-200 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={opt.label}
                            disabled={isAnswered}
                            onClick={() => handleSelectDiacritic(q.id, opt.label, opt.isCorrect)}
                            className={`p-3.5 rounded-2xl border-2 font-black text-base flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                                {opt.symbol}
                              </span>
                              <span>{opt.label}</span>
                            </div>
                            <span className="text-lg underline decoration-sky-400">
                              «
                              <VocalizedWord
                                word={opt.fullForm}
                                highlightClassName={
                                  isAnswered && (opt.isCorrect || isChosen)
                                    ? 'text-yellow-200'
                                    : 'text-rose-600'
                                }
                              />
                              »
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs md:text-sm text-stone-800 font-medium space-y-1">
                        <div className="flex items-center gap-1 font-black text-sky-900">
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          <span>التَّعْلِيلُ:</span>
                        </div>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PART 3: 3 Full Parsing Challenges                        */}
      {/* ======================================================== */}
      {activePart === 'parsing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-purple-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-purple-800">
                  الجُزْءُ الثَّالِثُ · وَرْشَةُ الإِعْرَابِ الكَامِلِ
                </span>
                <h3 className="text-xl md:text-2xl font-black text-stone-900 mt-1">
                  إِعْرَابُ 3 جُمَلٍ بَسِيطَةٍ كَامِلاً مَعَ النَّمُوذَجِ الصَّائِبِ
                </h3>
                <p className="text-xs md:text-sm text-stone-500 font-medium">
                  رَتِّبْ بِطَاقَاتِ الإِعْرَابِ بِالتَّسَلْسُلِ الصَّحِيحِ، ثُمَّ تَأَكَّدْ مِنَ المُطَابَقَةِ مَعَ النَّمُوذَجِ!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-purple-950 bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-300 tabular-nums">
                  المُتْقَنُ: {parsingScore} / 3 ⭐
                </span>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onResetParsing();
                  }}
                  className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 cursor-pointer"
                  title="إعادة المحاولة للتدرب"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {PARSING_EXERCISES.map((ex, idx) => {
                const isRevealed = Boolean(parsingRevealed[ex.id]);
                const isSolved = Boolean(parsingSolved[ex.id]);
                const selected = parsingSelectedTokens[ex.id] || [];

                return (
                  <div
                    key={ex.id}
                    className={`p-6 rounded-3xl border-2 space-y-4 ${
                      isSolved
                        ? 'bg-emerald-50/40 border-emerald-300'
                        : 'bg-purple-50/40 border-purple-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full text-white font-black text-sm flex items-center justify-center ${
                            isSolved ? 'bg-emerald-600' : 'bg-purple-600'
                          }`}
                        >
                          {isSolved ? '✓' : idx + 1}
                        </span>
                        <div>
                          <div className="text-2xl font-black text-stone-900">{ex.sentence}</div>
                          <span className="text-xs font-bold text-purple-800">
                            {ex.targetRoleLabel}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          sounds.playClick();
                          speakArabic(`${ex.sentence}. ${ex.modelAnswer}`);
                        }}
                        className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 hover:bg-stone-100 cursor-pointer"
                      >
                        <span>🔊</span>
                        <span>اسْتَمِعْ</span>
                      </button>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-stone-600 mb-2 block">
                        اخْتَرِ الكَلِمَاتِ الإِعْرَابِيَّةَ بِالتَّرْتِيبِ الصَّحِيحِ:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {ex.optionsOrderTokens.map((token, tIdx) => {
                          const isPicked = selected.includes(token);
                          return (
                            <button
                              key={`${token}-${tIdx}`}
                              disabled={isSolved}
                              onClick={() => handleToggleToken(ex.id, token)}
                              className={`px-3 py-1.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
                                isPicked
                                  ? 'bg-purple-600 text-white shadow-xs scale-105'
                                  : 'bg-white hover:bg-purple-100 text-stone-800 border border-stone-300'
                              }`}
                            >
                              {token}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border-2 border-stone-200 min-h-[54px] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-stone-400">إِعْرَابُكَ:</span>
                        {selected.length === 0 ? (
                          <span className="text-xs text-stone-400 italic">
                            (انْقُرْ فَوْقَ الكَلِمَاتِ فِي الأَعْلَى لِتَرْكِيبِ الإِعْرَابِ)
                          </span>
                        ) : (
                          selected.map((t, i) => (
                            <button
                              key={`${t}-${i}`}
                              type="button"
                              disabled={isSolved}
                              onClick={() => handleToggleToken(ex.id, t)}
                              className="px-2.5 py-0.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-950 font-black text-sm transition-colors cursor-pointer"
                              title={isSolved ? undefined : 'انقر لإزالة هذه الكلمة'}
                            >
                              {t}
                            </button>
                          ))
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {!isSolved && selected.length > 0 && (
                          <button
                            onClick={() => handleClearTokens(ex.id)}
                            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="مسح الترتيب وإعادة البدء"
                          >
                            <Trash2 size={14} />
                            <span>مَسْحٌ</span>
                          </button>
                        )}
                        <button
                          disabled={isSolved || selected.length === 0}
                          onClick={() => handleCheckParsingAnswer(ex.id, ex.correctTokens)}
                          className={`px-4 py-1.5 rounded-xl font-black text-xs shadow-xs transition-all cursor-pointer ${
                            isSolved
                              ? 'bg-emerald-100 text-emerald-800 cursor-default'
                              : selected.length === 0
                              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {isSolved
                            ? 'تَمَّ الإِعْرَابُ بِنَجَاحٍ ✓'
                            : 'تَحَقَّقْ مِنَ التَّرْتِيبِ ✨'}
                        </button>
                      </div>
                    </div>

                    {isRevealed && (
                      <div
                        className={`p-4 rounded-2xl border-2 space-y-2 animate-fadeIn ${
                          isSolved
                            ? 'bg-emerald-50 border-emerald-300'
                            : 'bg-amber-50 border-amber-300'
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 font-black text-sm ${
                            isSolved ? 'text-emerald-900' : 'text-amber-950'
                          }`}
                        >
                          {isSolved ? (
                            <>
                              <CheckCircle2 size={18} className="text-emerald-600" />
                              <span>أَحْسَنْتَ! طَابَقَتْ إِجَابَتُكَ النَّمُوذَجَ الصَّائِبَ تَمَاماً:</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle size={18} className="text-amber-600" />
                              <span>
                                تَرْتِيبُكَ يَحْتَاجُ تَصْحِيحاً! قَارِنْهُ بِالنَّمُوذَجِ الصَّائِبِ وَأَعِدِ التَّرْتِيبَ:
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-base md:text-lg font-black text-stone-900 py-1 px-3 bg-white rounded-xl border border-emerald-200 shadow-xs">
                          {ex.modelAnswer}
                        </p>
                        <p className="text-xs text-stone-600 font-medium">
                          💡 <span className="font-bold text-stone-800">التَّعْلِيلُ:</span>{' '}
                          {ex.reasonTip}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PART 4: WORD HUNTER (انقر على الكلمة داخل الجملة)        */}
      {/* ======================================================== */}
      {activePart === 'hunter' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-emerald-800">
                  الجُزْءُ الرَّابِعُ · لُعْبَةُ صَيَّادِ الكَلِمَاتِ
                </span>
                <h3 className="text-xl md:text-2xl font-black text-stone-900 mt-1">
                  انْقُرْ مُبَاشَرَةً عَلَى الكَلِمَةِ المَطْلُوبَةِ دَاخِلَ الجُمْلَةِ!
                </h3>
                <p className="text-xs md:text-sm text-stone-500 font-medium">
                  كُلُّ كَلِمَةٍ فِي الجُمْلَةِ زِرٌّ تَفَاعُلِيٌّ — اصطَدِ الفَاعِلَ أَوِ المَفْعُولَ بِهِ أَوِ الفِعْلَ بِنَقْرَةٍ وَاحِدَةٍ!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-emerald-950 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 tabular-nums">
                  النَّتِيجَةُ: {hunterScore} / 5 ⭐
                </span>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onResetWordHunter();
                  }}
                  className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 cursor-pointer"
                  title="إعادة المحاولة"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {WORD_HUNTER_QUESTIONS.map((q, idx) => {
                const chosenIdx = wordHunterAnswers[q.id];
                const isAnswered = chosenIdx !== undefined;
                const chosenWord = isAnswered ? q.words[chosenIdx] : null;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-emerald-50/40 border-2 border-emerald-200 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="text-base md:text-lg font-black text-stone-900">
                          {q.prompt}
                        </h4>
                      </div>

                      <button
                        onClick={() => {
                          sounds.playClick();
                          speakArabic(q.words.map((w) => w.text).join(' '));
                        }}
                        className="px-3 py-1 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-100 cursor-pointer"
                      >
                        🔊 نُطْقُ الجُمْلَةِ
                      </button>
                    </div>

                    {/* Interactive Sentence Words */}
                    <div className="p-4 rounded-2xl bg-white border border-emerald-200 flex flex-wrap items-center justify-center gap-3">
                      {q.words.map((w, wIdx) => {
                        const isPicked = chosenIdx === wIdx;
                        let wordBtnClass =
                          'bg-stone-50 hover:bg-amber-100 text-stone-900 border-stone-300 hover:border-amber-400';

                        if (isAnswered) {
                          if (w.isTarget) {
                            wordBtnClass =
                              'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300';
                          } else if (isPicked && !w.isTarget) {
                            wordBtnClass = 'bg-rose-500 text-white border-rose-600';
                          } else {
                            wordBtnClass = 'bg-stone-100 text-stone-500 border-stone-200';
                          }
                        }

                        return (
                          <button
                            key={`${q.id}-${w.text}-${wIdx}`}
                            disabled={isAnswered}
                            onClick={() => handlePickHunterWord(q.id, wIdx)}
                            className={`px-5 py-3 rounded-2xl border-2 text-2xl md:text-3xl font-black transition-all cursor-pointer flex flex-col items-center gap-1 ${wordBtnClass}`}
                          >
                            <VocalizedWord
                              word={w.text}
                              highlightClassName={
                                isAnswered && (w.isTarget || isPicked)
                                  ? 'text-yellow-200'
                                  : 'text-rose-600'
                              }
                            />
                            {isAnswered && (
                              <span className="text-[11px] font-bold opacity-90">{w.role}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div
                        className={`p-3.5 rounded-xl border text-xs md:text-sm font-medium space-y-1 ${
                          chosenWord?.isTarget
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                            : 'bg-amber-50 border-amber-200 text-stone-800'
                        }`}
                      >
                        <div className="font-black">
                          {chosenWord?.isTarget ? '✅ إِصَابَةٌ مُمْتَازَةٌ!' : '💡 تَوْضِيحٌ مُفِيدٌ:'}
                        </div>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PART 5: CHALLENGE ROUND (تحدي الأبطال المتجدد)           */}
      {/* ======================================================== */}
      {activePart === 'challenge' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-indigo-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-indigo-800">
                  الجُزْءُ الخَامِسُ · المُسْتَوَى الثَّانِي المُتَجَدِّدُ
                </span>
                <h3 className="text-xl md:text-2xl font-black text-stone-900 mt-1">
                  تَحَدِّي الأَبْطَالِ (تَاءُ التَّأْنِيثِ، تَنْوِينُ الفَتْحِ، وَاللَّازِمُ)
                </h3>
                <p className="text-xs md:text-sm text-stone-500 font-medium">
                  جَوَلَاتٌ مُتَجَدِّدَةٌ لَا تَنْتَهِي؛ اضْغَطْ «جَوْلَةٌ جَدِيدَةٌ» لِتَتَدَرَّبَ عَلَى جُمَلٍ جَدِيدَةٍ فِي كُلِّ مَرَّةٍ!
                </p>
              </div>

              <button
                onClick={handleNewChallengeRound}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs md:text-sm shadow-sm cursor-pointer transition-all"
              >
                <RefreshCw size={15} />
                <span>تَوْلِيدُ جَوْلَةٍ جَدِيدَةٍ</span>
              </button>
            </div>

            <div className="space-y-5">
              {challengeRound.map((q, idx) => {
                const chosen = challengeAnswers[q.id];
                const isAnswered = Boolean(chosen);

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-indigo-50/40 border-2 border-indigo-200 space-y-3.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xl md:text-2xl font-black text-indigo-950">
                          {q.sentence}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-indigo-800 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200">
                        {q.targetRole}
                      </span>
                    </div>

                    <p className="text-sm md:text-base font-black text-stone-800">{q.question}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {q.options.map((opt) => {
                        const isChosen = chosen === opt;
                        const isRight = opt === q.correctAnswer;
                        let style =
                          'bg-white hover:bg-indigo-50 text-stone-800 border-stone-200 hover:border-indigo-300';

                        if (isAnswered) {
                          if (isRight) {
                            style = 'bg-emerald-600 text-white border-emerald-700 shadow-sm';
                          } else if (isChosen) {
                            style = 'bg-rose-500 text-white border-rose-600';
                          } else {
                            style = 'bg-stone-100 text-stone-400 border-stone-200 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={opt}
                            disabled={isAnswered}
                            onClick={() => handleSelectChallenge(q, opt)}
                            className={`p-3 rounded-xl border-2 font-black text-xs md:text-sm text-right flex items-center justify-between transition-all cursor-pointer ${style}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && isRight && <CheckCircle2 size={16} />}
                            {isAnswered && isChosen && !isRight && <XCircle size={16} />}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="p-3.5 rounded-xl bg-white border border-indigo-200 text-xs md:text-sm text-stone-800 font-medium">
                        <span className="font-black text-indigo-900">التَّوْضِيحُ: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PART 6: MISTAKES REVIEW (نصلح معاً)                      */}
      {/* ======================================================== */}
      {activePart === 'mistakes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-rose-200 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-rose-800">
                  مُرَاجَعَةُ التَّعَلُّمِ · نُصْلِحُ مَعاً
                </span>
                <h3 className="text-xl md:text-2xl font-black text-stone-900 mt-1">
                  الأَسْئِلَةُ الَّتِي أَخْطَأْتَ فِيهَا وَقَاعِدَتُهَا الصَّحِيحَةُ
                </h3>
                <p className="text-xs md:text-sm text-stone-500 font-medium">
                  مِنَ الأَخْطَاءِ نَتَعَلَّمُ وَنَصِيرُ أَبْطَالاً! رَاجِعْ كُلَّ جُمْلَةٍ ثُمَّ اضْغَطْ «فَهِمْتُهَا الآنَ».
                </p>
              </div>
              <span className="text-xs font-black text-rose-900 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 tabular-nums">
                قَيْدَ المُرَاجَعَةِ: {unresolvedMistakes.length}
              </span>
            </div>

            {unresolvedMistakes.length === 0 ? (
              <div className="p-10 rounded-3xl bg-emerald-50/70 border-2 border-dashed border-emerald-300 text-center space-y-2">
                <span className="text-4xl block">🌟</span>
                <h4 className="text-lg font-black text-emerald-950">
                  سِجِلُّكَ نَظِيفٌ وَخَالٍ مِنَ الأَخْطَاءِ!
                </h4>
                <p className="text-xs md:text-sm text-stone-600 font-medium">
                  كُلَّمَا تَعَرَّضْتَ لِسُؤَالٍ صَعْبٍ فِي أَيِّ تَمْرِينٍ، سَيَحْفَظُهُ الأُسْتَاذُ فَصِيح هُنَا لِتُرَاجِعَهُ مَعَهُ.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {unresolvedMistakes.map((m) => (
                  <div
                    key={m.id}
                    className="p-5 rounded-2xl bg-rose-50/50 border-2 border-rose-200 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-black text-rose-900">{m.sourceLabel}</span>
                      <button
                        onClick={() => {
                          sounds.playCorrect();
                          onResolveMistake(m.id);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <CheckCircle2 size={14} />
                        <span>فَهِمْتُهَا الآنَ ✓</span>
                      </button>
                    </div>

                    <div className="text-lg font-black text-stone-900">{m.sentence}</div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs md:text-sm">
                      <div className="p-2.5 rounded-xl bg-white border border-rose-200">
                        <span className="font-bold text-rose-700 block">إِجَابَتُكَ السَّابِقَةُ:</span>
                        <span className="font-black text-stone-700">{m.userAnswer}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-emerald-300">
                        <span className="font-bold text-emerald-700 block">الإِجَابَةُ الصَّحِيحَةُ:</span>
                        <span className="font-black text-emerald-950">{m.correctAnswer}</span>
                      </div>
                    </div>

                    <p className="text-xs md:text-sm text-stone-700 font-medium bg-white p-3 rounded-xl border border-stone-200">
                      💡 <span className="font-black text-amber-900">الشَّرْحُ: </span>
                      {m.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certificate Call-to-Action */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-right">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Award size={28} className="text-yellow-200" />
            <h3 className="text-xl md:text-2xl font-black">أَنْتَ الآنَ بَطَلٌ فِي الإِعْرَابِ!</h3>
          </div>
          <p className="text-sm text-amber-100 font-medium">
            اطْبَعْ شَهَادَتَكَ الفَخْرِيَّةَ بِاسْمِكَ أَوْ شَارِكْهَا مَعَ مُعَلِّمِكَ وَعَائِلَتِكَ!
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playFanfare();
            onOpenCertificate();
          }}
          className="px-6 py-3 rounded-2xl bg-white hover:bg-amber-50 text-amber-900 font-black text-base shadow-md transition-all cursor-pointer hover:scale-105"
        >
          🎓 عَرْضُ شَهَادَةِ التَّفَوُّقِ
        </button>
      </div>
    </div>
  );
};
