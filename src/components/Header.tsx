import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Award, Printer, GraduationCap, ZoomIn, ZoomOut } from 'lucide-react';
import { SectionTab } from '../types';
import { sounds } from '../utils/audio';

interface HeaderProps {
  currentTab: SectionTab;
  onSelectTab: (tab: SectionTab) => void;
  starsCount: number;
  onOpenCertificate: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  largeFont: boolean;
  onToggleLargeFont: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  starsCount,
  onOpenCertificate,
  soundEnabled,
  onToggleSound,
  largeFont,
  onToggleLargeFont,
}) => {
  const tabs: { id: SectionTab; label: string; icon: string; badge?: string }[] = [
    { id: 'intro', label: 'المُقَدِّمَةُ وَالقِصَّةُ', icon: '📖' },
    { id: 'lessons', label: 'دُرُوسُ الإِعْرَابِ', icon: '🎓' },
    { id: 'examples', label: 'النَّمَاذِجُ المِثَالِيَّةُ (5)', icon: '🌟' },
    { id: 'quiz', label: 'بَنْكُ التَّمَارِينِ', icon: '🎯', badge: 'تَفَاعُلِي' },
    { id: 'lab', label: 'مُخْتَبَرُ الجُمَلِ', icon: '🧪' },
    { id: 'printable', label: 'الكُرَّاسُ وَالطِّبَاعَةُ', icon: '🖨️' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-sm print:hidden">
      {/* Top Banner */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Mascot */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-2xl shadow-md border-2 border-amber-300">
            🦉
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                السَّنَة الثَّالِثَة ابْتِدَائِيّ
              </span>
              <span className="text-xs text-stone-500 hidden sm:inline">عُمُر 8 - 9 سَنَوَات</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-amber-950 tracking-tight leading-tight">
              وَحْدَةُ تَعْلِيمِ الإِعْرَابِ: الفَاعِلُ وَالمَفْعُولُ بِهِ
            </h1>
          </div>
        </div>

        {/* Controls & Gamification */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Font Resizer */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleLargeFont();
            }}
            title={largeFont ? 'تصغير الخط' : 'تكبير الخط'}
            className="p-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 flex items-center gap-1 text-xs font-bold transition-all"
          >
            {largeFont ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
            <span className="hidden sm:inline">{largeFont ? 'خَطٌّ عَادِيّ' : 'تَكْبِيرُ الخَطّ'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) sounds.playCorrect();
            }}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-stone-100 text-stone-500 border-stone-200'
            }`}
            title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تشغيل الأصوات'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="hidden sm:inline">{soundEnabled ? 'الصَّوْتُ شَغَّال' : 'صَامِت'}</span>
          </button>

          {/* Stars / Gamification */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black text-sm shadow-sm border border-amber-300">
            <span className="text-lg">⭐</span>
            <span>{starsCount}</span>
            <span className="text-xs hidden md:inline">نَجْمَة</span>
          </div>

          {/* Certificate Button */}
          <button
            onClick={() => {
              sounds.playFanfare();
              onOpenCertificate();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs md:text-sm shadow-sm transition-all"
          >
            <Award size={16} />
            <span>الشَّهَادَةُ</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <nav className="flex gap-1.5 md:gap-2 pb-2 pt-1 min-w-max">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectTab(tab.id);
                }}
                className={`relative px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 ring-2 ring-amber-400/50'
                    : 'bg-white hover:bg-amber-50 text-stone-700 border border-stone-200/80 hover:border-amber-300'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-amber-800 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
