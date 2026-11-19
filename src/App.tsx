/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  SectionTab,
  StudentProfile,
  ProgressState,
  StudentAccount,
  MistakeItem,
} from './types';
import { Header } from './components/Header';
import { StoryIntro } from './components/StoryIntro';
import { GrammarLessons } from './components/GrammarLessons';
import { ParsingExamples } from './components/ParsingExamples';
import { QuizSection } from './components/QuizSection';
import { SentenceLab } from './components/SentenceLab';
import { PrintableUnit } from './components/PrintableUnit';
import { StudentProfileView } from './components/StudentProfileView';
import { CertificateModal } from './components/CertificateModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { sounds, stopSpeech, setSpeechRateMode } from './utils/audio';
import {
  MCQ_QUESTIONS,
  DIACRITICS_QUESTIONS,
  PARSING_EXERCISES,
  WORD_HUNTER_QUESTIONS,
  GRAMMAR_DICTIONARY_TERMS,
} from './data/curriculumData';

const createDefaultProgress = (): ProgressState => ({
  mcqAnswers: {},
  diacriticAnswers: {},
  parsingSelectedTokens: { 1: [], 2: [], 3: [] },
  parsingRevealed: {},
  parsingSolved: {},
  wordHunterAnswers: {},
  challengeSolvedCount: 0,
  introWordChoices: {},
  introSentenceChoice: null,
  lookedUpDictionaryIds: [],
  awardedRewards: [],
  mistakes: [],
});

const getRankTitle = (stars: number) => {
  if (stars >= 25) return '👑 عَبْقَرِيُّ الإِعْرَابِ الكَبِيرُ';
  if (stars >= 15) return '🥇 قَنَّاصُ المَفْعُولِ بِهِ المَنْصُوبِ';
  if (stars >= 8) return '🥈 فَارِسُ الفَاعِلِ المَرْفُوعِ';
  return '🥉 مُحَقِّقُ النَّحْوِ المُبْتَدِئُ';
};

const createDefaultProfile = (name = 'أَحْمَدُ البَطَلُ', avatar = '👦'): StudentProfile => ({
  name,
  avatar,
  grade: 'السَّنَةُ الثَّالِثَةُ ابْتِدَائِيّ',
  school: 'مَدْرَسَةُ الأَبْطَالِ النُّجَبَاءِ',
  levelTitle: 'مُحَقِّقُ النَّحْوِ الصَّغِيرُ',
  totalStars: 3,
  mcqCompleted: 0,
  diacriticsCompleted: 0,
  parsingCompleted: 0,
  wordHunterCompleted: 0,
  dictionaryLookups: 0,
  joinedDate: '2026',
  favoriteWord: 'العُصْفُورُ',
});

const sanitizeProgress = (raw: unknown): ProgressState => {
  const base = createDefaultProgress();
  if (!raw || typeof raw !== 'object') return base;
  const obj = raw as Partial<ProgressState>;
  return {
    ...base,
    ...obj,
    parsingSelectedTokens: {
      ...base.parsingSelectedTokens,
      ...(obj.parsingSelectedTokens || {}),
    },
    wordHunterAnswers: obj.wordHunterAnswers || {},
    challengeSolvedCount: typeof obj.challengeSolvedCount === 'number' ? obj.challengeSolvedCount : 0,
    awardedRewards: Array.isArray(obj.awardedRewards) ? obj.awardedRewards : [],
    lookedUpDictionaryIds: Array.isArray(obj.lookedUpDictionaryIds)
      ? obj.lookedUpDictionaryIds
      : [],
    mistakes: Array.isArray(obj.mistakes) ? obj.mistakes : [],
  };
};

interface AccountsStore {
  activeAccountId: string;
  accounts: StudentAccount[];
}

