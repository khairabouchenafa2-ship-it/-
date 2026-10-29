import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Check,
  RefreshCw,
} from 'lucide-react';
import {
  MCQ_QUESTIONS,
  DIACRITICS_QUESTIONS,
  PARSING_EXERCISES,
  MOTIVATIONAL_PHRASES,
} from '../data/curriculumData';
import { sounds, speakArabic } from '../utils/audio';
import { MascotMessage } from './MascotMessage';

interface QuizSectionProps {
  onEarnStar: () => void;
  onOpenCertificate: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ onEarnStar, onOpenCertificate }) => {
  const [activePart, setActivePart] = useState<'mcq' | 'diacritics' | 'parsing'>('mcq');

  // Part 1 State: MCQs
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>({});
  const [mcqScore, setMcqScore] = useState<number>(0);

  // Part 2 State: Diacritics
  const [diacriticAnswers, setDiacriticAnswers] = useState<Record<number, string>>({});
  const [diacriticScore, setDiacriticScore] = useState<number>(0);

  // Part 3 State: Full Parsing card builder & reveal
  const [parsingSelectedTokens, setParsingSelectedTokens] = useState<Record<number, string[]>>({
    1: [],
    2: [],
    3: [],
  });
  const [parsingRevealed, setParsingRevealed] = useState<Record<number, boolean>>({});

  // Active Motivational Banner
  const [motivationalMessage, setMotivationalMessage] = useState<string | null>(null);

  const triggerCelebration = (message?: string) => {
    sounds.playCorrect();
    onEarnStar();

    const randomMsg =
      message ||
      MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
    setMotivationalMessage(randomMsg);

    // Fire confetti bursts
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
    });

    setTimeout(() => {
      setMotivationalMessage(null);
    }, 4500);
  };

  // MCQ answer handler
  const handleSelectMCQ = (questionId: number, optionId: string, isCorrect: boolean) => {
    if (mcqAnswers[questionId]) return; // already answered

    sounds.playClick();
    setMcqAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    if (isCorrect) {
      setMcqScore((prev) => prev + 1);
      triggerCelebration();
    } else {
      sounds.playWrong();
    }
  };

  // Diacritics answer handler
  const handleSelectDiacritic = (
    qId: number,
    chosenLabel: string,
    isCorrect: boolean
  ) => {
    if (diacriticAnswers[qId]) return;

    sounds.playClick();
    setDiacriticAnswers((prev) => ({ ...prev, [qId]: chosenLabel }));

    if (isCorrect) {
      setDiacriticScore((prev) => prev + 1);
      triggerCelebration();
    } else {
      sounds.playWrong();
    }
  };

  // Parsing card token toggle
  const handleToggleToken = (exerciseId: number, token: string) => {
    sounds.playClick();
    setParsingSelectedTokens((prev) => {
      const current = prev[exerciseId] || [];
      if (current.includes(token)) {
        return {
          ...prev,
          [exerciseId]: current.filter((t) => t !== token),
        };
      } else {
        return {
          ...prev,
          [exerciseId]: [...current, token],
        };
      }
    });
  };

  const handleCheckParsingAnswer = (exerciseId: number, correctTokens: string[]) => {
    const userTokens = parsingSelectedTokens[exerciseId] || [];
    const isExact =
      userTokens.length === correctTokens.length &&
      userTokens.every((t, i) => t === correctTokens[i]);

    setParsingRevealed((prev) => ({ ...prev, [exerciseId]: true }));

    if (isExact) {
      triggerCelebration('مُمْتَازٌ جِدّاً! إِعْرَابٌ كَامِلٌ وَصَحِيحٌ مِئَةً بِالمِئَةِ! 🏆');
    } else {
      sounds.playCorrect(); // still encourage for trying!
    }
  };

  const resetPart = (part: 'mcq' | 'diacritics' | 'parsing') => {
    sounds.playClick();
    if (part === 'mcq') {
      setMcqAnswers({});
      setMcqScore(0);
    } else if (part === 'diacritics') {
      setDiacriticAnswers({});
      setDiacriticScore(0);
    } else {
      setParsingSelectedTokens({ 1: [], 2: [], 3: [] });
      setParsingRevealed({});
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Mascot cheer */}
      <MascotMessage
        message="مَرْحَباً بِكَ فِي مَيْدَانِ التَّحَدِّي وَالبُطُولَةِ! لَدَيْنَا هُنَا 3 أَقْسَامٍ مُشَوِّقَةٍ لِلتَّطْبِيقِ!"
        subtext="حُلَّ التَّمَارِينَ لِتَجْمَعَ النُّجُومَ وَتَحْصُلَ عَلَى شَهَادَةِ «بَطَلِ الإِعْرَابِ» المُمَيَّزَةِ!"
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

      {/* Part Navigation Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => {
            sounds.playClick();
            setActivePart('mcq');
          }}
          className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activePart === 'mcq'
              ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-300'
              : 'bg-white hover:bg-amber-50 text-stone-700 border border-stone-200'
          }`}
        >
          <span>🎯</span>
          <span>الجُزْءُ 1: اخْتِيَارٌ مِن مُتَعَدِّدٍ (5)</span>
          <span className="text-[11px] bg-white/20 px-1.5 py-0.5 rounded-full">
            {Object.keys(mcqAnswers).length}/5
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActivePart('diacritics');
          }}
          className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activePart === 'diacritics'
              ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-300'
              : 'bg-white hover:bg-sky-50 text-stone-700 border border-stone-200'
          }`}
        >
          <span>⚖️</span>
          <span>الجُزْءُ 2: مُخْتَبَرُ الحَرَكَاتِ (5)</span>
          <span className="text-[11px] bg-white/20 px-1.5 py-0.5 rounded-full">
            {Object.keys(diacriticAnswers).length}/5
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActivePart('parsing');
          }}
          className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activePart === 'parsing'
              ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-300'
              : 'bg-white hover:bg-purple-50 text-stone-700 border border-stone-200'
          }`}
        >
          <span>📜</span>
          <span>الجُزْءُ 3: وَرْشَةُ الإِعْرَابِ الكَامِلِ (3)</span>
          <span className="text-[11px] bg-white/20 px-1.5 py-0.5 rounded-full">
            {Object.keys(parsingRevealed).length}/3
          </span>
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
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  الجُزْءُ الأَوَّلُ: اخْتِيَارٌ مِن مُتَعَدِّدٍ
                </span>
                <h3 className="text-xl md:text-2xl font-black text-stone-900 mt-1">
                  اسْتِخْرَاجُ الفَاعِلِ أَوِ المَفْعُولِ بِهِ
                </h3>
                <p className="text-xs md:text-sm text-stone-500 font-medium">
                  اقْرَأِ الجُمْلَةَ بِعِنَايَةٍ، ثُمَّ اخْتَرِ الإِجَابَةَ الصَّحِيحَةَ.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-amber-950 bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300">
                  النَّتِيجَةُ: {mcqScore} / 5 ⭐
                </span>
                <button
                  onClick={() => resetPart('mcq')}
                  className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200"
                  title="إعادة المحاولة"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* MCQ List */}
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
                        <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="text-base md:text-lg font-black text-stone-900">
                          {q.question}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-stone-500 bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                        {q.targetRole}
                      </span>
                    </div>

                    {/* Options Buttons */}
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

                    {/* Feedback & Explanation */}
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
      {/* PART 2: 5 Diacritics Questions (ملء الفراغ بالحركة)     */}
      {/* ======================================================== */}
      {activePart === 'diacritics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-sky-200 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                  الجُزْءُ الثَّانِي: مُخْتَبَرُ الحَرَكَاتِ
                </span>
                <h3 className="text-xl md:text-2xl font-black text-stone-900 mt-1">
                  مَلْءُ الفَرَاغِ بِالحَرَكَةِ المُنَاسِبَةِ: الضَّمَّةُ ( ُ ) أَوِ الفَتْحَةُ ( َ )
                </h3>
                <p className="text-xs md:text-sm text-stone-500 font-medium">
                  حَدِّدْ: هَلِ الكَلِمَةُ فَاعِلٌ نَرْفَعُهَا بِالضَّمَّةِ ُ أَمْ مَفْعُولٌ بِهِ نَنْصِبُهُ بِالفَتْحَةِ َ ؟
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-sky-950 bg-sky-100 px-3 py-1.5 rounded-xl border border-sky-300">
                  النَّتِيجَةُ: {diacriticScore} / 5 ⭐
                </span>
                <button
                  onClick={() => resetPart('diacritics')}
                  className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200"
                  title="إعادة المحاولة"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* Questions list */}
            <div className="space-y-5">
              {DIACRITICS_QUESTIONS.map((q, idx) => {
                const chosen = diacriticAnswers[q.id];
                const isAnswered = Boolean(chosen);

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-stone-50/70 border-2 border-stone-200 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-sky-600 text-white font-black text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div className="text-lg md:text-xl font-black text-stone-900">
                          {q.sentenceContext}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-stone-600 bg-white px-2 py-1 rounded-lg border border-stone-200 self-start sm:self-auto">
                        المَطْلُوبُ: ضَبْطُ كَلِمَةِ «{q.targetWordBase}»
                      </span>
                    </div>

                    {/* Diacritics options */}
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
                              «{opt.fullForm}»
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
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
      {/* PART 3: 3 Full Parsing Challenges                         */}
      {/* ======================================================== */}
      {activePart === 'parsing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-purple-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  الجُزْءُ الثَّالِثُ: وَرْشَةُ الإِعْرَابِ الكَامِلِ
                </span>
                <h3 className="text-xl md:text-2xl font-black text-stone-900 mt-1">
                  إِعْرَابُ 3 جُمَلٍ بَسِيطَةٍ كَامِلاً مَعَ النَّمُوذَجِ الصَّائِبِ
                </h3>
                <p className="text-xs md:text-sm text-stone-500 font-medium">
                  رَتِّبْ بِطَاقَاتِ الإِعْرَابِ لِتَرْكِيبِ الإِعْرَابِ النَّمُوذَجِيِّ، ثُمَّ تَأَكَّدْ مِنَ الإِجَابَةِ الصَّحِيحَةِ!
                </p>
              </div>

              <button
                onClick={() => resetPart('parsing')}
                className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200"
                title="إعادة المحاولة"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {/* Parsing exercises */}
            <div className="space-y-6">
              {PARSING_EXERCISES.map((ex, idx) => {
                const isRevealed = parsingRevealed[ex.id];
                const selected = parsingSelectedTokens[ex.id] || [];

                return (
                  <div
                    key={ex.id}
                    className="p-6 rounded-3xl bg-purple-50/40 border-2 border-purple-200 space-y-4"
                  >
                    {/* Sentence title */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-2xl font-black text-stone-900">
                            {ex.sentence}
                          </div>
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
                        className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 hover:bg-stone-100"
                      >
                        <span>🔊</span>
                        <span>اسْتَمِعْ</span>
                      </button>
                    </div>

                    {/* Word tokens to click/assemble */}
                    <div>
                      <span className="text-xs font-bold text-stone-600 mb-2 block">
                        اخْتَرِ الكَلِمَاتِ الإِعْرَابِيَّةَ بِالتَّرْتِيبِ:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {ex.optionsOrderTokens.map((token, tIdx) => {
                          const isPicked = selected.includes(token);
                          return (
                            <button
                              key={`${token}-${tIdx}`}
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

                    {/* Student assembly preview */}
                    <div className="p-3.5 rounded-2xl bg-white border-2 border-stone-200 min-h-[50px] flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-stone-400">إِعْرَابُكَ:</span>
                        {selected.length === 0 ? (
                          <span className="text-xs text-stone-400 italic">
                            (انْقُرْ فَوْقَ الكَلِمَاتِ فِي الأَعْلَى لِتَرْكِيبِ الإِعْرَابِ)
                          </span>
                        ) : (
                          selected.map((t, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-950 font-black text-sm"
                            >
                              {t}
                            </span>
                          ))
                        )}
                      </div>

                      <button
                        onClick={() => handleCheckParsingAnswer(ex.id, ex.correctTokens)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-all cursor-pointer"
                      >
                        تَحَقَّقْ وَاكْشِفِ النَّمُوذَجَ الصَّائِبَ ✨
                      </button>
                    </div>

                    {/* Model Answer & Reason */}
                    {isRevealed && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2 animate-fadeIn">
                        <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                          <CheckCircle2 size={18} className="text-emerald-600" />
                          <span>النَّمُوذَجُ الصَّائِبُ لِلْإِعْرَابِ:</span>
                        </div>
                        <p className="text-base md:text-lg font-black text-stone-900 py-1 px-3 bg-white rounded-xl border border-emerald-200 shadow-xs">
                          {ex.modelAnswer}
                        </p>
                        <p className="text-xs text-stone-600 font-medium">
                          💡 <span className="font-bold text-stone-800">التَّعْلِيلُ:</span> {ex.reasonTip}
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

      {/* Certificate Call-to-Action */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-right">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Award size={28} className="text-yellow-200" />
            <h3 className="text-xl md:text-2xl font-black">
              أَنْتَ الآنَ بَطَلٌ فِي الإِعْرَابِ!
            </h3>
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
