/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SectionTab } from './types';
import { Header } from './components/Header';
import { StoryIntro } from './components/StoryIntro';
import { GrammarLessons } from './components/GrammarLessons';
import { ParsingExamples } from './components/ParsingExamples';
import { QuizSection } from './components/QuizSection';
import { SentenceLab } from './components/SentenceLab';
import { PrintableUnit } from './components/PrintableUnit';
import { CertificateModal } from './components/CertificateModal';
import { sounds } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<SectionTab>('intro');
  const [starsCount, setStarsCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ar_grammar_stars');
      return saved ? parseInt(saved, 10) : 3; // Start with 3 bonus stars to motivate!
    }
    return 3;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [largeFont, setLargeFont] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('ar_grammar_stars', starsCount.toString());
  }, [starsCount]);

  const handleEarnStar = () => {
    setStarsCount((prev) => prev + 1);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setSoundEnabled(next);
  };

  return (
    <div
      className={`min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-['Baloo_Bhaijaan_2',system-ui,sans-serif] ${
        largeFont ? 'text-lg' : 'text-base'
      }`}
    >
      {/* Interactive Navigation Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        starsCount={starsCount}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        largeFont={largeFont}
        onToggleLargeFont={() => setLargeFont(!largeFont)}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-6 md:py-8">
        {currentTab === 'intro' && (
          <StoryIntro
            onGoToLessons={() => setCurrentTab('lessons')}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentTab === 'lessons' && (
          <GrammarLessons
            onGoToExamples={() => setCurrentTab('examples')}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentTab === 'examples' && (
          <ParsingExamples
            onGoToQuiz={() => setCurrentTab('quiz')}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentTab === 'quiz' && (
          <QuizSection
            onEarnStar={handleEarnStar}
            onOpenCertificate={() => setIsCertificateOpen(true)}
          />
        )}

        {currentTab === 'lab' && <SentenceLab onEarnStar={handleEarnStar} />}

        {currentTab === 'printable' && <PrintableUnit />}
      </main>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        starsCount={starsCount}
      />

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
                setCurrentTab('intro');
              }}
              className="hover:text-amber-700 cursor-pointer"
            >
              المُقَدِّمَةُ
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentTab('lessons');
              }}
              className="hover:text-amber-700 cursor-pointer"
            >
              الدُّرُوسُ
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentTab('examples');
              }}
              className="hover:text-amber-700 cursor-pointer"
            >
              الأَمْثِلَةُ (5)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentTab('quiz');
              }}
              className="hover:text-amber-700 cursor-pointer"
            >
              التَّمَارِينُ
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentTab('lab');
              }}
              className="hover:text-amber-700 cursor-pointer"
            >
              المُخْتَبَرُ
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentTab('printable');
              }}
              className="hover:text-amber-700 cursor-pointer text-amber-800 font-black"
            >
              النُّسْخَةُ الوَرَقِيَّةُ 🖨️
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