const loadInitialAccounts = (): AccountsStore => {
  if (typeof window === 'undefined') {
    return {
      activeAccountId: 'student-1',
      accounts: [
        {
          id: 'student-1',
          profile: createDefaultProfile(),
          starsCount: 3,
          progress: createDefaultProgress(),
        },
      ],
    };
  }

  const savedStore = localStorage.getItem('ar_grammar_accounts_v1');
  if (savedStore) {
    try {
      const parsed = JSON.parse(savedStore);
      if (parsed && Array.isArray(parsed.accounts) && parsed.accounts.length > 0) {
        const cleanedAccounts: StudentAccount[] = parsed.accounts.map((acc: StudentAccount) => ({
          id: acc.id || `student-${Date.now()}`,
          profile: { ...createDefaultProfile(), ...(acc.profile || {}) },
          starsCount: Number.isFinite(acc.starsCount) && acc.starsCount >= 0 ? acc.starsCount : 3,
          progress: sanitizeProgress(acc.progress),
        }));
        const activeId = cleanedAccounts.some((a) => a.id === parsed.activeAccountId)
          ? parsed.activeAccountId
          : cleanedAccounts[0].id;
        return { activeAccountId: activeId, accounts: cleanedAccounts };
      }
    } catch {
      // fallback to legacy migration
    }
  }

  // Migrate from single-student storage if present
  let legacyProfile = createDefaultProfile();
  let legacyStars = 3;
  let legacyProgress = createDefaultProgress();

  try {
    const rawProf = localStorage.getItem('ar_student_profile');
    if (rawProf) legacyProfile = { ...legacyProfile, ...JSON.parse(rawProf) };
  } catch {
    // ignore
  }
  const rawStars = localStorage.getItem('ar_grammar_stars');
  const parsedStars = rawStars ? parseInt(rawStars, 10) : NaN;
  if (Number.isFinite(parsedStars) && parsedStars >= 0) legacyStars = parsedStars;

  try {
    const rawProg = localStorage.getItem('ar_grammar_progress_v1');
    if (rawProg) legacyProgress = sanitizeProgress(JSON.parse(rawProg));
  } catch {
    // ignore
  }

  return {
    activeAccountId: 'student-1',
    accounts: [
      {
        id: 'student-1',
        profile: legacyProfile,
        starsCount: legacyStars,
        progress: legacyProgress,
      },
    ],
  };
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<SectionTab>('intro');
  const [store, setStore] = useState<AccountsStore>(loadInitialAccounts);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [speechRateMode, setSpeechRateModeState] = useState<'slow' | 'normal'>('normal');
  const [largeFont, setLargeFont] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('ar_grammar_accounts_v1', JSON.stringify(store));
  }, [store]);

  const activeAccount = useMemo(
    () => store.accounts.find((a) => a.id === store.activeAccountId) || store.accounts[0],
    [store]
  );

  const progress = activeAccount.progress;
  const starsCount = activeAccount.starsCount;

  const updateActiveAccount = (updater: (acc: StudentAccount) => StudentAccount) => {
    setStore((prev) => ({
      ...prev,
      accounts: prev.accounts.map((acc) =>
        acc.id === prev.activeAccountId ? updater(acc) : acc
      ),
    }));
  };

  const updateProgress = (updater: (prev: ProgressState) => ProgressState) => {
    updateActiveAccount((acc) => ({
      ...acc,
      progress: updater(acc.progress),
    }));
  };

  const syncedProfile = useMemo<StudentProfile>(() => {
    const mcqCompleted = MCQ_QUESTIONS.filter((q) => {
      const chosenId = progress.mcqAnswers[q.id];
      return q.options.some((opt) => opt.id === chosenId && opt.isCorrect);
    }).length;

    const diacriticsCompleted = DIACRITICS_QUESTIONS.filter((q) => {
      const chosenLabel = progress.diacriticAnswers[q.id];
      return q.options.some((opt) => opt.label === chosenLabel && opt.isCorrect);
    }).length;

    const parsingCompleted = PARSING_EXERCISES.filter((ex) => progress.parsingSolved[ex.id]).length;

    const wordHunterCompleted = WORD_HUNTER_QUESTIONS.filter((q) => {
      const chosenIdx = progress.wordHunterAnswers[q.id];
      return chosenIdx !== undefined && q.words[chosenIdx]?.isTarget;
    }).length;

    return {
      ...activeAccount.profile,
      totalStars: starsCount,
      levelTitle: getRankTitle(starsCount),
      mcqCompleted,
      diacriticsCompleted,
      parsingCompleted,
      wordHunterCompleted,
      dictionaryLookups: progress.lookedUpDictionaryIds.length,
    };
  }, [activeAccount.profile, progress, starsCount]);

  const introCompletedCount = useMemo(() => {
    const wordCorrectCount = [
      progress.introWordChoices[0] === 'فعل',
      progress.introWordChoices[1] === 'اسم',
      progress.introWordChoices[2] === 'حرف',
    ].filter(Boolean).length;
    const sentenceCorrectCount = progress.introSentenceChoice === 'فعلية' ? 1 : 0;
    return wordCorrectCount + sentenceCorrectCount;
  }, [progress.introWordChoices, progress.introSentenceChoice]);

  const overallProgressPercent = useMemo(() => {
    const totalMilestones =
      4 +
      MCQ_QUESTIONS.length +
      DIACRITICS_QUESTIONS.length +
      PARSING_EXERCISES.length +
      WORD_HUNTER_QUESTIONS.length +
      GRAMMAR_DICTIONARY_TERMS.length;
    const completedMilestones =
      introCompletedCount +
      syncedProfile.mcqCompleted +
      syncedProfile.diacriticsCompleted +
      syncedProfile.parsingCompleted +
      syncedProfile.wordHunterCompleted +
      syncedProfile.dictionaryLookups;

    return Math.min(100, Math.round((completedMilestones / totalMilestones) * 100));
  }, [introCompletedCount, syncedProfile]);

  const handleEarnStar = (rewardId?: string) => {
    updateActiveAccount((acc) => {
      if (rewardId && acc.progress.awardedRewards.includes(rewardId)) {
        return acc;
      }
      return {
        ...acc,
        starsCount: acc.starsCount + 1,
        progress: rewardId
          ? {
              ...acc.progress,
              awardedRewards: [...acc.progress.awardedRewards, rewardId],
            }
          : acc.progress,
      };
    });
  };

  const handleDictionaryLookup = (termId: string) => {
    const rewardId = `dict-${termId}`;
    updateActiveAccount((acc) => {
      const isNewLookup = !acc.progress.lookedUpDictionaryIds.includes(termId);
      const isNewReward = !acc.progress.awardedRewards.includes(rewardId);
      if (!isNewLookup && !isNewReward) return acc;

      return {
        ...acc,
        starsCount: isNewReward ? acc.starsCount + 1 : acc.starsCount,
        progress: {
          ...acc.progress,
          lookedUpDictionaryIds: isNewLookup
            ? [...acc.progress.lookedUpDictionaryIds, termId]
            : acc.progress.lookedUpDictionaryIds,
          awardedRewards: isNewReward
            ? [...acc.progress.awardedRewards, rewardId]
            : acc.progress.awardedRewards,
        },
      };
    });
  };

  const handleRecordMistake = (mistake: MistakeItem) => {
    updateProgress((prev) => {
      const filtered = prev.mistakes.filter((m) => m.id !== mistake.id);
      return {
        ...prev,
        mistakes: [mistake, ...filtered].slice(0, 20),
      };
    });
  };

  const handleResolveMistake = (mistakeId: string) => {
    updateProgress((prev) => ({
      ...prev,
      mistakes: prev.mistakes.map((m) => (m.id === mistakeId ? { ...m, resolved: true } : m)),
    }));
  };

  const handleUpdateProfile = (updated: StudentProfile) => {
    updateActiveAccount((acc) => ({
      ...acc,
      profile: updated,
    }));
  };

  const handleSwitchAccount = (id: string) => {
    stopSpeech();
    setStore((prev) => ({
      ...prev,
      activeAccountId: id,
    }));
  };

  const handleCreateAccount = (name: string, avatar: string) => {
    const newId = `student-${Date.now()}`;
    const newAccount: StudentAccount = {
      id: newId,
      profile: createDefaultProfile(name, avatar),
      starsCount: 3,
      progress: createDefaultProgress(),
    };
    setStore((prev) => ({
      activeAccountId: newId,
      accounts: [...prev.accounts, newAccount],
    }));
  };

  const handleDeleteAccount = (id: string) => {
    setStore((prev) => {
      if (prev.accounts.length <= 1) return prev;
      const remaining = prev.accounts.filter((a) => a.id !== id);
      const nextActive =
        prev.activeAccountId === id ? remaining[0].id : prev.activeAccountId;
      return {
        activeAccountId: nextActive,
        accounts: remaining,
      };
    });
  };

  const handleResetCurrentProgress = () => {
    updateActiveAccount((acc) => ({
      ...acc,
      starsCount: 3,
      progress: createDefaultProgress(),
    }));
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setSoundEnabled(next);
  };

  const handleToggleSpeechRate = () => {
    const next = speechRateMode === 'normal' ? 'slow' : 'normal';
    setSpeechRateModeState(next);
    setSpeechRateMode(next);
  };

  const handleSelectTab = (tab: SectionTab) => {
    stopSpeech();
    setCurrentTab(tab);
  };

  const totalCompletedExercises =
    syncedProfile.mcqCompleted +
    syncedProfile.diacriticsCompleted +
    syncedProfile.parsingCompleted +
    syncedProfile.wordHunterCompleted;

  return (
    <div
      className={`min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-['Baloo_Bhaijaan_2',system-ui,sans-serif] ${
        largeFont ? 'text-lg' : 'text-base'
      }`}
    >
      {/* Interactive Navigation Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        starsCount={starsCount}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        speechRateMode={speechRateMode}
        onToggleSpeechRate={handleToggleSpeechRate}
        largeFont={largeFont}
        onToggleLargeFont={() => setLargeFont(!largeFont)}
        profile={syncedProfile}
        overallProgressPercent={overallProgressPercent}
      />

      {/* Main Content Area (hidden on print when CertificateModal is open) */}
      <main
        className={`flex-grow max-w-6xl w-full mx-auto px-4 py-6 md:py-8 ${
          isCertificateOpen ? 'print:hidden' : ''
        }`}
      >
        {currentTab === 'intro' && (
          <StoryIntro
            onGoToLessons={() => handleSelectTab('lessons')}
            onEarnStar={handleEarnStar}
            wordChoices={progress.introWordChoices}
            onSelectWordChoice={(idx, type) =>
              updateProgress((prev) => ({
                ...prev,
                introWordChoices: { ...prev.introWordChoices, [idx]: type },
              }))
            }
            sentenceChoice={progress.introSentenceChoice}
            onSelectSentenceChoice={(type) =>
              updateProgress((prev) => ({
                ...prev,
                introSentenceChoice: type,
              }))
            }
          />
        )}

        {currentTab === 'lessons' && (
          <GrammarLessons
            onGoToExamples={() => handleSelectTab('examples')}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentTab === 'examples' && (
          <ParsingExamples
            onGoToQuiz={() => handleSelectTab('quiz')}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentTab === 'quiz' && (
          <QuizSection
            onEarnStar={handleEarnStar}
            onOpenCertificate={() => setIsCertificateOpen(true)}
            mcqAnswers={progress.mcqAnswers}
            onSelectMCQ={(qId, optId) =>
              updateProgress((prev) => ({
                ...prev,
                mcqAnswers: { ...prev.mcqAnswers, [qId]: optId },
              }))
            }
            onResetMCQ={() =>
              updateProgress((prev) => ({
                ...prev,
                mcqAnswers: {},
              }))
            }
            diacriticAnswers={progress.diacriticAnswers}
            onSelectDiacritic={(qId, label) =>
              updateProgress((prev) => ({
                ...prev,
                diacriticAnswers: { ...prev.diacriticAnswers, [qId]: label },
              }))
            }
            onResetDiacritics={() =>
              updateProgress((prev) => ({
                ...prev,
                diacriticAnswers: {},
              }))
            }
            parsingSelectedTokens={progress.parsingSelectedTokens}
            onUpdateParsingTokens={(exId, tokens) =>
              updateProgress((prev) => ({
                ...prev,
                parsingSelectedTokens: {
                  ...prev.parsingSelectedTokens,
                  [exId]: tokens,
                },
              }))
            }
            parsingRevealed={progress.parsingRevealed}
            parsingSolved={progress.parsingSolved}
            onRevealParsing={(exId, isExact) =>
              updateProgress((prev) => ({
                ...prev,
                parsingRevealed: { ...prev.parsingRevealed, [exId]: true },
                parsingSolved: isExact
                  ? { ...prev.parsingSolved, [exId]: true }
                  : prev.parsingSolved,
              }))
            }
            onResetParsing={() =>
              updateProgress((prev) => ({
                ...prev,
                parsingSelectedTokens: { 1: [], 2: [], 3: [] },
                parsingRevealed: {},
                parsingSolved: {},
              }))
            }
            wordHunterAnswers={progress.wordHunterAnswers}
            onSelectWordHunter={(qId, wordIdx) =>
              updateProgress((prev) => ({
                ...prev,
                wordHunterAnswers: { ...prev.wordHunterAnswers, [qId]: wordIdx },
              }))
            }
            onResetWordHunter={() =>
              updateProgress((prev) => ({
                ...prev,
                wordHunterAnswers: {},
              }))
            }
            onIncrementChallengeSolved={() =>
              updateProgress((prev) => ({
                ...prev,
                challengeSolvedCount: prev.challengeSolvedCount + 1,
              }))
            }
            mistakes={progress.mistakes}
            onRecordMistake={handleRecordMistake}
            onResolveMistake={handleResolveMistake}
          />
        )}

        {currentTab === 'lab' && (
          <SentenceLab
            onEarnStar={handleEarnStar}
            onDictionaryLookup={handleDictionaryLookup}
            lookedUpDictionaryIds={progress.lookedUpDictionaryIds}
          />
        )}

        {currentTab === 'printable' && <PrintableUnit />}

        {currentTab === 'profile' && (
          <StudentProfileView
            profile={syncedProfile}
            onUpdateProfile={handleUpdateProfile}
            starsCount={starsCount}
            onOpenCertificate={() => setIsCertificateOpen(true)}
            introCompletedCount={introCompletedCount}
            overallProgressPercent={overallProgressPercent}
            accounts={store.accounts}
            activeAccountId={store.activeAccountId}
            onSwitchAccount={handleSwitchAccount}
            onCreateAccount={handleCreateAccount}
            onDeleteAccount={handleDeleteAccount}
            onResetCurrentProgress={handleResetCurrentProgress}
          />
        )}
      </main>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        starsCount={starsCount}
        studentName={syncedProfile.name}
        studentAvatar={syncedProfile.avatar}
        totalCompletedExercises={totalCompletedExercises}
      />

      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Child-friendly Footer */}
      <footer className="mt-auto border-t-2 border-stone-200/80 bg-white py-6 px-4 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs md:text-sm text-stone-600">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦉</span>
            <span className="font-black text-amber-950">
              وَحْدَةُ الإِعْرَابِ المُيَسَّرِ • الصَّفُّ الثَّالِثُ الِابْتِدَائِيُّ
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 font-bold">
            <button
              onClick={() => {
                sounds.playClick();
                handleSelectTab('intro');
              }}
              className="hover:text-amber-700 cursor-pointer"
            >
              المُقَدِّمَةُ
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sounds.playClick();
                handleSelectTab('lessons');
              }}
              className="hover:text-amber-700 cursor-pointer"
            >
              الدُّرُوسُ
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sounds.playClick();
                handleSelectTab('examples');
              }}
              className="hover:text-amber-700 cursor-pointer"
            >
              الأَمْثِلَةُ (5)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sounds.playClick();
                handleSelectTab('quiz');
              }}
              className="hover:text-amber-700 cursor-pointer"
            >
              التَّمَارِينُ
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sounds.playClick();
                handleSelectTab('lab');
              }}
              className="hover:text-amber-700 cursor-pointer"
            >
              المُخْتَبَرُ
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sounds.playClick();
                handleSelectTab('printable');
              }}
              className="hover:text-amber-700 cursor-pointer text-amber-800 font-black"
            >
              النُّسْخَةُ الوَرَقِيَّةُ 🖨️
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sounds.playClick();
                handleSelectTab('profile');
              }}
              className="hover:text-amber-700 cursor-pointer text-amber-900 font-black"
            >
              المَلَفُّ الشَّخْصِيُّ 👤
            </button>
          </div>

          <div className="text-stone-400 text-xs">
            مُصَمَّمٌ بِحُبٍّ لِصِغَارِنَا لِتَيْسِيرِ لُغَةِ الضَّادِ ❤️
          </div>
        </div>
      </footer>
    </div>
  );
}
